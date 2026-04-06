export interface ItemStat {
  nombre: string
  total: number
  totalMesAnterior: number
}

export interface DamageStat {
  nombre: string
  reportes: number
  severidad: 'low' | 'medium' | 'high'
}

export interface StockCulturaSummary {
  totalPrestamos: number
  prestamosActivos: number
  itemsDisponibles: number
  itemsTotal: number
  prestamosMesActual: number
  prestamosMesAnterior: number
  top5Items: ItemStat[]
  top5Grupos: ItemStat[]
  itemsConDanos: DamageStat[]
  prestamosVencidos: number
  tasaDevolucion: number // %
  tendencia6Meses: Array<{ mes: string; total: number }>
  rawDates: string[]
}

interface Loan {
  loanDate: Date
  returnDate?: Date
  status: 'active' | 'returned'
  itemId: string
  itemName: string
  culturalGroup: string
}

interface Item {
  id: string
  name: string
  status: 'available' | 'loaned' | 'removed'
}

interface DamageReport {
  itemId: string
  itemName: string
  severity: 'low' | 'medium' | 'high'
}

function sameYearMonth(d: Date, y: number, m: number) {
  return d.getFullYear() === y && d.getMonth() === m
}

export function computeStockCulturaSummary(
  loans: Loan[],
  items: Item[],
  damages: DamageReport[],
  now = new Date()
): StockCulturaSummary {
  const cy = now.getFullYear(), cm = now.getMonth()
  const prev = new Date(cy, cm - 1, 1)
  const py = prev.getFullYear(), pm = prev.getMonth()

  const totalPrestamos = loans.length
  const prestamosActivos = loans.filter(l => l.status === 'active').length
  const itemsDisponibles = items.filter(i => i.status === 'available').length
  const itemsTotal = items.filter(i => i.status !== 'removed').length
  const prestamosMesActual = loans.filter(l => sameYearMonth(l.loanDate, cy, cm)).length
  const prestamosMesAnterior = loans.filter(l => sameYearMonth(l.loanDate, py, pm)).length

  // Tasa de devolución
  const returned = loans.filter(l => l.status === 'returned').length
  const tasaDevolucion = totalPrestamos > 0 ? Math.round((returned / totalPrestamos) * 100) : 0

  // Préstamos vencidos (activos con más de 7 días)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)
  const prestamosVencidos = loans.filter(l => l.status === 'active' && l.loanDate < sevenDaysAgo).length

  // Top 5 items
  const itemTotals: Record<string, { total: number; prev: number }> = {}
  for (const l of loans) {
    if (!itemTotals[l.itemName]) itemTotals[l.itemName] = { total: 0, prev: 0 }
    itemTotals[l.itemName].total++
    if (sameYearMonth(l.loanDate, py, pm)) itemTotals[l.itemName].prev++
  }
  const top5Items: ItemStat[] = Object.entries(itemTotals)
    .map(([nombre, v]) => ({ nombre, total: v.total, totalMesAnterior: v.prev }))
    .sort((a, b) => b.total - a.total).slice(0, 5)

  // Top 5 grupos
  const groupTotals: Record<string, { total: number; prev: number }> = {}
  for (const l of loans) {
    const g = l.culturalGroup || 'Sin grupo'
    if (!groupTotals[g]) groupTotals[g] = { total: 0, prev: 0 }
    groupTotals[g].total++
    if (sameYearMonth(l.loanDate, py, pm)) groupTotals[g].prev++
  }
  const top5Grupos: ItemStat[] = Object.entries(groupTotals)
    .map(([nombre, v]) => ({ nombre, total: v.total, totalMesAnterior: v.prev }))
    .sort((a, b) => b.total - a.total).slice(0, 5)

  // Items con daños
  const damageCounts: Record<string, { reportes: number; severidad: 'low' | 'medium' | 'high' }> = {}
  for (const d of damages) {
    if (!damageCounts[d.itemName]) damageCounts[d.itemName] = { reportes: 0, severidad: d.severity }
    damageCounts[d.itemName].reportes++
    if (d.severity === 'high') damageCounts[d.itemName].severidad = 'high'
    else if (d.severity === 'medium' && damageCounts[d.itemName].severidad !== 'high') damageCounts[d.itemName].severidad = 'medium'
  }
  const itemsConDanos: DamageStat[] = Object.entries(damageCounts)
    .map(([nombre, v]) => ({ nombre, reportes: v.reportes, severidad: v.severidad }))
    .sort((a, b) => b.reportes - a.reportes).slice(0, 5)

  // Tendencia 6 meses
  const tendencia6Meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(cy, cm - (5 - i), 1)
    return {
      mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      total: loans.filter(l => sameYearMonth(l.loanDate, d.getFullYear(), d.getMonth())).length,
    }
  })

  const rawDates = loans.map(l => {
    const d = l.loanDate
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })

  return {
    totalPrestamos, prestamosActivos, itemsDisponibles, itemsTotal,
    prestamosMesActual, prestamosMesAnterior, top5Items, top5Grupos,
    itemsConDanos, prestamosVencidos, tasaDevolucion, tendencia6Meses, rawDates,
  }
}
