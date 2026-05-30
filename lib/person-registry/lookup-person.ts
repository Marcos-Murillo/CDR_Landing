import type { Firestore } from 'firebase-admin/firestore'
import { getAsistenciasDb } from '@/lib/firebase-asistencias-admin'
import { getAsistenciasDeporteDb } from '@/lib/firebase-asistencias-deporte-admin'
import { getGymCduDb } from '@/lib/firebase-gym-cdu-admin'
import { getStockCduDb } from '@/lib/firebase-stock-cdu-admin'
import { getStockCulturaDb } from '@/lib/firebase-stock-cultura-admin'
import { getPrestamosDb } from '@/lib/firebase-prestamos-admin'
import {
  normalizeDocument,
  normalizeCode,
  isValidDocument,
  isValidCode,
} from './normalize'
import { queryByAnyEquality, queryByField, queryByFieldIn } from './firestore-query'
import type {
  PersonLookupResult,
  PersonAreaDetail,
  AsistenciasPersonBlock,
  GymPersonBlock,
  StockPersonBlock,
  PrestamosPersonBlock,
  PersonSystemId,
} from './types'

function formatDate(v: unknown): string | null {
  if (!v) return null
  if (
    typeof v === 'object' &&
    v !== null &&
    'toDate' in v &&
    typeof (v as { toDate: () => Date }).toDate === 'function'
  ) {
    return (v as { toDate: () => Date }).toDate().toISOString().slice(0, 10)
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return null
}

function timestampToMs(v: unknown): number {
  if (!v) return 0
  if (
    typeof v === 'object' &&
    v !== null &&
    'toDate' in v &&
    typeof (v as { toDate: () => Date }).toDate === 'function'
  ) {
    return (v as { toDate: () => Date }).toDate().getTime()
  }
  const d = new Date(v as string | number)
  return isNaN(d.getTime()) ? 0 : d.getTime()
}

async function lookupAsistencias(
  db: Firestore,
  docNorm: string,
  codeNorm: string,
  rawDoc?: string
): Promise<AsistenciasPersonBlock | null> {
  const queries: { field: string; value: string }[] = []
  if (docNorm) {
    queries.push({ field: 'numeroDocumento', value: docNorm })
    if (rawDoc && rawDoc !== docNorm) {
      queries.push({ field: 'numeroDocumento', value: rawDoc.trim() })
    }
  }
  if (codeNorm) {
    queries.push({ field: 'codigoEstudiantil', value: codeNorm })
  }

  const userDocs = await queryByAnyEquality(db, 'user_profiles', queries)
  const matched = userDocs.map((snap) => ({
    id: snap.id,
    nombres: (snap.data().nombres as string) ?? 'Sin nombre',
  }))

  if (matched.length === 0) return null

  const userIds = matched.map((m) => m.id)
  const attDocs = await queryByFieldIn(db, 'attendance_records', 'userId', userIds)

  let totalAsistencias = 0
  let ultimaMs = 0
  const grupos = new Set<string>()

  attDocs.forEach((snap) => {
    const d = snap.data()
    totalAsistencias++
    if (d.grupoCultural) grupos.add(d.grupoCultural as string)
    const ms = timestampToMs(d.timestamp)
    if (ms > ultimaMs) ultimaMs = ms
  })

  const categorias: { grupo: string; categoria: string }[] = []
  try {
    const catDocs = await queryByFieldIn(db, 'group_category_assignments', 'userId', userIds)
    catDocs.forEach((snap) => {
      const d = snap.data()
      if (d.grupoCultural && d.category) {
        categorias.push({
          grupo: d.grupoCultural as string,
          categoria: d.category as string,
        })
      }
    })
  } catch {
    /* opcional */
  }

  const enrollDocs = await queryByFieldIn(db, 'group_enrollments', 'userId', userIds)
  enrollDocs.forEach((snap) => {
    const g = snap.data().grupoCultural
    if (g) grupos.add(g as string)
  })

  return {
    userIds: matched.map((m) => m.id),
    nombres: matched.map((m) => m.nombres),
    grupos: [...grupos],
    totalAsistencias,
    ultimaAsistencia: ultimaMs ? new Date(ultimaMs).toISOString().slice(0, 10) : null,
    categorias,
  }
}

async function lookupGym(docNorm: string, codeNorm: string, rawDoc?: string): Promise<GymPersonBlock | null> {
  const db = getGymCduDb()
  const queries: { field: string; value: string }[] = []
  if (docNorm) {
    queries.push({ field: 'numeroDocumento', value: docNorm })
    if (rawDoc && rawDoc !== docNorm) queries.push({ field: 'numeroDocumento', value: rawDoc.trim() })
  }
  if (codeNorm) queries.push({ field: 'codigoEstudiantil', value: codeNorm })

  const userDocs = await queryByAnyEquality(db, 'users', queries)
  const matched = userDocs.map((snap) => ({
    id: snap.id,
    nombres: (snap.data().nombres as string) ?? 'Sin nombre',
  }))

  if (matched.length === 0) return null

  const userIds = matched.map((m) => m.id)
  const entryDocs = await queryByFieldIn(db, 'entries', 'usuarioId', userIds)

  let totalVisitas = 0
  let ultima: string | null = null
  const porInstalacion: Record<string, number> = {}

  entryDocs.forEach((snap) => {
    const d = snap.data()
    totalVisitas++
    const inst = (d.instalacion as string) ?? 'gimnasio'
    porInstalacion[inst] = (porInstalacion[inst] ?? 0) + 1
    const fecha = typeof d.fecha === 'string' ? d.fecha : formatDate(d.fecha)
    if (fecha && (!ultima || fecha > ultima)) ultima = fecha
  })

  return {
    userIds: matched.map((m) => m.id),
    nombres: matched.map((m) => m.nombres),
    totalVisitas,
    ultimaVisita: ultima,
    porInstalacion,
  }
}

async function lookupStock(
  db: Firestore,
  docNorm: string,
  codeNorm: string,
  rawDoc?: string
): Promise<StockPersonBlock | null> {
  const loanQueries: { field: string; value: string }[] = []
  if (docNorm) {
    loanQueries.push({ field: 'borrowerDocument', value: docNorm })
    if (rawDoc && rawDoc !== docNorm) {
      loanQueries.push({ field: 'borrowerDocument', value: rawDoc.trim() })
    }
  }
  if (codeNorm) loanQueries.push({ field: 'borrowerCode', value: codeNorm })

  const loanDocs = await queryByAnyEquality(db, 'loans', loanQueries)
  const items: StockPersonBlock['items'] = []
  let activos = 0

  loanDocs.forEach((snap) => {
    const d = snap.data()
    const status = (d.status as string) ?? 'active'
    if (status === 'active') activos++
    items.push({
      nombre: (d.itemName as string) ?? 'Ítem',
      fecha: formatDate(d.loanDate) ?? '—',
      estado: status,
    })
  })

  if (items.length > 0) {
    return { totalPrestamos: items.length, activos, items: items.slice(0, 20) }
  }

  const userQueries: { field: string; value: string }[] = []
  if (docNorm) {
    userQueries.push({ field: 'cedula', value: docNorm })
    if (rawDoc && rawDoc !== docNorm) userQueries.push({ field: 'cedula', value: rawDoc.trim() })
  }
  if (codeNorm) userQueries.push({ field: 'codigoEstudiantil', value: codeNorm })

  const userDocs = await queryByAnyEquality(db, 'users', userQueries)
  if (userDocs.length === 0) return null

  return { totalPrestamos: 0, activos: 0, items: [] }
}

async function lookupPrestamos(
  docNorm: string,
  codeNorm: string,
  rawDoc?: string
): Promise<PrestamosPersonBlock | null> {
  const db = getPrestamosDb()
  if (!db) return null

  const userQueries: { field: string; value: string }[] = []
  if (docNorm) {
    userQueries.push({ field: 'carnet', value: docNorm })
    if (rawDoc && rawDoc !== docNorm) userQueries.push({ field: 'carnet', value: rawDoc.trim() })
  }
  if (codeNorm) userQueries.push({ field: 'codigoEstudiante', value: codeNorm })

  const userDocs = await queryByAnyEquality(db, 'usuarios', userQueries)
  const matched = userDocs.map((snap) => {
    const d = snap.data()
    return {
      id: snap.id,
      nombre: `${d.nombre ?? ''} ${d.apellido ?? ''}`.trim() || 'Sin nombre',
    }
  })

  const reservaQueries: { field: string; value: string }[] = []
  if (docNorm) {
    reservaQueries.push({ field: 'usuarioCarnet', value: docNorm })
    if (rawDoc && rawDoc !== docNorm) {
      reservaQueries.push({ field: 'usuarioCarnet', value: rawDoc.trim() })
    }
  }
  if (codeNorm) reservaQueries.push({ field: 'codigoEstudiante', value: codeNorm })

  const reservaByField = await queryByAnyEquality(db, 'reservas', reservaQueries)
  const reservaByUser =
    matched.length > 0
      ? await queryByFieldIn(
          db,
          'reservas',
          'usuarioId',
          matched.map((m) => m.id)
        )
      : []

  const seen = new Set<string>()
  const reservas: PrestamosPersonBlock['reservas'] = []
  const porEstado: Record<string, number> = {}

  ;[...reservaByField, ...reservaByUser].forEach((snap) => {
    if (seen.has(snap.id)) return
    seen.add(snap.id)
    const d = snap.data()
    const estado = (d.estado as string) ?? 'pendiente'
    porEstado[estado] = (porEstado[estado] ?? 0) + 1
    reservas.push({
      cancha: (d.canchaNombre as string) ?? 'Escenario',
      fecha: (d.fecha as string) ?? '—',
      estado,
    })
  })

  if (matched.length === 0 && reservas.length === 0) return null

  return {
    usuarioIds: matched.map((m) => m.id),
    nombres: matched.map((m) => m.nombre),
    totalReservas: reservas.length,
    porEstado,
    reservas: reservas.slice(0, 15),
  }
}

function emptyAreaDetail(): PersonAreaDetail {
  return {
    asistencias: null,
    stock: null,
    prestamosEscenarios: null,
    gym: null,
  }
}

export async function lookupPerson(
  type: 'documento' | 'codigo',
  rawValue: string
): Promise<PersonLookupResult> {
  const docNorm = type === 'documento' ? normalizeDocument(rawValue) : ''
  const codeNorm = type === 'codigo' ? normalizeCode(rawValue) : ''
  const rawDoc = type === 'documento' ? rawValue.trim() : undefined

  if (type === 'documento' && !isValidDocument(docNorm)) {
    return {
      found: false,
      query: { type, value: rawValue },
      nombres: [],
      areas: [],
      sistemas: [],
      cultura: null,
      deporte: null,
    }
  }
  if (type === 'codigo' && !isValidCode(codeNorm)) {
    return {
      found: false,
      query: { type, value: rawValue },
      nombres: [],
      areas: [],
      sistemas: [],
      cultura: null,
      deporte: null,
    }
  }

  const cultura = emptyAreaDetail()
  const deporte = emptyAreaDetail()
  const sistemas: PersonSystemId[] = []
  const nombresSet = new Set<string>()

  try {
    cultura.asistencias = await lookupAsistencias(
      getAsistenciasDb(),
      docNorm,
      codeNorm,
      rawDoc
    )
    if (cultura.asistencias) {
      sistemas.push('asistencias_cultura')
      cultura.asistencias.nombres.forEach((n) => nombresSet.add(n))
    }
  } catch (e) {
    console.error('[lookup] asistencias cultura', e)
  }

  try {
    deporte.asistencias = await lookupAsistencias(
      getAsistenciasDeporteDb(),
      docNorm,
      codeNorm,
      rawDoc
    )
    if (deporte.asistencias) {
      sistemas.push('asistencias_deporte')
      deporte.asistencias.nombres.forEach((n) => nombresSet.add(n))
    }
  } catch (e) {
    console.error('[lookup] asistencias deporte', e)
  }

  try {
    deporte.gym = await lookupGym(docNorm, codeNorm, rawDoc)
    if (deporte.gym) {
      sistemas.push('gym_cdu')
      deporte.gym.nombres.forEach((n) => nombresSet.add(n))
    }
  } catch (e) {
    console.error('[lookup] gym', e)
  }

  try {
    deporte.stock = await lookupStock(getStockCduDb(), docNorm, codeNorm, rawDoc)
    if (deporte.stock) sistemas.push('stock_cdu')
  } catch (e) {
    console.error('[lookup] stock cdu', e)
  }

  try {
    cultura.stock = await lookupStock(getStockCulturaDb(), docNorm, codeNorm, rawDoc)
    if (cultura.stock) sistemas.push('stock_cultura')
  } catch (e) {
    console.error('[lookup] stock cultura', e)
  }

  try {
    const prestamos = await lookupPrestamos(docNorm, codeNorm, rawDoc)
    if (prestamos) {
      sistemas.push('prestamos_escenarios')
      prestamos.nombres.forEach((n) => nombresSet.add(n))
      deporte.prestamosEscenarios = prestamos
    }
  } catch (e) {
    console.error('[lookup] prestamos', e)
  }

  const hasCultura = cultura.asistencias || cultura.stock
  const hasDeporte =
    deporte.asistencias || deporte.gym || deporte.stock || deporte.prestamosEscenarios

  const areas: PersonLookupResult['areas'] = []
  if (hasCultura) areas.push('cultura')
  if (hasDeporte) areas.push('deporte')
  if (hasCultura && hasDeporte) areas.push('ambas')

  return {
    found: sistemas.length > 0,
    query: { type, value: rawValue },
    nombres: [...nombresSet],
    areas,
    sistemas,
    cultura: hasCultura ? cultura : null,
    deporte: hasDeporte ? deporte : null,
  }
}
