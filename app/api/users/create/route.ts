import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName, role, area, platforms } = await req.json()

    if (!email || !password || !displayName || !role || !area || !platforms) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }

    // Create user in Firebase Auth using Admin SDK (does NOT change current session)
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    })

    // Save profile in Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      role,
      area,
      platforms,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'superadmin',
    })

    return NextResponse.json({ uid: userRecord.uid }, { status: 201 })
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? ''
    const message = (err as { message?: string })?.message ?? 'Error desconocido'

    if (code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Ya existe un usuario con ese correo.' }, { status: 409 })
    }
    if (code === 'auth/invalid-email') {
      return NextResponse.json({ error: 'El correo electrónico no es válido.' }, { status: 400 })
    }

    console.error('[create-user]', message)
    return NextResponse.json({ error: 'Error al crear el usuario.' }, { status: 500 })
  }
}
