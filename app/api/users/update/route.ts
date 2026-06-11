import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function PATCH(req: NextRequest) {
  try {
    const { uid, displayName, role, area, platforms, platformRoles, platformConfig, cedula, sede } =
      await req.json()
    if (!uid) return NextResponse.json({ error: 'UID requerido.' }, { status: 400 })

    const update: Record<string, unknown> = {}
    if (displayName !== undefined) update.displayName = displayName
    if (role !== undefined) update.role = role
    if (area !== undefined) update.area = area
    if (platforms !== undefined) update.platforms = platforms
    if (platformRoles !== undefined) update.platformRoles = platformRoles
    if (platformConfig !== undefined) update.platformConfig = platformConfig
    if (cedula !== undefined) update.cedula = cedula?.trim() ? String(cedula).trim() : null
    if (sede !== undefined) update.sede = sede?.trim() ? String(sede).trim() : null

    await adminDb.collection('users').doc(uid).update(update)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[update-user]', err)
    return NextResponse.json({ error: 'Error al actualizar el usuario.' }, { status: 500 })
  }
}
