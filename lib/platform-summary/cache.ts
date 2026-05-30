import { adminDb } from '@/lib/firebase-admin'

const MEMORY_TTL_MS = 30 * 60 * 1000
const memory = new Map<string, { data: unknown; at: number }>()

export type CachedSummary<T> = T & {
  fromCache?: boolean
  cacheAgeMinutes?: number | null
  staleSnapshot?: boolean
}

export async function loadPersistedSummary<T>(key: string): Promise<(T & { persistedAt: string }) | null> {
  try {
    const snap = await adminDb.doc(`meta/platform_summary_${key}`).get()
    if (!snap.exists) return null
    const data = snap.data() as (T & { persistedAt?: string }) | undefined
    if (!data?.persistedAt) return null
    return data as T & { persistedAt: string }
  } catch {
    return null
  }
}

export async function savePersistedSummary<T>(key: string, payload: T): Promise<void> {
  await adminDb.doc(`meta/platform_summary_${key}`).set({
    ...payload,
    persistedAt: new Date().toISOString(),
  })
}

export async function getPlatformSummaryCached<T>(
  key: string,
  build: () => Promise<T>,
  options?: { forceRefresh?: boolean },
): Promise<CachedSummary<T>> {
  if (!options?.forceRefresh) {
    const mem = memory.get(key)
    if (mem && Date.now() - mem.at < MEMORY_TTL_MS) {
      return {
        ...(mem.data as T),
        fromCache: true,
        cacheAgeMinutes: Math.round((Date.now() - mem.at) / 60000),
      } as CachedSummary<T>
    }

    const persisted = await loadPersistedSummary<T>(key)
    if (persisted) {
      const { persistedAt, ...data } = persisted
      const ageMs = Date.now() - new Date(persistedAt).getTime()
      memory.set(key, { data, at: Date.now() - ageMs })
      return {
        ...data,
        fromCache: true,
        cacheAgeMinutes: Math.round(ageMs / 60000),
      } as CachedSummary<T>
    }
  }

  const fresh = await build()
  memory.set(key, { data: fresh, at: Date.now() })

  try {
    await savePersistedSummary(key, fresh)
  } catch (err) {
    console.warn(`[platform-summary/${key}] No se pudo persistir:`, err)
  }

  return fresh
}

export async function fallbackToPersistedOnQuota<T>(
  key: string,
  err: unknown,
  partial?: T,
): Promise<CachedSummary<T> | null> {
  const msg = err instanceof Error ? err.message : String(err)
  if (!msg.includes('RESOURCE_EXHAUSTED') && !msg.includes('Quota')) return null

  const persisted = await loadPersistedSummary<T>(key)
  if (persisted) {
    const { persistedAt, ...data } = persisted
    return {
      ...data,
      fromCache: true,
      staleSnapshot: true,
      cacheAgeMinutes: Math.round((Date.now() - new Date(persistedAt).getTime()) / 60000),
    } as CachedSummary<T>
  }

  return partial ? { ...partial, staleSnapshot: true } : null
}
