import { jsPDF } from 'jspdf'
import type { PersonAreaDetail, PersonLookupResult } from './types'

const SYSTEM_LABELS: Record<string, string> = {
  asistencias_cultura: 'Asistencias Cultura',
  asistencias_deporte: 'Asistencias Deporte',
  gym_cdu: 'Gym CDU',
  stock_cdu: 'Stock CDU',
  stock_cultura: 'Stock Cultura',
  prestamos_escenarios: 'Préstamos escenarios',
}

function safeFileName(name: string): string {
  return name.replace(/[^\w\s-]/g, '').trim().slice(0, 60) || 'persona'
}

function writeLines(
  doc: jsPDF,
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number,
  maxWidth: number,
): number {
  let y = startY
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, maxWidth)
    for (const part of wrapped) {
      if (y > 275) {
        doc.addPage()
        y = 20
      }
      doc.text(part, x, y)
      y += lineHeight
    }
  }
  return y
}

function areaDetailLines(title: string, detail: PersonAreaDetail): string[] {
  const lines: string[] = [`\n${title}`, '—'.repeat(40)]

  if (detail.asistencias) {
    const a = detail.asistencias
    lines.push('Asistencias a grupos')
    lines.push(`  Total asistencias: ${a.totalAsistencias}`)
    if (a.ultimaAsistencia) lines.push(`  Última asistencia: ${a.ultimaAsistencia}`)
    if (a.nombres.length) lines.push(`  Nombres en sistema: ${a.nombres.join(', ')}`)
    if (a.grupos.length) lines.push(`  Grupos: ${a.grupos.join(', ')}`)
    for (const c of a.categorias) {
      lines.push(`  Categoría — ${c.grupo}: ${c.categoria}`)
    }
  }

  if (detail.gym) {
    const g = detail.gym
    lines.push('Gym CDU')
    lines.push(`  Visitas registradas: ${g.totalVisitas}`)
    if (g.ultimaVisita) lines.push(`  Última visita: ${g.ultimaVisita}`)
    for (const [inst, n] of Object.entries(g.porInstalacion)) {
      lines.push(`  ${inst}: ${n}`)
    }
  }

  if (detail.stock) {
    const s = detail.stock
    lines.push('Préstamo de implementos (Stock)')
    lines.push(`  Préstamos totales: ${s.totalPrestamos}`)
    lines.push(`  Activos: ${s.activos}`)
    for (const item of s.items) {
      lines.push(`  · ${item.nombre} — ${item.fecha} (${item.estado})`)
    }
  }

  if (detail.prestamosEscenarios) {
    const p = detail.prestamosEscenarios
    lines.push('Préstamo de escenarios')
    lines.push(`  Reservas totales: ${p.totalReservas}`)
    for (const [est, n] of Object.entries(p.porEstado)) {
      lines.push(`  ${est}: ${n}`)
    }
    for (const r of p.reservas) {
      lines.push(`  · ${r.cancha} — ${r.fecha} (${r.estado})`)
    }
  }

  return lines
}

export function buildPersonReportPdfFileName(result: PersonLookupResult): string {
  const displayName =
    result.nombres.length > 0 ? result.nombres.join(' · ') : 'persona'
  const fileBase = safeFileName(displayName)
  return `reporte-360-${fileBase}-${result.query.value}.pdf`
}

export function buildPersonReportPdfBuffer(result: PersonLookupResult): Buffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 18
  const maxWidth = 210 - margin * 2

  const displayName =
    result.nombres.length > 0 ? result.nombres.join(' · ') : 'Persona encontrada'
  const queryLabel =
    result.query.type === 'documento' ? 'Documento' : 'Código estudiantil'

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Reporte Vista 360° — CampusFlow', margin, 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, margin, 30)

  const lines: string[] = [
    '',
    displayName,
    `${queryLabel}: ${result.query.value}`,
    `Áreas: ${result.areas.map((a) => (a === 'ambas' ? 'Cultura + Deporte' : a === 'cultura' ? 'Cultura' : 'Deporte')).join(', ') || '—'}`,
    `Sistemas: ${result.sistemas.map((s) => SYSTEM_LABELS[s] ?? s).join(', ') || '—'}`,
  ]

  if (result.cultura) lines.push(...areaDetailLines('Área Cultura', result.cultura))
  if (result.deporte) lines.push(...areaDetailLines('Área Deporte', result.deporte))

  doc.setFontSize(10)
  writeLines(doc, lines, margin, 40, 5.5, maxWidth)

  const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer
  return Buffer.from(arrayBuffer)
}
