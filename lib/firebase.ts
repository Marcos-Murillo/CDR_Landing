import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCOhLdZeubJ-BElAzOcnIlSv21vPBtonhA",
  authDomain: "landingcdr.firebaseapp.com",
  projectId: "landingcdr",
  storageBucket: "landingcdr.firebasestorage.app",
  messagingSenderId: "356569642227",
  appId: "1:356569642227:web:b96015be9dc429d357b386",
  measurementId: "G-SJTLGVJGED",
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
