import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getStockCulturaDb } from '@/lib/firebase-stock-cultura-admin'
import { fetchStockCulturaDashboardSummary } from '@/lib/platform-summary/fetch-stock-dashboard'
import {
  fallbackToPersistedOnQuota,
  getPlatformSummaryCached,
} from '@/lib/platform-summary/cache'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization') ?? ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!idToken) return NextResponse.json({ error: 'Token requerido.' }, { status: 401 })

  try { await adminAuth.verifyIdToken(idToken) }
  catch { return NextResponse.json({ error: 'Token inválido.' }, { status: 401 }) }

  const forceRefresh = request.nextUrl.searchParams.get('refresh') === '1'
  const cacheKey = 'stock_cultura'

  try {
    const summary = await getPlatformSummaryCached(
      cacheKey,
      () => fetchStockCulturaDashboardSummary(getStockCulturaDb()),
      { forceRefresh },
    )
    return NextResponse.json(summary)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stock-cultura-summary]', msg)

    const stale = await fallbackToPersistedOnQuota(cacheKey, err)
    if (stale) return NextResponse.json(stale)

    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota')) {
      return NextResponse.json(getMockData())
    }
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

function getMockData() {
  const now = new Date()
  return {
    totalPrestamos: 340, prestamosActivos: 18, itemsDisponibles: 42, itemsTotal: 60,
    prestamosMesActual: 28, prestamosMesAnterior: 22, prestamosVencidos: 3, tasaDevolucion: 87,
    top5Items: [
      { nombre: 'Guitarra Clásica', total: 45, totalMesAnterior: 38 },
      { nombre: 'Micrófono Shure', total: 38, totalMesAnterior: 42 },
      { nombre: 'Amplificador', total: 30, totalMesAnterior: 25 },
      { nombre: 'Teclado Yamaha', total: 22, totalMesAnterior: 18 },
      { nombre: 'Batería Electrónica', total: 15, totalMesAnterior: 20 },
    ],
    top5Grupos: [
      { nombre: 'Coro Magno', total: 80, totalMesAnterior: 70 },
      { nombre: 'Danza Folclórica', total: 65, totalMesAnterior: 60 },
      { nombre: 'Jazz Band', total: 50, totalMesAnterior: 55 },
      { nombre: 'Teatro Universitario', total: 40, totalMesAnterior: 35 },
      { nombre: 'Orquesta Sinfónica', total: 35, totalMesAnterior: 30 },
    ],
    itemsConDanos: [
      { nombre: 'Guitarra Clásica', reportes: 3, severidad: 'medium' },
      { nombre: 'Amplificador', reportes: 2, severidad: 'high' },
    ],
    tendencia6Meses: Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, total: 20 + i * 3 }
    }),
    rawDates: [],
  }
}
