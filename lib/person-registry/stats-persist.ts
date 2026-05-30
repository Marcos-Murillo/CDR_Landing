import { adminDb } from '@/lib/firebase-admin'
import type { PersonRegistryStats } from './types'

const DOC_PATH = 'meta/person_registry_stats'

export type PersistedPersonRegistryStats = PersonRegistryStats & {
  persistedAt: string
}

export async function loadPersistedPersonRegistryStats(): Promise<PersistedPersonRegistryStats | null> {
  try {
    const snap = await adminDb.doc(DOC_PATH).get()
    if (!snap.exists) return null
    const data = snap.data() as PersistedPersonRegistryStats | undefined
    if (!data?.persistedAt) return null
    return data
  } catch {
    return null
  }
}

export async function savePersistedPersonRegistryStats(
  stats: PersonRegistryStats,
): Promise<void> {
  const payload: PersistedPersonRegistryStats = {
    ...stats,
    persistedAt: new Date().toISOString(),
  }
  await adminDb.doc(DOC_PATH).set(payload)
}
