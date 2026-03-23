import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snap = await adminDb.collection('users').get()
    const users = snap.docs
      .filter((d) => d.data().role !== 'superadmin')
      .map((d) => {
        const data = d.data()
        return {
          id: d.id,
          email: data.email ?? '',
          displayName: data.displayName ?? '',
          role: data.role ?? '',
          area: data.area ?? '',
          platforms: data.platforms ?? [],
          createdAt: data.createdAt?.toDate?.()?.toISOString().split('T')[0] ?? '—',
        }
      })
    return NextResponse.json(users)
  } catch (err) {
    console.error('[list-users]', err)
    return NextResponse.json({ error: 'Error al cargar usuarios.' }, { status: 500 })
  }
}
