import type { Firestore } from 'firebase-admin/firestore'
import { computeGymCduSummary } from '@/app/api/platforms/gym-cdu-summary/compute'
import {
  countDocuments,
  fetchDocumentsByIds,
  querySinceDateString,
  sixMonthDateString,
} from '@/lib/firestore-dashboard-queries'

export async function fetchGymCduDashboardSummary(db: Firestore) {
  const sinceStr = sixMonthDateString()

  const [totalUsuarios, entryRows] = await Promise.all([
    countDocuments(db, 'users'),
    querySinceDateString(db, 'entries', 'fecha', sinceStr, [
      'usuarioId',
      'fecha',
      'hora',
      'instalacion',
    ]),
  ])

  const userIds = [
    ...new Set(
      entryRows
        .map((d) => String(d.usuarioId ?? ''))
        .filter(Boolean),
    ),
  ]

  const userMap = await fetchDocumentsByIds(db, 'users', userIds)
  const users = [...userMap.values()].map((d) => ({
    genero: String(d.genero ?? ''),
    estamento: String(d.estamento ?? ''),
    facultad: String(d.facultad ?? ''),
  }))

  const entries = entryRows.map((d) => ({
    usuarioId: String(d.usuarioId ?? ''),
    fecha: String(d.fecha ?? ''),
    hora: String(d.hora ?? ''),
    instalacion: (d.instalacion ?? 'gimnasio') as 'gimnasio' | 'piscina',
  }))

  const summary = computeGymCduSummary(users, entries)
  return { ...summary, totalUsuarios }
}
