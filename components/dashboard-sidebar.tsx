'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { RCDUser } from '@/hoocks/use-auth'
import LogoIcon from '@/components/logo-icon'
import styles from './dashboard-sidebar.module.css'

interface DashboardSidebarProps {
  user: RCDUser
}

function getActiveSection(pathname: string): string {
  if (pathname.startsWith('/dashboard/stock-cdu')) return 'stock-cdu'
  if (pathname.startsWith('/dashboard/stock-cultura')) return 'stock-cultura'
  if (pathname.startsWith('/dashboard/gym-cdu')) return 'gym-cdu'
  if (pathname.startsWith('/dashboard/asistencias-deporte')) return 'asistencias'
  if (pathname.startsWith('/dashboard/plataformas')) return 'plataformas'
  return 'asistencias'
}

function DumbbellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M2 9h14M5 6v6M13 6v6M3 7v4M15 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function HexIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M2 14h14M5 14V9M9 14V5M13 14V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M15 12V6L9 2L3 6V12L9 16L15 12Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 5.5L9 9L14.5 5.5M9 16V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const activeSection = getActiveSection(pathname)

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const initials = (user.displayName ?? user.email ?? 'U')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const roleLabel = { admin: 'Administrador', monitor: 'Monitor', superadmin: 'Super Admin' }[user.role] ?? user.role

  // Dashboards que el usuario puede ver según sus plataformas/área
  const hasAsistencias =
    user.area === 'all' ||
    user.platforms.includes('asistencias_cultura') ||
    user.platforms.includes('asistencias_deporte') ||
    user.area === 'cultura' ||
    user.area === 'deporte'

  const asistenciasHref = user.area === 'deporte' ? '/dashboard/asistencias-deporte' : '/dashboard'
  const hasStockCultura = user.platforms.includes('stock_cultura')
  const hasStockCdu     = user.platforms.includes('stock_cdu')
  const hasGymCdu       = user.platforms.includes('gym_cdu')

  const dashboardItems = [
    hasAsistencias  && { href: asistenciasHref,              label: 'Asistencias',      icon: <ChartIcon />,    key: 'asistencias' },
    hasStockCultura && { href: '/dashboard/stock-cultura', label: 'Stock Cultura',    icon: <BoxIcon />,      key: 'stock-cultura' },
    hasStockCdu     && { href: '/dashboard/stock-cdu',     label: 'Stock CDU',        icon: <BoxIcon />,      key: 'stock-cdu' },
    hasGymCdu       && { href: '/dashboard/gym-cdu',       label: 'GymControl CDU',   icon: <DumbbellIcon />, key: 'gym-cdu' },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; key: string }[]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.logo}>
          <LogoIcon size={36} />
        </Link>

        <div className={styles.divider} />

        <nav className={styles.dockVertical} aria-label="Navegación">
          {dashboardItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              className={`${styles.dockItem} ${activeSection === item.key ? styles.dockItemActive : ''}`}
              title={item.label}
            >
              {item.icon}
              <span className={styles.dockTooltip}>{item.label}</span>
            </Link>
          ))}
          <Link
            href="/dashboard/plataformas"
            className={`${styles.dockItem} ${activeSection === 'plataformas' ? styles.dockItemActive : ''}`}
            title="Ver plataformas"
          >
            <GridIcon />
            <span className={styles.dockTooltip}>Ver plataformas</span>
          </Link>
        </nav>
      </div>

      <div className={styles.sidebarBottom}>
        <div className={styles.userChip} title={`${user.displayName ?? 'Usuario'} · ${roleLabel}`}>
          <div className={styles.avatar}>{initials}</div>
        </div>
        <button onClick={handleSignOut} className={styles.signOutBtn} aria-label="Cerrar sesión">
          <LogOutIcon />
        </button>
      </div>
    </aside>
  )
}
