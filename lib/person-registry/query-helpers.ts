import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { normalizeDocument, normalizeCode } from './normalize'

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export function documentCandidates(raw: string): string[] {
  const norm = normalizeDocument(raw)
  const trimmed = raw.trim()
  const candidates = new Set<string>()
  if (norm) candidates.add(norm)
  if (trimmed) candidates.add(trimmed)
  return [...candidates]
}

export function codeCandidates(raw: string): string[] {
  const norm = normalizeCode(raw)
  const trimmed = raw.trim()
  const candidates = new Set<string>()
  if (norm) candidates.add(norm)
  if (trimmed) candidates.add(trimmed.toUpperCase())
  return [...candidates]
}

/** Consultas indexadas por campo (pocas lecturas) en lugar de .get() sobre toda la colección */
export async function queryCollectionByField(
  db: Firestore,
  collection: string,
  field: string,
  values: string[]
): Promise<QueryDocumentSnapshot[]> {
  const unique = [...new Set(values.filter(Boolean))]
  if (unique.length === 0) return []

  const snaps: QueryDocumentSnapshot[] = []
  for (const value of unique) {
    const q = await db.collection(collection).where(field, '==', value).limit(20).get()
    q.docs.forEach((d) => snaps.push(d))
  }
  return snaps
}

export async function queryByFieldIn(
  db: Firestore,
  collection: string,
  field: string,
  values: string[]
): Promise<QueryDocumentSnapshot[]> {
  const unique = [...new Set(values.filter(Boolean))]
  if (unique.length === 0) return []

  const snaps: QueryDocumentSnapshot[] = []
  for (const batch of chunk(unique, 30)) {
    const q = await db.collection(collection).where(field, 'in', batch).get()
    q.docs.forEach((d) => snaps.push(d))
  }
  return snaps
}
