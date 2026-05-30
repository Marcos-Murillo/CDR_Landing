import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

const APP_NAME = 'prestamos-escenarios'

export function getPrestamosDb(): Firestore | null {
  if (
    !process.env.PRESTAMOS_ADMIN_PROJECT_ID ||
    !process.env.PRESTAMOS_ADMIN_CLIENT_EMAIL ||
    !process.env.PRESTAMOS_ADMIN_PRIVATE_KEY
  ) {
    return null
  }

  const existing = getApps().find((a) => a.name === APP_NAME)
  const app =
    existing ??
    initializeApp(
      {
        credential: cert({
          projectId: process.env.PRESTAMOS_ADMIN_PROJECT_ID,
          clientEmail: process.env.PRESTAMOS_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.PRESTAMOS_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      },
      APP_NAME
    )

  return getFirestore(app)
}
