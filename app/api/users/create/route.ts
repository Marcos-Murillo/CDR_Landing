import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName, role, area, platforms, platformRoles, cedula, sede } =
      await req.json()

    if (!email || !password || !displayName || !role || !area || !platforms) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }

    const userRecord = await adminAuth.createUser({ email, password, displayName })

    const profile: Record<string, unknown> = {
      email,
      displayName,
      role,
      area,
      platforms,
      platformRoles: platformRoles ?? {},
      createdAt: FieldValue.serverTimestamp(),
      createdBy: 'superadmin',
    }
    if (cedula?.trim()) profile.cedula = String(cedula).trim()
    if (sede?.trim()) profile.sede = String(sede).trim()

    await adminDb.collection('users').doc(userRecord.uid).set(profile)

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
