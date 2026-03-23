'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export type UserRole = 'superadmin' | 'admin' | 'monitor'
export type UserArea = 'cultura' | 'deporte' | 'all'

export interface RCDUser {
  uid: string
  email: string | null
  displayName: string | null
  role: UserRole
  area: UserArea
  platforms: string[]
}

interface AuthState {
  user: RCDUser | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setState({ user: null, loading: false })
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (snap.exists()) {
          const data = snap.data()
          setState({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName ?? data.displayName ?? null,
              role: data.role as UserRole,
              area: data.area as UserArea,
              platforms: data.platforms ?? [],
            },
            loading: false,
          })
        } else {
          // User exists in Auth but not in Firestore
          setState({ user: null, loading: false })
        }
      } catch {
        setState({ user: null, loading: false })
      }
    })

    return () => unsub()
  }, [])

  return state
}
