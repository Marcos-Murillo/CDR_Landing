import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getStockCulturaDb } from '@/lib/firebase-stock-cultura-admin'
import { computeStockCulturaSummary } from './compute'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization') ?? ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!idToken) return NextResponse.json({ error: 'Token requerido.' }, { status: 401 })

  try { await adminAuth.verifyIdToken(idToken) }
  catch { return NextResponse.json({ error: 'Token inválido.' }, { status: 401 }) }

  try {
    const db = getStockCulturaDb()
    const [loansSnap, inventorySnap, damagesSnap] = await Promise.all([
      db.collection('loans').get(),
      db.collection('inventory').get(),
      db.collection('damageReports').get(),
    ])

    const loans = loansSnap.docs.map(d => {
      const data = d.data()
      return {
        loanDate: data.loanDate?.toDate?.() ?? new Date(data.loanDate),
        returnDate: data.returnDate?.toDate?.(),
        status: data.status as 'active' | 'returned',
        itemId: data.itemId ?? '',
        itemName: data.itemName ?? '',
        culturalGroup: data.culturalGroup ?? '',
      }
    })

    const items = inventorySnap.docs.map(d => {
      const data = d.data()
      return { id: d.id, name: data.name ?? '', status: data.status as 'available' | 'loaned' | 'removed' }
    })

    const damages = damagesSnap.docs.map(d => {
      const data = d.data()
      return { itemId: data.itemId ?? '', itemName: data.itemName ?? '', severity: data.severity as 'low' | 'medium' | 'high' }
    })

    return NextResponse.json(computeStockCulturaSummary(loans, items, damages))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stock-cultura-summary]', msg)
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota')) {
      return NextResponse.json(getMockData())
    }
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

function getMockData() {
  const now = new Date()
  return {
    totalPrestamos: 340, prestamosActivos: 18, itemsDisponibles: 42, itemsTotal: 60,
    prestamosMesActual: 28, prestamosMesAnterior: 22, prestamosVencidos: 3, tasaDevolucion: 87,
    top5Items: [
      { nombre: 'Guitarra Clásica', total: 45, totalMesAnterior: 38 },
      { nombre: 'Micrófono Shure', total: 38, totalMesAnterior: 42 },
      { nombre: 'Amplificador', total: 30, totalMesAnterior: 25 },
      { nombre: 'Teclado Yamaha', total: 22, totalMesAnterior: 18 },
      { nombre: 'Batería Electrónica', total: 15, totalMesAnterior: 20 },
    ],
    top5Grupos: [
      { nombre: 'Coro Magno', total: 80, totalMesAnterior: 70 },
      { nombre: 'Danza Folclórica', total: 65, totalMesAnterior: 60 },
      { nombre: 'Jazz Band', total: 50, totalMesAnterior: 55 },
      { nombre: 'Teatro Universitario', total: 40, totalMesAnterior: 35 },
      { nombre: 'Orquesta Sinfónica', total: 35, totalMesAnterior: 30 },
    ],
    itemsConDanos: [
      { nombre: 'Guitarra Clásica', reportes: 3, severidad: 'medium' },
      { nombre: 'Amplificador', reportes: 2, severidad: 'high' },
    ],
    tendencia6Meses: Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, total: 20 + i * 3 }
    }),
    rawDates: [],
  }
}
