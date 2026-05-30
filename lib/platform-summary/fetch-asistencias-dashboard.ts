import type { Firestore } from 'firebase-admin/firestore'
import { computeDashboardSummary } from '@/lib/asistencias-compute'
import {
  countDocuments,
  fetchDocumentsByIds,
  getDashboardWindowStart,
  parseFirestoreDate,
  querySinceTimestamp,
  scanCollectionFields,
} from '@/lib/firestore-dashboard-queries'

export async function fetchAsistenciasDashboardSummary(db: Firestore) {
  const since = getDashboardWindowStart(6)

  let attendanceRows: FirebaseFirestore.DocumentData[]
  try {
    attendanceRows = await querySinceTimestamp(db, 'attendance_records', 'timestamp', since, [
      'userId',
      'grupoCultural',
      'timestamp',
    ])
  } catch {
    const all = await scanCollectionFields(db, 'attendance_records', [
      'userId',
      'grupoCultural',
      'timestamp',
    ])
    attendanceRows = all.filter((d) => {
      const ts = parseFirestoreDate(d.timestamp)
      return ts && ts >= since
    })
  }

  const [totalAsistenciasAll, groupsRows] = await Promise.all([
    countDocuments(db, 'attendance_records'),
    scanCollectionFields(db, 'cultural_groups', ['nombre']),
  ])

  const userIds = attendanceRows
    .map((d) => d.userId as string)
    .filter((id): id is string => Boolean(id))

  const userMap = await fetchDocumentsByIds(db, 'user_profiles', userIds)

  const records: Array<{
    timestamp: Date
    genero: 'MUJER' | 'HOMBRE' | 'OTRO'
    estamento: string
    numeroDocumento: string
    grupoCultural: string
  }> = []

  for (const d of attendanceRows) {
    const user = userMap.get(d.userId as string)
    if (!user) continue
    const ts = parseFirestoreDate(d.timestamp)
    if (!ts) continue
    const g = String(user.genero ?? 'OTRO').toUpperCase()
    records.push({
      timestamp: ts,
      genero: g === 'MUJER' ? 'MUJER' : g === 'HOMBRE' ? 'HOMBRE' : 'OTRO',
      estamento: String(user.estamento ?? 'INVITADO'),
      numeroDocumento: String(user.numeroDocumento ?? d.userId),
      grupoCultural: String(d.grupoCultural ?? 'Sin grupo'),
    })
  }

  const groups = groupsRows.map((g, i) => ({
    id: `g-${i}`,
    nombre: String(g.nombre ?? 'Sin nombre'),
    createdAt: new Date(),
    activo: true,
  }))

  const summary = computeDashboardSummary(records, groups)
  return {
    ...summary,
    totalAsistencias: totalAsistenciasAll,
    gruposActivos: groups.length,
  }
}
