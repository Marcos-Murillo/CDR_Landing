import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { assertSuperadminApi } from '@/lib/superadmin-api-auth'

export async function GET(req: NextRequest) {
  const denied = await assertSuperadminApi(req)
  if (denied) return denied

  const uid = req.nextUrl.searchParams.get('uid')
  if (!uid) {
    return NextResponse.json({ error: 'UID requerido.' }, { status: 400 })
  }

  try {
    const [snap, authUser] = await Promise.all([
      adminDb.collection('users').doc(uid).get(),
      adminAuth.getUser(uid).catch(() => null),
    ])

    if (!snap.exists) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })
    }

    const data = snap.data()!

    return NextResponse.json({
      id: snap.id,
      email: data.email ?? authUser?.email ?? '',
      displayName: data.displayName ?? authUser?.displayName ?? '',
      role: data.role ?? '',
      area: data.area ?? '',
      platforms: data.platforms ?? [],
      platformRoles: data.platformRoles ?? {},
      platformConfig: data.platformConfig ?? {},
      cedula: data.cedula ?? '',
      sede: data.sede ?? '',
      temporaryPassword: data.temporaryPassword ?? null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      createdBy: data.createdBy ?? null,
      auth: authUser
        ? {
            emailVerified: authUser.emailVerified,
            disabled: authUser.disabled,
            lastSignIn: authUser.metadata.lastSignInTime ?? null,
            createdAt: authUser.metadata.creationTime ?? null,
          }
        : null,
    })
  } catch (err) {
    console.error('[user-detail]', err)
    return NextResponse.json({ error: 'Error al cargar el usuario.' }, { status: 500 })
  }
}
