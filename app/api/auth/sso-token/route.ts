import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

const SSO_SECRET = process.env.SSO_SECRET!

// Role mappings per platform
const ROLE_MAP: Record<string, Record<string, string>> = {
  bitacoraac: {
    admin: 'admin',
    monitor: 'guest',
    superadmin: 'admin',
  },
  cducontrol: {
    admin: 'admin',
    monitor: 'monitor',
    superadmin: 'admin',
  },
  inventario_cultura: {
    admin: 'admin',
    monitor: 'monitor',
    superadmin: 'superadmin',
  },
  inventario_deporte: {
    admin: 'admin',
    monitor: 'monitor',
    superadmin: 'superadmin',
  },
  horarios: {
    admin: 'admin',
    monitor: 'monitor',
    superadmin: 'admin',
  },
}

// Redirect path after SSO login per platform
const SSO_REDIRECT: Record<string, string> = {
  bitacoraac: '/',
  cducontrol: '/',
  inventario_cultura: '/',
  inventario_deporte: '/',
  horarios: '/adofi',
}

// Maps cdr-landing area to gym_cdu espacio for monitors
const AREA_TO_ESPACIO: Record<string, string> = {
  deporte: 'gimnasio',
}

export async function POST(req: NextRequest) {
  try {
    const { uid, platform } = await req.json()

    if (!uid || !platform) {
      return NextResponse.json({ error: 'uid y platform son requeridos.' }, { status: 400 })
    }

    // Verify user exists in Firebase Auth
    const firebaseUser = await adminAuth.getUser(uid)

    // Get user profile from Firestore
    const snap = await adminDb.collection('users').doc(uid).get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })
    }

    const profile = snap.data()!

    // Check user has access to the requested platform
    if (!profile.platforms?.includes(platform) && profile.area !== 'all') {
      return NextResponse.json({ error: 'Sin acceso a esta plataforma.' }, { status: 403 })
    }

    const platformRoles = ROLE_MAP[platform] ?? ROLE_MAP['bitacoraac']
    const mappedRole = platformRoles[profile.role] ?? 'guest'

    // For gym_cdu monitors, map area to espacio
    const espacio = mappedRole === 'monitor'
      ? (AREA_TO_ESPACIO[profile.area] ?? 'gimnasio')
      : undefined

    // Generate signed JWT valid for 2 minutes
    const token = jwt.sign(
      {
        uid,
        nombre: profile.displayName ?? firebaseUser.displayName ?? 'Usuario',
        cedula: profile.cedula ?? uid,
        role: mappedRole,   // used by bitacoraac
        rol: mappedRole,    // used by gym_cdu
        espacio,
        platform,
      },
      SSO_SECRET,
      { expiresIn: '2m' }
    )

    return NextResponse.json({ token })
  } catch (err) {
    console.error('[sso-token]', err)
    return NextResponse.json({ error: 'Error al generar token.' }, { status: 500 })
  }
}
