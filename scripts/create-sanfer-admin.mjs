/**
 * Crea un admin de San Fernando en cdr-landing (+ staff en Gym CDU opcional).
 *
 * Uso:
 *   node scripts/create-sanfer-admin.mjs --email admin@correo.edu.co --password secret123 --name "Admin SF" --cedula 1234567890
 *
 * Requiere .env.local con FIREBASE_ADMIN_* y opcional GYM_CDU_ADMIN_*.
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvLocal() {
  const raw = readFileSync(resolve(root, '.env.local'), 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '')
    const val = args[i + 1]
    if (key && val) out[key] = val
  }
  return out
}

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

loadEnvLocal()

const { email, password, name, cedula } = parseArgs()
if (!email || !password || !name || !cedula) {
  console.error('Uso: node scripts/create-sanfer-admin.mjs --email X --password X --name X --cedula X')
  process.exit(1)
}

const {
  FIREBASE_ADMIN_PROJECT_ID,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  GYM_CDU_ADMIN_PROJECT_ID,
  GYM_CDU_ADMIN_CLIENT_EMAIL,
  GYM_CDU_ADMIN_PRIVATE_KEY,
} = process.env

if (!FIREBASE_ADMIN_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error('Faltan FIREBASE_ADMIN_* en .env.local')
  process.exit(1)
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}

const auth = getAuth()
const db = getFirestore()

const platforms = ['gym_cdu', 'stock_cdu_sanfer']
const profile = {
  email,
  displayName: name,
  role: 'admin',
  area: 'deporte',
  platforms,
  platformRoles: {},
  cedula: String(cedula).trim(),
  sede: 'san_fernando',
  createdAt: FieldValue.serverTimestamp(),
  createdBy: 'script:create-sanfer-admin',
}

let uid
try {
  const userRecord = await auth.createUser({ email, password, displayName: name })
  uid = userRecord.uid
  await db.collection('users').doc(uid).set(profile)
  console.log(`✓ Usuario cdr-landing creado: ${name} (${uid})`)
  console.log(`  Plataformas: ${platforms.join(', ')}`)
} catch (err) {
  const code = err?.code ?? ''
  if (code === 'auth/email-already-exists') {
    const existing = await auth.getUserByEmail(email)
    uid = existing.uid
    await db.collection('users').doc(uid).set(profile, { merge: true })
    console.log(`✓ Usuario existente actualizado: ${email} (${uid})`)
  } else {
    console.error('Error:', err.message ?? err)
    process.exit(1)
  }
}

if (GYM_CDU_ADMIN_PROJECT_ID && GYM_CDU_ADMIN_CLIENT_EMAIL && GYM_CDU_ADMIN_PRIVATE_KEY) {
  const gymAppName = 'gym-cdu-provision'
  let gymApp = getApps().find((a) => a.name === gymAppName)
  if (!gymApp) {
    gymApp = initializeApp(
      {
        credential: cert({
          projectId: GYM_CDU_ADMIN_PROJECT_ID,
          clientEmail: GYM_CDU_ADMIN_CLIENT_EMAIL,
          privateKey: GYM_CDU_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      },
      gymAppName,
    )
  }
  const gymDb = getFirestore(gymApp)
  const snap = await gymDb.collection('systemUsers').where('cedula', '==', profile.cedula).limit(1).get()

  const gymStaff = {
    nombre: name,
    cedula: profile.cedula,
    passwordHash: simpleHash(password),
    rol: 'admin',
    sede: 'san_fernando',
    creadoPor: 'script:create-sanfer-admin',
    fechaCreacion: new Date().toISOString(),
    activo: true,
  }

  if (snap.empty) {
    await gymDb.collection('systemUsers').add(gymStaff)
    console.log('✓ Staff Gym CDU creado (sede san_fernando)')
  } else {
    await snap.docs[0].ref.set(gymStaff, { merge: true })
    console.log('✓ Staff Gym CDU actualizado (sede san_fernando)')
  }
} else {
  console.log('ℹ GYM_CDU_ADMIN_* no configurado — crea el staff manualmente en Gym CDU con la misma cédula.')
}

console.log('\nListo. El usuario puede iniciar sesión en CDU Control y abrir Stock CDU San Fernando.')
