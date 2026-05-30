import type { Firestore } from 'firebase-admin/firestore'
import { getAsistenciasDb } from '@/lib/firebase-asistencias-admin'
import { getAsistenciasDeporteDb } from '@/lib/firebase-asistencias-deporte-admin'
import { getGymCduDb } from '@/lib/firebase-gym-cdu-admin'
import { getStockCduDb } from '@/lib/firebase-stock-cdu-admin'
import { getStockCulturaDb } from '@/lib/firebase-stock-cultura-admin'
import { getPrestamosDb } from '@/lib/firebase-prestamos-admin'
import { scanCollectionFields } from '@/lib/firestore-dashboard-queries'
import { normalizeDocument, normalizeCode } from './normalize'
import type { PersonRegistryStats, PersonSystemId } from './types'
import { getCachedPersonStats, setCachedPersonStats } from './stats-cache'
import {
  loadPersistedPersonRegistryStats,
  savePersistedPersonRegistryStats,
} from './stats-persist'

const CULTURA_SYSTEMS: PersonSystemId[] = ['asistencias_cultura', 'stock_cultura']
const DEPORTE_SYSTEMS: PersonSystemId[] = [
  'asistencias_deporte',
  'gym_cdu',
  'stock_cdu',
  'prestamos_escenarios',
]
const ALL_SYSTEMS: PersonSystemId[] = [
  'asistencias_cultura',
  'asistencias_deporte',
  'gym_cdu',
  'stock_cdu',
  'stock_cultura',
  'prestamos_escenarios',
]

type IndexMaps = {
  docToSystems: Map<string, Set<PersonSystemId>>
  systemsConnected: PersonSystemId[]
  systemsUnavailable: string[]
}

function initMaps(): IndexMaps {
  return {
    docToSystems: new Map(),
    systemsConnected: [],
    systemsUnavailable: [],
  }
}

function addPerson(
  maps: IndexMaps,
  system: PersonSystemId,
  docRaw?: string | null,
  codeRaw?: string | null
) {
  const doc = normalizeDocument(docRaw)
  const code = normalizeCode(codeRaw)
  if (doc) {
    if (!maps.docToSystems.has(doc)) maps.docToSystems.set(doc, new Set())
    maps.docToSystems.get(doc)!.add(system)
  }
  if (code && doc) {
    if (!maps.docToSystems.has(doc)) maps.docToSystems.set(doc, new Set())
    maps.docToSystems.get(doc)!.add(system)
  }
}

async function indexAsistencias(db: Firestore, system: PersonSystemId, maps: IndexMaps) {
  const rows = await scanCollectionFields(db, 'user_profiles', [
    'numeroDocumento',
    'codigoEstudiantil',
  ])
  for (const d of rows) {
    addPerson(maps, system, d.numeroDocumento, d.codigoEstudiantil)
  }
}

async function indexGym(db: Firestore, maps: IndexMaps) {
  const rows = await scanCollectionFields(db, 'users', ['numeroDocumento', 'codigoEstudiantil'])
  for (const d of rows) {
    addPerson(maps, 'gym_cdu', d.numeroDocumento, d.codigoEstudiantil)
  }
}

async function indexStock(db: Firestore, system: PersonSystemId, maps: IndexMaps) {
  const rows = await scanCollectionFields(db, 'users', ['cedula', 'codigoEstudiantil'])
  for (const d of rows) {
    addPerson(maps, system, d.cedula, d.codigoEstudiantil)
  }
}

async function indexPrestamos(db: Firestore, maps: IndexMaps) {
  const rows = await scanCollectionFields(db, 'usuarios', [
    'carnet',
    'numeroDocumento',
    'codigoEstudiante',
  ])
  for (const d of rows) {
    addPerson(maps, 'prestamos_escenarios', d.carnet ?? d.numeroDocumento, d.codigoEstudiante)
  }
}

function computeStats(maps: IndexMaps): PersonRegistryStats {
  const connected = maps.systemsConnected
  const culturaDocs = new Set<string>()
  const deporteDocs = new Set<string>()

  maps.docToSystems.forEach((systems, doc) => {
    if (CULTURA_SYSTEMS.some((s) => connected.includes(s) && systems.has(s))) culturaDocs.add(doc)
    if (DEPORTE_SYSTEMS.some((s) => connected.includes(s) && systems.has(s))) deporteDocs.add(doc)
  })

  let personasAmbasAreas = 0
  culturaDocs.forEach((doc) => {
    if (deporteDocs.has(doc)) personasAmbasAreas++
  })

  return {
    systemsConnected: connected,
    systemsUnavailable: maps.systemsUnavailable,
    personasCultura: culturaDocs.size,
    personasDeporte: deporteDocs.size,
    personasAmbasAreas,
    generatedAt: new Date().toISOString(),
  }
}

