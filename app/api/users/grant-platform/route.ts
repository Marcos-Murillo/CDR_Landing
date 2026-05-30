import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { assertSuperadminApi } from '@/lib/superadmin-api-auth'

/**
 * Concede una plataforma a usuarios que ya tienen otra (p. ej. gym_cdu → stock_cdu_sanfer).
 * POST { platform: "stock_cdu_sanfer", grantIfHas: "gym_cdu" }
 */
export async function POST(req: NextRequest) {
  const denied = await assertSuperadminApi(req)
  if (denied) return denied

  try {
    const { platform, grantIfHas } = await req.json()
    if (!platform || !grantIfHas) {
      return NextResponse.json(
        { error: 'platform y grantIfHas son requeridos.' },
        { status: 400 },
      )
    }

    const snap = await adminDb.collection('users').get()
    let updated = 0

    const batch = adminDb.batch()
    for (const doc of snap.docs) {
      const data = doc.data()
      const platforms: string[] = data.platforms ?? []
      if (!platforms.includes(grantIfHas) || platforms.includes(platform)) continue
      batch.update(doc.ref, { platforms: [...platforms, platform] })
      updated++
    }

    if (updated > 0) await batch.commit()

    return NextResponse.json({ success: true, updated })
  } catch (err) {
    console.error('[grant-platform]', err)
    return NextResponse.json({ error: 'Error al conceder plataforma.' }, { status: 500 })
  }
}
