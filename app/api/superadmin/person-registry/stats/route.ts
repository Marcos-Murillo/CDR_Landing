import { NextRequest, NextResponse } from 'next/server'
import { assertSuperadminApi } from '@/lib/superadmin-api-auth'
import { buildPersonRegistryStatsCached } from '@/lib/person-registry/fetch-index'
import { getStatsCacheAgeMs } from '@/lib/person-registry/stats-cache'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const denied = await assertSuperadminApi(req)
  if (denied) return denied

  const forceRefresh = req.nextUrl.searchParams.get('refresh') === '1'

  try {
    const stats = await buildPersonRegistryStatsCached({ forceRefresh })
    const cacheAgeMs = getStatsCacheAgeMs()
    return NextResponse.json({
      ...stats,
      fromCache: !forceRefresh && cacheAgeMs !== null && cacheAgeMs > 1000,
      cacheAgeMinutes: cacheAgeMs !== null ? Math.round(cacheAgeMs / 60000) : null,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[person-registry/stats]', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
