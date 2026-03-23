import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json()
    if (!uid) return NextResponse.json({ error: 'UID requerido.' }, { status: 400 })

    // Delete from Firestore
    await adminDb.collection('users').doc(uid).delete()

    // Delete from Firebase Auth
    try {
      await adminAuth.deleteUser(uid)
    } catch {
      // User may not exist in Auth, ignore
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[delete-user]', err)
    return NextResponse.json({ error: 'Error al eliminar el usuario.' }, { status: 500 })
  }
}
