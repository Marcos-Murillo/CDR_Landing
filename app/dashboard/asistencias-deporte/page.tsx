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
import type { DashboardSummary, GroupStat } from '@/lib/asistencias-compute'

const GENDER_COLORS = ['#ec4899', '#3b82f6', '#8b5cf6']
const ESTAMENTO_COLORS = ['#2563EB', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

function IconAttendance() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconUnique() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.6"/><circle cx="13" cy="7" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M1 17c0-2.761 2.686-5 6-5M19 17c0-2.761-2.686-5-6-5M10 12c2.761 0 5 2.239 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function IconGroups() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="10" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="8" y="6" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="2" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.6"/></svg>
}
function IconCalendar() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 9h16M6 2v3M14 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
function ExternalIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H2V12H12V8M8 2H12V6M12 2L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowUpIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowDownIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function StarIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l1.3 3h3.2l-2.6 1.9 1 3L6 7.3 3.1 8.9l1-3L1.5 4H4.7L6 1z"/></svg>
}
function WarningIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10H1L6 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 5v2M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}

function truncate(str: string, max = 22): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}

function RankList({ items, title, icon, emptyMsg }: { items: GroupStat[]; title: string; icon: 'star' | 'warning'; emptyMsg: string }) {
  return (
    <div className={styles.rankCard}>
      <div className={styles.rankHeader}>
        <span className={icon === 'star' ? styles.rankStar : styles.rankStarLow}>{icon === 'star' ? <StarIcon /> : <WarningIcon />}</span>
        <span className={styles.rankHeaderTitle}>{title}</span>
      </div>
      {items.length === 0 ? <p className={styles.emptyMsg}>{emptyMsg}</p> : (
        <ol className={styles.rankList}>
          {items.map((g, i) => {
            const diff = g.total - g.totalMesAnterior
            return (
              <li key={g.nombre} className={styles.rankItem}>
                <span className={styles.rankPos}>{i + 1}</span>
                <span className={icon === 'star' ? styles.rankStar : styles.rankStarLow}>{icon === 'star' ? <StarIcon /> : <WarningIcon />}</span>
                <span className={styles.rankName}>{truncate(g.nombre)}</span>
                <span className={styles.rankCount}>{g.total.toLocaleString('es-CO')}</span>
                {diff > 0 && <span className={styles.trendUp}><ArrowUpIcon /></span>}
                {diff < 0 && <span className={styles.trendDown}><ArrowDownIcon /></span>}
                {diff === 0 && <span className={styles.trendNeutral}>—</span>}
              </li>
            )
          })}
        </ol>
      )}
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
        <div className={styles.skeletonRight}><div className={`${styles.skeleton} ${styles.skeletonRank}`} /><div className={`${styles.skeleton} ${styles.skeletonRank}`} /></div>
      </div>
    </>
  )
}

export default function AsistenciasDeportePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    if (!auth.currentUser) return
    setFetching(true); setError('')
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await fetch('/api/platforms/asistencias-deporte-summary', { headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch { setError('No se pudieron cargar los datos.') }
    finally { setFetching(false) }
  }, [])

  useEffect(() => { if (user?.role === 'admin') fetchData() }, [user, fetchData])
  useEffect(() => {
    if (user && !user.platforms.includes('asistencias_deporte') && user.area !== 'deporte' && user.area !== 'all') router.replace('/dashboard')
  }, [user, router])

  const handleOpen = async () => {
    if (!user) return
    const url = process.env.NEXT_PUBLIC_URL_ASISTENCIAS || 'https://asistencia-cultura.vercel.app'
    try {
      const res = await fetch('/api/auth/sso-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: user.uid, platform: 'asistencias_deporte' }) })
      const d = await res.json()
      if (res.ok && d.token) { window.open(`${url}/auth/sso?token=${d.token}&redirect=/usuarios`, '_blank'); return }
    } catch { /* fallback */ }
    window.open(url, '_blank')
  }

  if (!user) return null

  const genderData = data ? [
    { name: 'Mujer', value: data.porGenero.mujer },
    { name: 'Hombre', value: data.porGenero.hombre },
    { name: 'Otro', value: data.porGenero.otro },
  ] : []
  const estamentoData = data ? Object.entries(data.porEstamento).sort(([,a],[,b]) => b - a).map(([name, value]) => ({ name, value })) : []

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.topbarEyebrow}><span className={styles.eyebrowLine} /><span>Dashboard</span></div>
          <h1 className={styles.topbarTitle}>Asistencias Deporte</h1>
        </div>
        <GlowingButton glowColor="#2563EB" className={styles.openBtn} onClick={handleOpen}>
          <ExternalIcon /> Abrir Asistencias Deporte
        </GlowingButton>
      </header>
      <main className={styles.main}>
        {fetching && <SkeletonDashboard />}
        {!fetching && error && <div className={styles.errorBox}><p className={styles.errorText}>{error}</p><button className={styles.retryBtn} onClick={fetchData}>Reintentar</button></div>}
        {!fetching && data && (
          <>
            <div className={styles.kpiRow}>
              <KpiCard label="Total asistencias" value={data.totalAsistencias} current={data.asistenciasMesActual} previous={data.asistenciasMesAnterior} icon={<IconAttendance />} color="blue" sparkData={data.tendencia6Meses.map(d => d.total)} />
              <KpiCard label="Participantes únicos" value={data.participantesUnicos} current={data.participantesUnicosMesActual} previous={data.participantesUnicosMesAnterior} icon={<IconUnique />} color="violet" sparkData={data.tendencia6Meses.map(d => d.total)} />
              <KpiCard label="Grupos activos" value={data.gruposActivos} current={data.gruposActivos} previous={0} icon={<IconGroups />} color="green" />
              <KpiCard label="Asistencias este mes" value={data.asistenciasMesActual} current={data.asistenciasMesActual} previous={data.asistenciasMesAnterior} icon={<IconCalendar />} color="amber" sparkData={data.tendencia6Meses.map(d => d.total)} />
            </div>
            <div className={styles.body}>
              <div className={styles.leftCol}>
                <TrendChart rawDates={data.rawDates} />
                <div className={styles.pieRow}>
                  <div className={styles.chartCard}>
                    <p className={styles.chartTitle}>Por género</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} label={({ name, percent }) => `${name} ${(((percent as number) ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                          {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => (v as number).toLocaleString('es-CO')} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={styles.chartCard}>
                    <p className={styles.chartTitle}>Por estamento</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={estamentoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} label={({ percent }) => `${(((percent as number) ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                          {estamentoData.map((_, i) => <Cell key={i} fill={ESTAMENTO_COLORS[i % ESTAMENTO_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => (v as number).toLocaleString('es-CO')} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className={styles.rightCol}>
                <RankList items={data.top5Grupos} title="Top 5 — más asistencias" icon="star" emptyMsg="Sin datos" />
                <RankList items={data.gruposBajos} title="Menos asistencias este mes" icon="warning" emptyMsg="Sin actividad este mes" />
              </div>
            </div>
          </>
        )}
      </main>
    </>
  )
}
