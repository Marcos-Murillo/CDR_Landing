import {
  FieldPath,
  Timestamp,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase-admin/firestore'

const PAGE_SIZE = 400
const BATCH_DELAY_MS = 200

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Inicio del mes hace N meses (incluye mes actual). */
export function getDashboardWindowStart(months = 6): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
}

export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function sixMonthDateString(): string {
  return formatDateKey(getDashboardWindowStart(6))
}

export async function countDocuments(db: Firestore, collection: string): Promise<number> {
  const snap = await db.collection(collection).count().get()
  return snap.data().count
}

/** Documentos por ID (máx. 30 por lote). */
export async function fetchDocumentsByIds(
  db: Firestore,
  collection: string,
  ids: string[],
): Promise<Map<string, FirebaseFirestore.DocumentData>> {
  const map = new Map<string, FirebaseFirestore.DocumentData>()
  const unique = [...new Set(ids.filter(Boolean))]
  for (let i = 0; i < unique.length; i += 30) {
    const chunk = unique.slice(i, i + 30)
    const refs = chunk.map((id) => db.collection(collection).doc(id))
    const snaps = await db.getAll(...refs)
    for (const snap of snaps) {
      if (snap.exists) map.set(snap.id, snap.data()!)
    }
    if (i + 30 < unique.length) await sleep(BATCH_DELAY_MS)
  }
  return map
}

/** Consulta por campo fecha >= since (Timestamp). */
export async function querySinceTimestamp(
  db: Firestore,
  collection: string,
  dateField: string,
  since: Date,
  fields: string[],
): Promise<FirebaseFirestore.DocumentData[]> {
  const sinceTs = Timestamp.fromDate(since)
  const rows: FirebaseFirestore.DocumentData[] = []
  let last: QueryDocumentSnapshot | undefined

  while (true) {
    let q = db
      .collection(collection)
      .where(dateField, '>=', sinceTs)
      .orderBy(dateField)
      .select(...fields)
      .limit(PAGE_SIZE)

    if (last) q = q.startAfter(last)

    const snap = await q.get()
    if (snap.empty) break

    for (const doc of snap.docs) rows.push(doc.data())
    last = snap.docs[snap.docs.length - 1]
    if (snap.size < PAGE_SIZE) break
    await sleep(BATCH_DELAY_MS)
  }

  return rows
}

/** Consulta por campo string fecha >= YYYY-MM-DD. */
export async function querySinceDateString(
  db: Firestore,
  collection: string,
  dateField: string,
  sinceStr: string,
  fields: string[],
): Promise<FirebaseFirestore.DocumentData[]> {
  const rows: FirebaseFirestore.DocumentData[] = []
  let last: QueryDocumentSnapshot | undefined

  while (true) {
    let q = db
      .collection(collection)
      .where(dateField, '>=', sinceStr)
      .orderBy(dateField)
      .select(...fields)
      .limit(PAGE_SIZE)

    if (last) q = q.startAfter(last)

    const snap = await q.get()
    if (snap.empty) break

    for (const doc of snap.docs) rows.push(doc.data())
    last = snap.docs[snap.docs.length - 1]
    if (snap.size < PAGE_SIZE) break
    await sleep(BATCH_DELAY_MS)
  }

  return rows
}

/** Colección pequeña: solo campos necesarios, paginado. */
export async function scanCollectionFields(
  db: Firestore,
  collectionName: string,
  fields: string[],
): Promise<FirebaseFirestore.DocumentData[]> {
  const rows: FirebaseFirestore.DocumentData[] = []
  let lastId: string | undefined

  while (true) {
    let q = db
      .collection(collectionName)
      .select(...fields)
      .orderBy(FieldPath.documentId())
      .limit(PAGE_SIZE)

    if (lastId) q = q.startAfter(lastId)

    const snap = await q.get()
    if (snap.empty) break

    for (const doc of snap.docs) rows.push(doc.data())
    lastId = snap.docs[snap.docs.length - 1]!.id
    if (snap.size < PAGE_SIZE) break
    await sleep(BATCH_DELAY_MS)
  }

  return rows
}

export function parseFirestoreDate(v: unknown): Date | null {
  if (!v) return null
  if (
    typeof v === 'object' &&
    v !== null &&
    'toDate' in v &&
    typeof (v as { toDate: () => Date }).toDate === 'function'
  ) {
    const d = (v as { toDate: () => Date }).toDate()
    return isNaN(d.getTime()) ? null : d
  }
  const d = new Date(v as string | number)
  return isNaN(d.getTime()) ? null : d
}