export async function buildPersonRegistryStats(): Promise<PersonRegistryStats> {
  const maps = initMaps()

  const tasks: { id: PersonSystemId; label: string; run: () => Promise<void> }[] = [
    {
      id: 'asistencias_cultura',
      label: 'Asistencias Cultura',
      run: async () => {
        await indexAsistencias(getAsistenciasDb(), 'asistencias_cultura', maps)
        maps.systemsConnected.push('asistencias_cultura')
      },
    },
    {
      id: 'asistencias_deporte',
      label: 'Asistencias Deporte',
      run: async () => {
        await indexAsistencias(getAsistenciasDeporteDb(), 'asistencias_deporte', maps)
        maps.systemsConnected.push('asistencias_deporte')
      },
    },
    {
      id: 'gym_cdu',
      label: 'Gym CDU',
      run: async () => {
        await indexGym(getGymCduDb(), maps)
        maps.systemsConnected.push('gym_cdu')
      },
    },
    {
      id: 'stock_cdu',
      label: 'Stock CDU',
      run: async () => {
        await indexStock(getStockCduDb(), 'stock_cdu', maps)
        maps.systemsConnected.push('stock_cdu')
      },
    },
    {
      id: 'stock_cultura',
      label: 'Stock Cultura',
      run: async () => {
        await indexStock(getStockCulturaDb(), 'stock_cultura', maps)
        maps.systemsConnected.push('stock_cultura')
      },
    },
    {
      id: 'prestamos_escenarios',
      label: 'Préstamos escenarios',
      run: async () => {
        const db = getPrestamosDb()
        if (!db) throw new Error('PRESTAMOS_ADMIN_* no configurado')
        await indexPrestamos(db, maps)
        maps.systemsConnected.push('prestamos_escenarios')
      },
    },
  ]

  // Secuencial: evita picos de lecturas que disparan RESOURCE_EXHAUSTED
  for (const t of tasks) {
    try {
      await t.run()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      maps.systemsUnavailable.push(`${t.label}: ${msg}`)
    }
  }

  maps.systemsConnected = ALL_SYSTEMS.filter((id) => maps.systemsConnected.includes(id))
  return computeStats(maps)
}

function statsFromPersisted(
  persisted: Awaited<ReturnType<typeof loadPersistedPersonRegistryStats>>,
  extra?: Partial<PersonRegistryStats>,
): PersonRegistryStats {
  if (!persisted) throw new Error('Sin snapshot guardado')
  const { persistedAt, ...stats } = persisted
  const ageMs = Date.now() - new Date(persistedAt).getTime()
  return {
    ...stats,
    ...extra,
    fromCache: true,
    fromPersistedSnapshot: true,
    cacheAgeMinutes: Math.round(ageMs / 60000),
    generatedAt: stats.generatedAt || persistedAt,
  }
}

export async function buildPersonRegistryStatsCached(
  options?: { forceRefresh?: boolean },
): Promise<PersonRegistryStats> {
  if (!options?.forceRefresh) {
    const hit = getCachedPersonStats()
    if (hit) {
      return {
        ...hit,
        fromCache: true,
        cacheAgeMinutes: null,
      }
    }

    const persisted = await loadPersistedPersonRegistryStats()
    if (persisted) {
      const stats = statsFromPersisted(persisted)
      setCachedPersonStats({
        systemsConnected: stats.systemsConnected,
        systemsUnavailable: stats.systemsUnavailable,
        personasCultura: stats.personasCultura,
        personasDeporte: stats.personasDeporte,
        personasAmbasAreas: stats.personasAmbasAreas,
        generatedAt: stats.generatedAt,
      })
      return stats
    }
  }

  const stats = await buildPersonRegistryStats()

  if (stats.systemsUnavailable.length === 0) {
    setCachedPersonStats(stats)
    await savePersistedPersonRegistryStats(stats).catch((err) => {
      console.warn('[person-registry] No se pudo guardar snapshot:', err)
    })
    return stats
  }

  const persisted = await loadPersistedPersonRegistryStats()
  if (persisted) {
    return statsFromPersisted(persisted, {
      systemsUnavailable: [
        ...stats.systemsUnavailable,
        'Se muestra el último resumen completo guardado (la actualización no terminó).',
      ],
      staleSnapshot: true,
    })
  }

  setCachedPersonStats(stats)
  return stats
}
