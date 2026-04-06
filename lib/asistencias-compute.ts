export interface GroupStat {
  nombre: string
  total: number
  totalMesAnterior: number
}

export interface DashboardSummary {
  totalAsistencias: number
  participantesUnicos: number
  gruposActivos: number
  asistenciasMesActual: number
  asistenciasMesAnterior: number
  participantesUnicosMesActual: number
  participantesUnicosMesAnterior: number
  porGenero: { mujer: number; hombre: number; otro: number }
  porEstamento: Record<string, number>
  top5Grupos: GroupStat[]
  gruposBajos: GroupStat[]
  tendencia6Meses: Array<{ mes: string; total: number }>
  rawDates: string[]
  area?: string
}

interface AttRecord {
  timestamp: Date
  genero: 'MUJER' | 'HOMBRE' | 'OTRO'
  estamento: string
  numeroDocumento: string
  grupoCultural: string
}

interface Group {
  id: string
  nombre: string
}

function sameYearMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month
}

export function computeDashboardSummary(
  records: AttRecord[],
  groups: Group[],
  now: Date = new Date()
): DashboardSummary {
  const cy = now.getFullYear()
  const cm = now.getMonth()
  const prev = new Date(cy, cm - 1, 1)
  const py = prev.getFullYear()
  const pm = prev.getMonth()

  const totalAsistencias = records.length
  const participantesUnicos = new Set(records.map(r => r.numeroDocumento)).size
  const gruposActivos = groups.length

  const asistenciasMesActual = records.filter(r => sameYearMonth(r.timestamp, cy, cm)).length
  const asistenciasMesAnterior = records.filter(r => sameYearMonth(r.timestamp, py, pm)).length

  const participantesUnicosMesActual = new Set(
    records.filter(r => sameYearMonth(r.timestamp, cy, cm)).map(r => r.numeroDocumento)
  ).size
  const participantesUnicosMesAnterior = new Set(
    records.filter(r => sameYearMonth(r.timestamp, py, pm)).map(r => r.numeroDocumento)
  ).size

  const porGenero = { mujer: 0, hombre: 0, otro: 0 }
  const porEstamento: Record<string, number> = {}
  const groupTotals: Record<string, number> = {}
  const monthGroupTotals: Record<string, number> = {}
  const prevMonthGroupTotals: Record<string, number> = {}

  for (const r of records) {
    const g = r.genero.toLowerCase()
    if (g === 'mujer') porGenero.mujer++
    else if (g === 'hombre') porGenero.hombre++
    else porGenero.otro++

    porEstamento[r.estamento] = (porEstamento[r.estamento] ?? 0) + 1
    groupTotals[r.grupoCultural] = (groupTotals[r.grupoCultural] ?? 0) + 1

    if (sameYearMonth(r.timestamp, cy, cm)) {
      monthGroupTotals[r.grupoCultural] = (monthGroupTotals[r.grupoCultural] ?? 0) + 1
    }
    if (sameYearMonth(r.timestamp, py, pm)) {
      prevMonthGroupTotals[r.grupoCultural] = (prevMonthGroupTotals[r.grupoCultural] ?? 0) + 1
    }
  }

  const top5Grupos: GroupStat[] = Object.entries(groupTotals)
    .map(([nombre, total]) => ({ nombre, total: total as number, totalMesAnterior: (prevMonthGroupTotals[nombre] ?? 0) as number }))
    .sort((a, b) => b.total - a.total).slice(0, 5)

  const gruposBajos: GroupStat[] = Object.entries(monthGroupTotals)
    .map(([nombre, total]) => ({ nombre, total: total as number, totalMesAnterior: (prevMonthGroupTotals[nombre] ?? 0) as number }))
    .sort((a, b) => a.total - b.total).slice(0, 5)

  const tendencia6Meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(cy, cm - (5 - i), 1)
    const y = d.getFullYear()
    const m = d.getMonth()
    return { mes: `${y}-${String(m + 1).padStart(2, '0')}`, total: records.filter(r => sameYearMonth(r.timestamp, y, m)).length }
  })

  const rawDates = records.map(r => {
    const d = r.timestamp
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })

  return { totalAsistencias, participantesUnicos, gruposActivos, asistenciasMesActual, asistenciasMesAnterior, participantesUnicosMesActual, participantesUnicosMesAnterior, porGenero, porEstamento, top5Grupos, gruposBajos, tendencia6Meses, rawDates }
}
