'use client'

import { SparklineChart } from './sparkline'
import styles from './kpi-card.module.css'

type ColorVariant = 'blue' | 'green' | 'violet' | 'amber'

interface KpiCardProps {
  label: string
  value: string | number
  current: number
  previous: number
  icon: React.ReactNode
  color?: ColorVariant
  sparkData?: number[]
}

function ArrowUpIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowDownIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ArrowFlatIcon() {
  return <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}

export default function KpiCard({ label, value, current, previous, icon, color = 'blue', sparkData }: KpiCardProps) {
  const pct = previous > 0 ? Math.round(((current - previous) / previous) * 100) : null
  const up = pct !== null && pct > 0
  const down = pct !== null && pct < 0

  const iconClass = {
    blue: styles.iconBlue,
    green: styles.iconGreen,
    violet: styles.iconViolet,
    amber: styles.iconAmber,
  }[color]

  const sparkColor = up ? '#16a34a' : down ? '#dc2626' : '#94a3b8'

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={`${styles.iconWrap} ${iconClass}`}>{icon}</div>
        {sparkData && sparkData.length > 1 && (
          <div className={styles.sparkline}>
            <SparklineChart data={sparkData} color={sparkColor} up={up} />
          </div>
        )}
      </div>

      <span className={styles.value}>
        {typeof value === 'number' ? value.toLocaleString('es-CO') : value}
      </span>

      <div className={styles.bottomRow}>
        <span className={styles.label}>{label}</span>
        {pct !== null ? (
          <span className={`${styles.badge} ${up ? styles.badgeUp : down ? styles.badgeDown : styles.badgeFlat}`}>
            {up ? <ArrowUpIcon /> : down ? <ArrowDownIcon /> : <ArrowFlatIcon />}
            {up ? '+' : ''}{pct}%
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeFlat}`}>—</span>
        )}
      </div>
    </div>
  )
}
