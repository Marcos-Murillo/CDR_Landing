import type { Firestore } from 'firebase-admin/firestore'
import { computeStockCduSummary } from '@/app/api/platforms/stock-cdu-summary/compute'
import { computeStockCulturaSummary } from '@/app/api/platforms/stock-cultura-summary/compute'
import {
  countDocuments,
  getDashboardWindowStart,
  parseFirestoreDate,
  querySinceTimestamp,
  scanCollectionFields,
} from '@/lib/firestore-dashboard-queries'

const LOAN_FIELDS = [
  'loanDate',
  'status',
  'itemId',
  'itemName',
  'facultad',
  'programa',
  'genero',
  'estamento',
  'culturalGroup',
] as const

function mapLoan(data: FirebaseFirestore.DocumentData) {
  return {
    loanDate: parseFirestoreDate(data.loanDate) ?? new Date(),
    returnDate: undefined as Date | undefined,
    status: data.status as 'active' | 'returned',
    itemId: String(data.itemId ?? ''),
    itemName: String(data.itemName ?? ''),
    facultad: data.facultad as string | undefined,
    programa: data.programa as string | undefined,
    genero: data.genero as string | undefined,
    estamento: data.estamento as string | undefined,
    culturalGroup: data.culturalGroup as string | undefined,
  }
}

async function fetchLoansForDashboard(db: Firestore) {
  const since = getDashboardWindowStart(6)

  let recent: FirebaseFirestore.DocumentData[]
  try {
    recent = await querySinceTimestamp(db, 'loans', 'loanDate', since, [...LOAN_FIELDS])
  } catch {
    const all = await scanCollectionFields(db, 'loans', [...LOAN_FIELDS])
    recent = all.filter((d) => {
      const dt = parseFirestoreDate(d.loanDate)
      return dt && dt >= since
    })
  }

  const activeSnap = await db
    .collection('loans')
    .where('status', '==', 'active')
    .select('loanDate', 'status', 'itemId', 'itemName')
    .get()

  const activeLoans = activeSnap.docs.map((d) => mapLoan(d.data()))

  const merged = new Map<string, ReturnType<typeof mapLoan>>()
  for (const l of [...recent.map(mapLoan), ...activeLoans]) {
    merged.set(`${l.itemId}-${l.loanDate.getTime()}-${l.status}`, l)
  }

  const totalPrestamos = await countDocuments(db, 'loans')
  return { loans: [...merged.values()], totalPrestamos }
}

export async function fetchStockCduDashboardSummary(db: Firestore) {
  const [{ loans, totalPrestamos }, itemsRows, damagesRows] = await Promise.all([
    fetchLoansForDashboard(db),
    scanCollectionFields(db, 'inventory', ['name', 'status']),
    scanCollectionFields(db, 'damageReports', ['itemId', 'itemName', 'severity']),
  ])

  const items = itemsRows.map((d, i) => ({
    id: `item-${i}`,
    name: String(d.name ?? ''),
    status: d.status as 'available' | 'loaned' | 'removed',
  }))

  const damages = damagesRows.map((d) => ({
    itemId: String(d.itemId ?? ''),
    itemName: String(d.itemName ?? ''),
    severity: d.severity as 'low' | 'medium' | 'high',
  }))

  const summary = computeStockCduSummary(loans, items, damages)
  return { ...summary, totalPrestamos }
}

export async function fetchStockCulturaDashboardSummary(db: Firestore) {
  const [{ loans, totalPrestamos }, itemsRows, damagesRows] = await Promise.all([
    fetchLoansForDashboard(db),
    scanCollectionFields(db, 'inventory', ['name', 'status']),
    scanCollectionFields(db, 'damageReports', ['itemId', 'itemName', 'severity']),
  ])

  const items = itemsRows.map((d, i) => ({
    id: `item-${i}`,
    name: String(d.name ?? ''),
    status: d.status as 'available' | 'loaned' | 'removed',
  }))

  const damages = damagesRows.map((d) => ({
    itemId: String(d.itemId ?? ''),
    itemName: String(d.itemName ?? ''),
    severity: d.severity as 'low' | 'medium' | 'high',
  }))

  const summary = computeStockCulturaSummary(loans, items, damages)
  return { ...summary, totalPrestamos }
}
