import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

const APP_NAME = 'asistencias-deporte'

function getAsistenciasDeporteApp() {
  const existing = getApps().find(a => a.name === APP_NAME)
  if (existing) return existing

  if (
    !process.env.ASISTENCIAS_DEPORTE_ADMIN_PROJECT_ID ||
    !process.env.ASISTENCIAS_DEPORTE_ADMIN_CLIENT_EMAIL ||
    !process.env.ASISTENCIAS_DEPORTE_ADMIN_PRIVATE_KEY
  ) {
    throw new Error('Missing ASISTENCIAS_DEPORTE_ADMIN_* environment variables.')
  }

  return initializeApp(
    {
      credential: cert({
        projectId: process.env.ASISTENCIAS_DEPORTE_ADMIN_PROJECT_ID,
        clientEmail: process.env.ASISTENCIAS_DEPORTE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.ASISTENCIAS_DEPORTE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    },
    APP_NAME
  )
}

export function getAsistenciasDeporteDb(): Firestore {
  return getFirestore(getAsistenciasDeporteApp())
}
