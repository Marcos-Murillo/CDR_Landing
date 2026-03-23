/* eslint-disable @typescript-eslint/no-require-imports */
import type adminTypes from '../node_modules/firebase-admin/lib/default-namespace'

const admin = require('firebase-admin') as typeof adminTypes

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()
