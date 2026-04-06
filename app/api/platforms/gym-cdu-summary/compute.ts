export interface FacultadStat {
  nombre: string
  total: number
  totalMesAnterior: number
}

export interface GymCduSummary {
  totalUsuarios: number
  totalEntradas: number
  entradasGimnasio: number
  entradasPiscina: number
  entradasMesActual: number
  entradasMesAnterior: number
  horaPico: string
  porGenero: Record<string, number>
  porEstamento: Record<string, number>
  top5Facultades: FacultadStat[]
  tendencia6Meses: Array<{ mes: string; total: number; gimnasio: number; piscina: number }>
  rawDates: string[]
}

interface User {
  genero: string
  estamento: string
  facultad: string
}

interface Entry {
  usuarioId: string
  fecha: string
  hora: string
  instalacion: 'gimnasio' | 'piscina'
}

function sameYearMonth(fecha: string, y: number, m: number) {
  const [fy, fm] = fecha.split('-').map(Number)
  return fy === y && fm === m + 1
}

export function computeGymCduSummary(
  users: User[],
  entries: Entry[],
  now = new Date()
): GymCduSummary {
  const cy = now.getFullYear(), cm = now.getMonth()
  const prev = new Date(cy, cm - 1, 1)
  const py = prev.getFullYear(), pm = prev.getMonth()

  const totalUsuarios = users.length
  const totalEntradas = entries.length
  const entradasGimnasio = entries.filter(e => (e.instalacion ?? 'gimnasio') === 'gimnasio').length
  const entradasPiscina = entries.filter(e => e.instalacion === 'piscina').length
  const entradasMesActual = entries.filter(e => sameYearMonth(e.fecha, cy, cm)).length
  const entradasMesAnterior = entries.filter(e => sameYearMonth(e.fecha, py, pm)).length

  // Hora pico
  const horaCounts: Record<string, number> = {}
  for (const e of entries) {
    const h = e.hora?.split(':')[0]?.padStart(2, '0') + ':00'
    horaCounts[h] = (horaCounts[h] ?? 0) + 1
  }
  const horaPico = Object.entries(horaCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'N/A'

  // Por género y estamento (de usuarios registrados)
  const porGenero: Record<string, number> = {}
  const porEstamento: Record<string, number> = {}
  const facTotals: Record<string, { total: number; prev: number }> = {}

  for (const u of users) {
    const g = u.genero || 'No especificado'
    porGenero[g] = (porGenero[g] ?? 0) + 1
    const e = u.estamento || 'No especificado'
    porEstamento[e] = (porEstamento[e] ?? 0) + 1
    const f = u.facultad || 'Sin facultad'
    if (!facTotals[f]) facTotals[f] = { total: 0, prev: 0 }
    facTotals[f].total++
  }

  // Entradas por facultad del mes anterior (via entries + user lookup no disponible aquí, usamos usuarios)
  const top5Facultades: FacultadStat[] = Object.entries(facTotals)
    .map(([nombre, v]) => ({ nombre, total: v.total, totalMesAnterior: v.prev }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // Tendencia 6 meses
  const tendencia6Meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(cy, cm - (5 - i), 1)
    const y2 = d.getFullYear(), m2 = d.getMonth()
    const mes = `${y2}-${String(m2 + 1).padStart(2, '0')}`
    const monthEntries = entries.filter(e => sameYearMonth(e.fecha, y2, m2))
    return {
      mes,
      total: monthEntries.length,
      gimnasio: monthEntries.filter(e => (e.instalacion ?? 'gimnasio') === 'gimnasio').length,
      piscina: monthEntries.filter(e => e.instalacion === 'piscina').length,
    }
  })

  const rawDates = entries.map(e => e.fecha)

  return {
    totalUsuarios, totalEntradas, entradasGimnasio, entradasPiscina,
    entradasMesActual, entradasMesAnterior, horaPico,
    porGenero, porEstamento, top5Facultades, tendencia6Meses, rawDates,
  }
}
