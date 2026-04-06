import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

const APP_NAME = 'stock-cdu'

export function getStockCduDb(): Firestore {
  const existing = getApps().find(a => a.name === APP_NAME)
  if (existing) return getFirestore(existing)

  if (!process.env.STOCK_CDU_ADMIN_PROJECT_ID ||
      !process.env.STOCK_CDU_ADMIN_CLIENT_EMAIL ||
      !process.env.STOCK_CDU_ADMIN_PRIVATE_KEY) {
    throw new Error('Missing STOCK_CDU_ADMIN_* environment variables')
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.STOCK_CDU_ADMIN_PROJECT_ID,
      clientEmail: process.env.STOCK_CDU_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.STOCK_CDU_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  }, APP_NAME)

  return getFirestore(app)
}
