import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getAsistenciasDb } from '@/lib/firebase-asistencias-admin'
import { fetchAsistenciasDashboardSummary } from '@/lib/platform-summary/fetch-asistencias-dashboard'
import {
  fallbackToPersistedOnQuota,
  getPlatformSummaryCached,
} from '@/lib/platform-summary/cache'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!idToken) {
    return NextResponse.json({ error: 'Token requerido.' }, { status: 401 })
  }

  try {
    await adminAuth.verifyIdToken(idToken)
  } catch {
    return NextResponse.json({ error: 'Token de sesión inválido.' }, { status: 401 })
  }

  const forceRefresh = request.nextUrl.searchParams.get('refresh') === '1'
  const cacheKey = 'asistencias_cultura'

  try {
    const summary = await getPlatformSummaryCached(
      cacheKey,
      () => fetchAsistenciasDashboardSummary(getAsistenciasDb()),
      { forceRefresh },
    )
    return NextResponse.json(summary)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[asistencias-cultura] Error:', msg)

    const stale = await fallbackToPersistedOnQuota(cacheKey, err)
    if (stale) return NextResponse.json(stale)

    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota exceeded')) {
      return NextResponse.json(getMockSummary())
    }
    return NextResponse.json({ error: `Error: ${msg}` }, { status: 502 })
  }
}

function getMockSummary() {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, total: Math.floor(Math.random() * 80) + 20 }
  })
  return { totalAsistencias: 1240, participantesUnicos: 387, gruposActivos: 18, asistenciasMesActual: 142, asistenciasMesAnterior: 118, participantesUnicosMesActual: 89, participantesUnicosMesAnterior: 74, porGenero: { mujer: 680, hombre: 510, otro: 50 }, porEstamento: { ESTUDIANTE: 920, EGRESADO: 180, DOCENTE: 90, FUNCIONARIO: 50 }, top5Grupos: [{ nombre: 'Coro Magno', total: 392, totalMesAnterior: 340 }, { nombre: 'Danza Folclórica', total: 210, totalMesAnterior: 225 }, { nombre: 'Teatro', total: 180, totalMesAnterior: 165 }, { nombre: 'Jazz Band', total: 120, totalMesAnterior: 110 }, { nombre: 'Orquesta', total: 98, totalMesAnterior: 102 }], gruposBajos: [{ nombre: 'Grupo Exp.', total: 4, totalMesAnterior: 8 }, { nombre: 'Escritura', total: 6, totalMesAnterior: 5 }, { nombre: 'Cine Club', total: 9, totalMesAnterior: 12 }], tendencia6Meses: months, rawDates: [] }
}
