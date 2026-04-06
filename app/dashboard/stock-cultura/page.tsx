"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hoocks/use-auth'
import TrendChart from '@/components/trend-chart'
import KpiCard from '@/components/kpi-card'
import { GlowingButton } from '@/components/ui/glowing-button'
import styles from '../dashboard.module.css'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { StockCulturaSummary, ItemStat, DamageStat } from '@/app/api/platforms/stock-cultura-summary/compute'

const SEVERITY_COLOR = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }

function ExternalIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H2V12H12V8M8 2H12V6M12 2L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.3 3h3.2l-2.6 1.9 1 3L6 7.3 3.1 8.9l1-3L1.5 4H4.7L6 1z"/></svg>
}
function WarningIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10H1L6 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 5v2M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function ArrowUpIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowDownIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconBox() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 14V6L10 2L3 6V14L10 18L17 14Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 5.5L10 9.5L16.5 5.5M10 18V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconActive() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconAvail() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M7 10h6M10 7v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconCalendar() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 9h16M6 2v3M14 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}

function truncate(s: string, n = 24) { return s.length > n ? s.slice(0, n) + '…' : s }

function RankList({ items, title, icon }: { items: ItemStat[]; title: string; icon: 'star' | 'warning' }) {
  return (
    <div className={styles.rankCard}>
      <div className={styles.rankHeader}>
        <span className={icon === 'star' ? styles.rankStar : styles.rankStarLow}>
          {icon === 'star' ? <StarIcon /> : <WarningIcon />}
        </span>
        <span className={styles.rankHeaderTitle}>{title}</span>
      </div>
      <ol className={styles.rankList}>
        {items.map((g, i) => {
          const diff = g.total - g.totalMesAnterior
          return (
            <li key={g.nombre} className={styles.rankItem}>
              <span className={styles.rankPos}>{i + 1}</span>
              <span className={icon === 'star' ? styles.rankStar : styles.rankStarLow}>
                {icon === 'star' ? <StarIcon /> : <WarningIcon />}
              </span>
              <span className={styles.rankName}>{truncate(g.nombre)}</span>
              <span className={styles.rankCount}>{g.total}</span>
              {diff > 0 && <span className={styles.trendUp}><ArrowUpIcon /></span>}
              {diff < 0 && <span className={styles.trendDown}><ArrowDownIcon /></span>}
              {diff === 0 && <span className={styles.trendNeutral}>—</span>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function DamageList({ items }: { items: DamageStat[] }) {
  if (!items.length) return null
  return (
    <div className={styles.rankCard}>
      <div className={styles.rankHeader}>
        <span className={styles.rankStarLow}><WarningIcon /></span>
        <span className={styles.rankHeaderTitle}>Ítems con reportes de daño</span>
      </div>
      <ol className={styles.rankList}>
        {items.map((d, i) => (
          <li key={d.nombre} className={styles.rankItem}>
            <span className={styles.rankPos}>{i + 1}</span>
            <span className={styles.rankName}>{truncate(d.nombre)}</span>
            <span className={styles.rankCount}>{d.reportes}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: SEVERITY_COLOR[d.severidad], flexShrink: 0 }}>
              {d.severidad === 'high' ? 'Alta' : d.severidad === 'medium' ? 'Media' : 'Baja'}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function SkeletonDashboard() {
  return (
    <>
      <div className={styles.skeletonKpiRow}>{[0,1,2,3].map(i => <div key={i} className={`${styles.skeleton} ${styles.skeletonKpi}`} />)}</div>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLeft}>
          <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
          <div className={styles.skeletonPieRow}><div className={`${styles.skeleton} ${styles.skeletonPie}`} /></div>
        </div>
        <div className={styles.skeletonRight}>
          <div className={`${styles.skeleton} ${styles.skeletonRank}`} />
          <div className={`${styles.skeleton} ${styles.skeletonRank}`} />
          <div className={`${styles.skeleton} ${styles.skeletonRank}`} />
        </div>
      </div>
    </>
  )
}

export default function StockCulturaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<StockCulturaSummary | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    if (!auth.currentUser) return
    setFetching(true); setError('')
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await fetch('/api/platforms/stock-cultura-summary', { headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch { setError('No se pudieron cargar los datos.') }
    finally { setFetching(false) }
  }, [])

  useEffect(() => { if (user?.role === 'admin') fetchData() }, [user, fetchData])
  useEffect(() => { if (user && !user.platforms.includes('stock_cultura')) router.replace('/dashboard') }, [user, router])

  const handleOpen = async () => {
    if (!user) return
    const url = process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA || '#'
    try {
      const res = await fetch('/api/auth/sso-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: user.uid, platform: 'stock_cultura' }) })
      const d = await res.json()
      if (res.ok && d.token) { window.open(`${url}/auth/sso?token=${d.token}&redirect=/`, '_blank'); return }
    } catch { /* fallback */ }
    window.open(url, '_blank')
  }

  if (!user) return null

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.topbarEyebrow}><span className={styles.eyebrowLine} /><span>Dashboard</span></div>
          <h1 className={styles.topbarTitle}>Stock Cultura</h1>
        </div>
        <GlowingButton glowColor="#2563EB" className={styles.openBtn} onClick={handleOpen}><ExternalIcon /> Abrir Stock Cultura</GlowingButton>
      </header>

      <main className={styles.main}>
          {fetching && <SkeletonDashboard />}
          {!fetching && error && <div className={styles.errorBox}><p className={styles.errorText}>{error}</p><button className={styles.retryBtn} onClick={fetchData}>Reintentar</button></div>}

          {!fetching && data && (
            <>
              <div className={styles.kpiRow}>
                <KpiCard label="Total préstamos" value={data.totalPrestamos} current={data.prestamosMesActual} previous={data.prestamosMesAnterior} icon={<IconBox />} color="blue" sparkData={data.tendencia6Meses.map(d => d.total)} />
                <KpiCard label="Préstamos activos" value={data.prestamosActivos} current={data.prestamosActivos} previous={0} icon={<IconActive />} color="amber" />
                <KpiCard label="Ítems disponibles" value={`${data.itemsDisponibles} / ${data.itemsTotal}`} current={data.itemsDisponibles} previous={0} icon={<IconAvail />} color="green" />
                <KpiCard label="Préstamos este mes" value={data.prestamosMesActual} current={data.prestamosMesActual} previous={data.prestamosMesAnterior} icon={<IconCalendar />} color="violet" sparkData={data.tendencia6Meses.map(d => d.total)} />
              </div>

              <div className={styles.body}>
                <div className={styles.leftCol}>
                  <TrendChart rawDates={data.rawDates} />

                  {/* Stats adicionales */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className={styles.chartCard} style={{ textAlign: 'center' }}>
                      <p className={styles.chartTitle}>Tasa de devolución</p>
                      <p style={{ fontSize: 36, fontWeight: 700, color: data.tasaDevolucion >= 80 ? '#16a34a' : '#dc2626', margin: 0 }}>{data.tasaDevolucion}%</p>
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>préstamos devueltos</p>
                    </div>
                    <div className={styles.chartCard} style={{ textAlign: 'center' }}>
                      <p className={styles.chartTitle}>Préstamos vencidos</p>
                      <p style={{ fontSize: 36, fontWeight: 700, color: data.prestamosVencidos > 0 ? '#dc2626' : '#16a34a', margin: 0 }}>{data.prestamosVencidos}</p>
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>más de 7 días activos</p>
                    </div>
                  </div>
                </div>

                <div className={styles.rightCol}>
                  <RankList items={data.top5Items} title="Top 5 ítems más prestados" icon="star" />
                  <RankList items={data.top5Grupos} title="Top 5 grupos culturales" icon="star" />
                  <DamageList items={data.itemsConDanos} />
                </div>
              </div>
            </>
          )}
      </main>
    </>
  )
}
