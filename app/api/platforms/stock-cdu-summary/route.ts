import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getStockCduDb } from '@/lib/firebase-stock-cdu-admin'
import { fetchStockCduDashboardSummary } from '@/lib/platform-summary/fetch-stock-dashboard'
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
  const cacheKey = 'stock_cdu'

  try {
    const summary = await getPlatformSummaryCached(
      cacheKey,
      () => fetchStockCduDashboardSummary(getStockCduDb()),
      { forceRefresh },
    )
    return NextResponse.json(summary)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stock-cdu-summary]', msg)

    const stale = await fallbackToPersistedOnQuota(cacheKey, err)
    if (stale) return NextResponse.json(stale)

    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota')) {
      return NextResponse.json({ error: 'Cuota Firebase agotada. Los datos en caché no están disponibles.' }, { status: 503 })
    }
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
