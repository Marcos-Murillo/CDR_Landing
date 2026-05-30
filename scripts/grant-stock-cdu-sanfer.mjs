/**
 * Concede stock_cdu_sanfer a usuarios que ya tienen gym_cdu.
 * Uso: node scripts/grant-stock-cdu-sanfer.mjs
 * Requiere .env.local con FIREBASE_ADMIN_* (cdr-landing).
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvLocal() {
  try {
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
  } catch {
    console.error('No se encontró .env.local')
    process.exit(1)
  }
}

loadEnvLocal()

const PLATFORM = 'stock_cdu_sanfer'
const GRANT_IF_HAS = 'gym_cdu'

const { FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY } =
  process.env

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

const db = getFirestore()
const snap = await db.collection('users').get()
let updated = 0

for (const doc of snap.docs) {
  const data = doc.data()
  const platforms = data.platforms ?? []
  if (!platforms.includes(GRANT_IF_HAS) || platforms.includes(PLATFORM)) continue
  await doc.ref.update({ platforms: [...platforms, PLATFORM] })
  console.log(`+ ${data.displayName ?? doc.id} (${data.cedula ?? doc.id})`)
  updated++
}

console.log(`\nListo: ${updated} usuario(s) actualizado(s).`)
