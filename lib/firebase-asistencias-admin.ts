import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

const APP_NAME = 'asistencias'

function getAsistenciasApp() {
  const existing = getApps().find(a => a.name === APP_NAME)
  if (existing) return existing

  if (
    !process.env.ASISTENCIAS_ADMIN_PROJECT_ID ||
    !process.env.ASISTENCIAS_ADMIN_CLIENT_EMAIL ||
    !process.env.ASISTENCIAS_ADMIN_PRIVATE_KEY
  ) {
    throw new Error('Missing ASISTENCIAS_ADMIN_* environment variables. Add them to .env.local')
  }

  return initializeApp(
    {
      credential: cert({
        projectId: process.env.ASISTENCIAS_ADMIN_PROJECT_ID,
        clientEmail: process.env.ASISTENCIAS_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.ASISTENCIAS_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    },
    APP_NAME
  )
}

export function getAsistenciasDb(): Firestore {
  return getFirestore(getAsistenciasApp())
}
