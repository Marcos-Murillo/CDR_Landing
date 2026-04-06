'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hoocks/use-auth'
import TrendChart from '@/components/trend-chart'
import KpiCard from '@/components/kpi-card'
import { GlowingButton } from '@/components/ui/glowing-button'
import styles from '../dashboard.module.css'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import dynamic from 'next/dynamic'
import type { GymCduSummary, FacultadStat } from '@/app/api/platforms/gym-cdu-summary/compute'

const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false })
const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false })
const Legend = dynamic(() => import('recharts').then(m => ({ default: m.Legend })), { ssr: false })

const GENDER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#94a3b8']
const ESTAMENTO_COLORS = ['#2563EB', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function ExternalIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H2V12H12V8M8 2H12V6M12 2L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.3 3h3.2l-2.6 1.9 1 3L6 7.3 3.1 8.9l1-3L1.5 4H4.7L6 1z"/></svg>
}
function ArrowUpIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowDownIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconUsers() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconEntry() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M8 10h4M10 8v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconGym() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M5 7v6M15 7v6M2 9v2M18 9v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconClock() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function truncate(s: string, n = 24) { return s.length > n ? s.slice(0, n) + '...' : s }

function RankList({ items, title }: { items: FacultadStat[]; title: string }) {
  return (
    <div className={styles.rankCard}>
      <div className={styles.rankHeader}>
        <span className={styles.rankStar}><StarIcon /></span>
        <span className={styles.rankHeaderTitle}>{title}</span>
      </div>
      <ol className={styles.rankList}>
        {items.map((g, i) => {
          const diff = g.total - g.totalMesAnterior
          return (
            <li key={g.nombre} className={styles.rankItem}>
              <span className={styles.rankPos}>{i + 1}</span>
              <span className={styles.rankStar}><StarIcon /></span>
              <span className={styles.rankName}>{truncate(g.nombre)}</span>
              <span className={styles.rankCount}>{g.total}</span>
              {diff > 0 && <span className={styles.trendUp}><ArrowUpIcon /></span>}
              {diff < 0 && <span className={styles.trendDown}><ArrowDownIcon /></span>}
              {diff === 0 && <span className={styles.trendNeutral}>-</span>}
            </li>
          )
        })}
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
          <div className={styles.skeletonPieRow}><div className={`${styles.skeleton} ${styles.skeletonPie}`} /><div className={`${styles.skeleton} ${styles.skeletonPie}`} /></div>
        </div>
        <div className={styles.skeletonRight}><div className={`${styles.skeleton} ${styles.skeletonRank}`} /></div>
      </div>
    </>
  )
}

export default function GymCduPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<GymCduSummary | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    if (!auth.currentUser) return
    setFetching(true); setError('')
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await fetch('/api/platforms/gym-cdu-summary', { headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch { setError('No se pudieron cargar los datos.') }
    finally { setFetching(false) }
  }, [])

  useEffect(() => { if (user?.role === 'admin') fetchData() }, [user, fetchData])
  useEffect(() => { if (user && !user.platforms.includes('gym_cdu')) router.replace('/dashboard') }, [user, router])

  const handleOpen = async () => {
    if (!user) return
    const url = process.env.NEXT_PUBLIC_URL_GYM_CDU || '#'
    try {
      const res = await fetch('/api/auth/sso-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: user.uid, platform: 'gym_cdu' }) })
      const d = await res.json()
      if (res.ok && d.token) { window.open(`${url}/auth/sso?token=${d.token}&redirect=/`, '_blank'); return }
    } catch { /* fallback */ }
    window.open(url, '_blank')
  }

  if (!user) return null

  const genderData = data ? Object.entries(data.porGenero).map(([name, value]) => ({ name, value })) : []
  const estamentoData = data ? Object.entries(data.porEstamento).sort(([,a],[,b]) => b - a).map(([name, value]) => ({ name, value })) : []
  const barData = data ? data.tendencia6Meses.map(d => ({ mes: d.mes.slice(5), Gimnasio: d.gimnasio, Piscina: d.piscina })) : []

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.topbarEyebrow}><span className={styles.eyebrowLine} /><span>Dashboard</span></div>
          <h1 className={styles.topbarTitle}>GymControl CDU</h1>
        </div>
        <GlowingButton glowColor="#2563EB" className={styles.openBtn} onClick={handleOpen}>
          <ExternalIcon /> Abrir GymControl
        </GlowingButton>
      </header>
      <main className={styles.main}>
        {fetching && <SkeletonDashboard />}
        {!fetching && error && <div className={styles.errorBox}><p className={styles.errorText}>{error}</p><button className={styles.retryBtn} onClick={fetchData}>Reintentar</button></div>}
        {!fetching && data && (
          <>
            <div className={styles.kpiRow}>
              <KpiCard label="Usuarios registrados" value={data.totalUsuarios} current={data.totalUsuarios} previous={0} icon={<IconUsers />} color="blue" />
              <KpiCard label="Total entradas" value={data.totalEntradas} current={data.entradasMesActual} previous={data.entradasMesAnterior} icon={<IconEntry />} color="violet" sparkData={data.tendencia6Meses.map(d => d.total)} />
              <KpiCard label="Entradas gimnasio" value={data.entradasGimnasio} current={data.entradasGimnasio} previous={0} icon={<IconGym />} color="green" />
              <KpiCard label="Hora pico" value={data.horaPico} current={data.entradasMesActual} previous={data.entradasMesAnterior} icon={<IconClock />} color="amber" />
            </div>
            <div className={styles.body}>
              <div className={styles.leftCol}>
                <TrendChart rawDates={data.rawDates} />
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>Gimnasio vs Piscina - últimos 6 meses</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="Gimnasio" fill="#2563EB" radius={[3,3,0,0]} />
                      <Bar dataKey="Piscina" fill="#06b6d4" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className={styles.pieRow}>
                  <div className={styles.chartCard}>
                    <p className={styles.chartTitle}>Por género</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={68} label={({ name, percent }) => `${name} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                          {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => (v as number).toLocaleString('es-CO')} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={styles.chartCard}>
                    <p className={styles.chartTitle}>Por estamento</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={estamentoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={68} label={({ percent }) => `${(((percent as number) ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                          {estamentoData.map((_, i) => <Cell key={i} fill={ESTAMENTO_COLORS[i % ESTAMENTO_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => (v as number).toLocaleString('es-CO')} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={styles.chartCard} style={{ textAlign: 'center' }}>
                  <p className={styles.chartTitle}>Entradas piscina</p>
                  <p style={{ fontSize: 36, fontWeight: 700, color: '#06b6d4', margin: 0 }}>{data.entradasPiscina.toLocaleString('es-CO')}</p>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>total registradas</p>
                </div>
              </div>
              <div className={styles.rightCol}>
                <RankList items={data.top5Facultades} title="Top 5 facultades" />
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
