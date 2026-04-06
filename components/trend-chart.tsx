'use client'

import { useState, useMemo, useId } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import styles from './trend-chart.module.css'

// ── Types ────────────────────────────────────────────────────────────────────

type FilterMode = 'range' | 'month'

interface Props {
  rawDates: string[] // YYYY-MM-DD
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const MONTH_NAMES_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function formatAxisDate(dateStr: string, mode: FilterMode, rangeMs: number): string {
  const d = new Date(dateStr)
  if (mode === 'month' || rangeMs <= 32 * 86400000) {
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
  }
  return `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`
}

function buildChartData(
  rawDates: string[],
  from: Date,
  to: Date,
  mode: FilterMode
): Array<{ label: string; total: number; key: string }> {
  const fromStr = toYMD(from)
  const toStr = toYMD(to)
  const filtered = rawDates.filter(d => d >= fromStr && d <= toStr)

  const rangeMs = to.getTime() - from.getTime()
  const useMonthly = mode === 'range' && rangeMs > 60 * 86400000

  if (useMonthly) {
    // Group by YYYY-MM
    const counts: Record<string, number> = {}
    for (const d of filtered) {
      const key = d.slice(0, 7)
      counts[key] = (counts[key] ?? 0) + 1
    }
    // Fill all months in range
    const result = []
    let cur = new Date(from.getFullYear(), from.getMonth(), 1)
    const end = new Date(to.getFullYear(), to.getMonth(), 1)
    while (cur <= end) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}`
      result.push({ key, label: `${MONTH_NAMES[cur.getMonth()]} ${String(cur.getFullYear()).slice(2)}`, total: counts[key] ?? 0 })
      cur = addMonths(cur, 1)
    }
    return result
  }

  // Daily
  const counts: Record<string, number> = {}
  for (const d of filtered) counts[d] = (counts[d] ?? 0) + 1

  const result = []
  const cur = new Date(from)
  while (toYMD(cur) <= toStr) {
    const key = toYMD(cur)
    result.push({ key, label: formatAxisDate(key, mode, rangeMs), total: counts[key] ?? 0 })
    cur.setDate(cur.getDate() + 1)
  }
  return result
}

function calcVariation(data: Array<{ total: number }>, rawDates: string[], from: Date, to: Date): number | null {
  const periodMs = to.getTime() - from.getTime()
  const prevTo = new Date(from.getTime() - 1)
  const prevFrom = new Date(prevTo.getTime() - periodMs)
  const prevFromStr = toYMD(prevFrom)
  const prevToStr = toYMD(prevTo)
  const prevTotal = rawDates.filter(d => d >= prevFromStr && d <= prevToStr).length
  const curTotal = data.reduce((s, d) => s + d.total, 0)
  if (prevTotal === 0) return null
  return Math.round(((curTotal - prevTotal) / prevTotal) * 100)
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ArrowUpIcon() {
  return <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowDownIcon() {
  return <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowFlatIcon() {
  return <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function CalendarIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 6h12M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function ChevronLeftIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ChevronRightIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ChevronDownIcon() {
  return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TrendChart({ rawDates }: Props) {
  const gradientId = useId().replace(/:/g, '')

  const now = new Date()
  const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [mode, setMode] = useState<FilterMode>('range')
  const [open, setOpen] = useState(false)

  // Range mode state
  const [rangeFrom, setRangeFrom] = useState(toYMD(defaultFrom))
  const [rangeTo, setRangeTo] = useState(toYMD(defaultTo))

  // Month mode state
  const [pickerYear, setPickerYear] = useState(now.getFullYear())
  const [pickerMonth, setPickerMonth] = useState(now.getMonth()) // 0-indexed
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>({ year: now.getFullYear(), month: now.getMonth() })

  // Applied filter
  const [applied, setApplied] = useState<{ mode: FilterMode; from: Date; to: Date }>({
    mode: 'range',
    from: defaultFrom,
    to: defaultTo,
  })

  const handleApply = () => {
    if (mode === 'range') {
      const f = new Date(rangeFrom + 'T00:00:00')
      const t = new Date(rangeTo + 'T00:00:00')
      if (f <= t) setApplied({ mode: 'range', from: f, to: t })
    } else {
      const f = new Date(selectedMonth.year, selectedMonth.month, 1)
      const t = new Date(selectedMonth.year, selectedMonth.month + 1, 0)
      setApplied({ mode: 'month', from: f, to: t })
    }
    setOpen(false)
  }

  const chartData = useMemo(
    () => buildChartData(rawDates, applied.from, applied.to, applied.mode),
    [rawDates, applied]
  )

  const variation = useMemo(
    () => calcVariation(chartData, rawDates, applied.from, applied.to),
    [chartData, rawDates, applied]
  )

  // Period label
  const periodLabel = applied.mode === 'month'
    ? `${MONTH_NAMES_FULL[applied.from.getMonth()]} ${applied.from.getFullYear()}`
    : `${applied.from.toLocaleDateString('es-CO', { day:'2-digit', month:'short' })} – ${applied.to.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })}`

  // Filter button label
  const filterLabel = applied.mode === 'month'
    ? `${MONTH_NAMES[applied.from.getMonth()]} ${applied.from.getFullYear()}`
    : `${applied.from.toLocaleDateString('es-CO', { day:'2-digit', month:'short' })} – ${applied.to.toLocaleDateString('es-CO', { day:'2-digit', month:'short' })}`

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <span className={styles.title}>Tendencia</span>
            <span className={styles.periodLabel}>{periodLabel}</span>
          </div>
          <div className={styles.badgeRow}>
            {variation === null ? (
              <span className={styles.badgeFlat}><ArrowFlatIcon /> Sin período anterior</span>
            ) : variation > 0 ? (
              <span className={styles.badgeUp}><ArrowUpIcon /> +{variation}%</span>
            ) : variation < 0 ? (
              <span className={styles.badgeDown}><ArrowDownIcon /> {variation}%</span>
            ) : (
              <span className={styles.badgeFlat}><ArrowFlatIcon /> 0%</span>
            )}
          </div>
        </div>

        {/* Filter dropdown */}
        <div className={styles.dropdownWrapper}>
          <button
            className={`${styles.filterBtn} ${open ? styles.filterBtnActive : ''}`}
            onClick={() => setOpen(v => !v)}
          >
            <CalendarIcon />
            {filterLabel}
            <ChevronDownIcon />
          </button>

          {open && (
            <>
              <div className={styles.overlay} onClick={() => setOpen(false)} />
              <div className={styles.dropdown}>
                {/* Tabs */}
                <div className={styles.tabs}>
                  <button
                    className={`${styles.tab} ${mode === 'range' ? styles.tabActive : ''}`}
                    onClick={() => setMode('range')}
                  >
                    Rango de fechas
                  </button>
                  <button
                    className={`${styles.tab} ${mode === 'month' ? styles.tabActive : ''}`}
                    onClick={() => setMode('month')}
                  >
                    Un mes
                  </button>
                </div>

                <div className={styles.panel}>
                  {mode === 'range' ? (
                    <>
                      <div>
                        <span className={styles.fieldLabel}>Desde</span>
                        <input
                          type="date"
                          className={styles.dateInput}
                          value={rangeFrom}
                          max={rangeTo}
                          onChange={e => setRangeFrom(e.target.value)}
                        />
                      </div>
                      <div>
                        <span className={styles.fieldLabel}>Hasta</span>
                        <input
                          type="date"
                          className={styles.dateInput}
                          value={rangeTo}
                          min={rangeFrom}
                          max={toYMD(now)}
                          onChange={e => setRangeTo(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div className={styles.monthPicker}>
                      {/* Year nav */}
                      <div className={styles.monthNav}>
                        <button className={styles.monthNavBtn} onClick={() => setPickerYear(y => y - 1)}><ChevronLeftIcon /></button>
                        <span className={styles.monthLabel}>{pickerYear}</span>
                        <button className={styles.monthNavBtn} onClick={() => setPickerYear(y => y + 1)} disabled={pickerYear >= now.getFullYear()}><ChevronRightIcon /></button>
                      </div>
                      {/* Month grid */}
                      <div className={styles.monthGrid}>
                        {MONTH_NAMES.map((name, i) => {
                          const isActive = selectedMonth.year === pickerYear && selectedMonth.month === i
                          const isFuture = pickerYear > now.getFullYear() || (pickerYear === now.getFullYear() && i > now.getMonth())
                          return (
                            <button
                              key={name}
                              className={`${styles.monthCell} ${isActive ? styles.monthCellActive : ''}`}
                              disabled={isFuture}
                              onClick={() => setSelectedMonth({ year: pickerYear, month: i })}
                            >
                              {name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <button className={styles.applyBtn} onClick={handleApply}>Aplicar</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, fontSize: 12, color: '#f8fafc' }}
            itemStyle={{ color: '#22c55e' }}
            formatter={(v) => [(v as number).toLocaleString('es-CO'), 'Asistencias']}
            labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill={`url(#grad-${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
