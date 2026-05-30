import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

const SUPERADMIN_ID = '1007260358'

export async function assertSuperadminApi(
  req: NextRequest
): Promise<NextResponse | null> {
  const superadminUid = req.headers.get('x-superadmin-uid')
  if (superadminUid === SUPERADMIN_ID) return null

  const authHeader = req.headers.get('authorization') ?? ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!idToken) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken)
    const snap = await adminDb.collection('users').doc(decoded.uid).get()
    if (snap.exists && snap.data()?.role === 'superadmin') return null
  } catch {
    /* fall through */
  }

  return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
}

export function getSuperadminFetchHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {}
  const isSession = sessionStorage.getItem('superadmin_auth') === 'true'
  if (isSession) return { 'X-Superadmin-Uid': SUPERADMIN_ID }
  return {}
}
