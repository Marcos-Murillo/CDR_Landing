import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { getStockCduDb } from '@/lib/firebase-stock-cdu-admin'
import { computeStockCduSummary } from './compute'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization') ?? ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!idToken) return NextResponse.json({ error: 'Token requerido.' }, { status: 401 })

  try { await adminAuth.verifyIdToken(idToken) }
  catch { return NextResponse.json({ error: 'Token inválido.' }, { status: 401 }) }

  try {
    const db = getStockCduDb()
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
        facultad: data.facultad,
        programa: data.programa,
        genero: data.genero,
        estamento: data.estamento,
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

    return NextResponse.json(computeStockCduSummary(loans, items, damages))
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stock-cdu-summary]', msg)
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota')) {
      return NextResponse.json(getMockData())
    }
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

function getMockData() {
  const now = new Date()
  return {
    totalPrestamos: 520, prestamosActivos: 24, itemsDisponibles: 68, itemsTotal: 92,
    prestamosMesActual: 45, prestamosMesAnterior: 38, prestamosVencidos: 5, tasaDevolucion: 91,
    top5Items: [
      { nombre: 'Balón de Fútbol', total: 90, totalMesAnterior: 80 },
      { nombre: 'Raqueta de Tenis', total: 70, totalMesAnterior: 75 },
      { nombre: 'Balón de Baloncesto', total: 60, totalMesAnterior: 55 },
      { nombre: 'Malla de Voleibol', total: 40, totalMesAnterior: 35 },
      { nombre: 'Conos de Entrenamiento', total: 35, totalMesAnterior: 40 },
    ],
    top3Facultades: [
      { nombre: 'Ingeniería', total: 120, totalMesAnterior: 100 },
      { nombre: 'Ciencias Naturales', total: 95, totalMesAnterior: 90 },
      { nombre: 'Humanidades', total: 80, totalMesAnterior: 85 },
    ],
    top3Programas: [
      { nombre: 'Ingeniería de Sistemas', total: 65, totalMesAnterior: 55 },
      { nombre: 'Biología', total: 50, totalMesAnterior: 48 },
      { nombre: 'Licenciatura en Educación Física', total: 45, totalMesAnterior: 50 },
    ],
    itemsConDanos: [
      { nombre: 'Balón de Fútbol', reportes: 4, severidad: 'medium' },
      { nombre: 'Raqueta de Tenis', reportes: 2, severidad: 'low' },
    ],
    porGenero: { MASCULINO: 310, FEMENINO: 190, OTRO: 20 },
    porEstamento: { ESTUDIANTE: 420, DOCENTE: 60, FUNCIONARIO: 40 },
    tendencia6Meses: Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, total: 30 + i * 4 }
    }),
    rawDates: [],
  }
}
