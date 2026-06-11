import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { SSO_ROLE_MAP } from '@/lib/platform-access-config'

const SSO_SECRET = process.env.SSO_SECRET!
const ROLE_MAP = SSO_ROLE_MAP

// Redirect path after SSO login per platform
const SSO_REDIRECT: Record<string, string> = {
  bitacoraac: '/',
  bitacora_comunicaciones: '/',
  cducontrol: '/',
  inventario_cultura: '/',
  inventario_deporte: '/',
  horarios: '/adofi',
}

const GYM_ESPACIOS = new Set(['gimnasio', 'guardarropas', 'piscina'])

const SUPERADMIN_ID = '1007260358'

export async function POST(req: NextRequest) {
  try {
    const { uid, platform } = await req.json()

    if (!uid || !platform) {
      return NextResponse.json({ error: 'uid y platform son requeridos.' }, { status: 400 })
    }

    // Hardcoded superadmin bypass — no Firebase Auth needed
    if (uid === SUPERADMIN_ID) {
      const platformRoles = ROLE_MAP[platform] ?? ROLE_MAP['bitacoraac']
      const mappedRole = platformRoles['superadmin'] ?? 'admin'
      const token = jwt.sign(
        {
          uid,
          nombre: 'Super Admin',
          cedula: uid,
          role: mappedRole,
          rol: mappedRole,
          area: 'all',
          platform,
        },
        SSO_SECRET,
        { expiresIn: '2m' }
      )
      return NextResponse.json({ token })
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
    const isSuperadmin = profile.role === 'superadmin'

    // Asistencias platforms are auto-granted based on area (no manual assignment needed)
    const isAsistenciasPlatform = platform === 'asistencias_cultura' || platform === 'asistencias_deporte'
    const areaMatchesAsistencias =
      (platform === 'asistencias_cultura' && (profile.area === 'cultura' || profile.area === 'all')) ||
      (platform === 'asistencias_deporte' && (profile.area === 'deporte' || profile.area === 'all'))

    // Horarios platforms are auto-granted based on area
    const isHorariosPlatform = platform === 'horarios' || platform === 'horarios_cdu'
    const areaMatchesHorarios =
      (platform === 'horarios' && (profile.area === 'cultura' || profile.area === 'all')) ||
      (platform === 'horarios_cdu' && (profile.area === 'deporte' || profile.area === 'all'))

    const isPrestamosPlatform = platform === 'prestamos_escenarios'
    const areaMatchesPrestamos =
      profile.area === 'deporte' || profile.area === 'all'

    const hasAccess =
      isSuperadmin ||
      profile.platforms?.includes(platform) ||
      profile.area === 'all' ||
      (isAsistenciasPlatform && areaMatchesAsistencias) ||
      (isHorariosPlatform && areaMatchesHorarios) ||
      (isPrestamosPlatform && areaMatchesPrestamos)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Sin acceso a esta plataforma.' }, { status: 403 })
    }

    const platformRoles = ROLE_MAP[platform] ?? ROLE_MAP['bitacoraac']
    // Use platform-specific role override if set, otherwise fall back to global role mapping
    const mappedRole = (profile.platformRoles?.[platform]) ?? platformRoles[profile.role] ?? 'guest'

    const gymEspacio = profile.platformConfig?.gym_cdu?.espacio as string | undefined
    const espacio =
      platform === 'gym_cdu' && mappedRole === 'monitor'
        ? (GYM_ESPACIOS.has(gymEspacio ?? '') ? gymEspacio : 'gimnasio')
        : undefined

    const tokenPayload: Record<string, unknown> = {
      uid,
      nombre: profile.displayName ?? firebaseUser.displayName ?? 'Usuario',
      cedula: profile.cedula ?? uid,
      role: mappedRole,   // used by bitacoraac
      rol: mappedRole,    // used by gym_cdu
      area: profile.area ?? 'cultura',
      espacio,
      platform,
    }
    if (profile.sede) tokenPayload.sede = profile.sede

    // Generate signed JWT valid for 2 minutes
    const token = jwt.sign(tokenPayload, SSO_SECRET, { expiresIn: '2m' })

    return NextResponse.json({ token })
  } catch (err) {
    console.error('[sso-token]', err)
    return NextResponse.json({ error: 'Error al generar token.' }, { status: 500 })
  }
}
