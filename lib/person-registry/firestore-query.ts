import type { Firestore, QueryDocumentSnapshot } from 'firebase-admin/firestore'

const IN_CHUNK = 30

export async function queryByField(
  db: Firestore,
  collection: string,
  field: string,
  value: string
): Promise<QueryDocumentSnapshot[]> {
  if (!value) return []
  const snap = await db.collection(collection).where(field, '==', value).limit(50).get()
  return snap.docs
}

export async function queryByFieldIn(
  db: Firestore,
  collection: string,
  field: string,
  values: string[]
): Promise<QueryDocumentSnapshot[]> {
  const unique = [...new Set(values.filter(Boolean))]
  if (unique.length === 0) return []

  const results: QueryDocumentSnapshot[] = []
  const seen = new Set<string>()

  for (let i = 0; i < unique.length; i += IN_CHUNK) {
    const chunk = unique.slice(i, i + IN_CHUNK)
    const snap =
      chunk.length === 1
        ? await db.collection(collection).where(field, '==', chunk[0]).get()
        : await db.collection(collection).where(field, 'in', chunk).get()
    snap.docs.forEach((doc) => {
      if (!seen.has(doc.id)) {
        seen.add(doc.id)
        results.push(doc)
      }
    })
  }

  return results
}

export async function queryByAnyEquality(
  db: Firestore,
  collection: string,
  queries: { field: string; value: string }[]
): Promise<QueryDocumentSnapshot[]> {
  const seen = new Set<string>()
  const results: QueryDocumentSnapshot[] = []

  for (const { field, value } of queries) {
    if (!value) continue
    const docs = await queryByField(db, collection, field, value)
    docs.forEach((doc) => {
      if (!seen.has(doc.id)) {
        seen.add(doc.id)
        results.push(doc)
      }
    })
  }

  return results
}
