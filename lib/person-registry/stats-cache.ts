import type { PersonRegistryStats } from './types'

const TTL_MS = 60 * 60 * 1000 // 1 hora en memoria del servidor

let cached: PersonRegistryStats | null = null
let cachedAt = 0

export function getCachedPersonStats(): PersonRegistryStats | null {
  if (!cached) return null
  if (Date.now() - cachedAt > TTL_MS) {
    cached = null
    cachedAt = 0
    return null
  }
  return cached
}

export function setCachedPersonStats(stats: PersonRegistryStats) {
  cached = stats
  cachedAt = Date.now()
}

export function clearPersonStatsCache() {
  cached = null
  cachedAt = 0
}

export function getStatsCacheAgeMs(): number | null {
  if (!cached) return null
  return Date.now() - cachedAt
}
