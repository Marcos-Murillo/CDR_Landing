import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getAsistenciasDeporteDb } from '@/lib/firebase-asistencias-deporte-admin'
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
  const cacheKey = 'asistencias_deporte'

  try {
    const summary = await getPlatformSummaryCached(
      cacheKey,
      () => fetchAsistenciasDashboardSummary(getAsistenciasDeporteDb()),
      { forceRefresh },
    )
    return NextResponse.json(summary)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[asistencias-deporte-summary] Error:', msg)

    const stale = await fallbackToPersistedOnQuota(cacheKey, err)
    if (stale) return NextResponse.json(stale)

    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota exceeded')) {
      return NextResponse.json(getMockSummary())
    }
    return NextResponse.json({ error: `Error al obtener datos: ${msg}` }, { status: 502 })
  }
}

function getMockSummary() {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      total: Math.floor(Math.random() * 80) + 20,
    }
  })
  return {
    totalAsistencias: 980, participantesUnicos: 310, gruposActivos: 12,
    asistenciasMesActual: 118, asistenciasMesAnterior: 95,
    participantesUnicosMesActual: 72, participantesUnicosMesAnterior: 61,
    porGenero: { mujer: 420, hombre: 530, otro: 30 },
    porEstamento: { ESTUDIANTE: 750, EGRESADO: 120, DOCENTE: 70, FUNCIONARIO: 40 },
    top5Grupos: [
      { nombre: 'Fútbol', total: 280, totalMesAnterior: 260 },
      { nombre: 'Baloncesto', total: 190, totalMesAnterior: 175 },
      { nombre: 'Natación', total: 150, totalMesAnterior: 140 },
      { nombre: 'Voleibol', total: 110, totalMesAnterior: 100 },
      { nombre: 'Atletismo', total: 90, totalMesAnterior: 85 },
    ],
    gruposBajos: [
      { nombre: 'Esgrima', total: 5, totalMesAnterior: 8 },
      { nombre: 'Tenis de Mesa', total: 7, totalMesAnterior: 6 },
      { nombre: 'Ajedrez', total: 9, totalMesAnterior: 11 },
    ],
    tendencia6Meses: months,
    rawDates: [],
  }
}
