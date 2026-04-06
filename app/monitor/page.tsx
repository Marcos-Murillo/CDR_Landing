"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hoocks/use-auth'
import LogoIcon from '@/components/logo-icon'
import styles from './monitor.module.css'

const ALL_MODULES = [
  {
    id: 'bitacoraac',
    name: 'Bitácora AC',
    description: 'Registro de actividades y control de asistencia de monitores del área cultural.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_BITACORA ?? '#',
    sso: true,
    icon: 'clipboard',
    color: 'blue',
  },
  {
    id: 'bitacora_comunicaciones',
    name: 'Bitácora COM',
    description: 'Seguimiento de actividades del área de comunicaciones.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES ?? '#',
    sso: true,
    icon: 'message',
    color: 'indigo',
  },
  {
    id: 'stock_cultura',
    name: 'Stock Cultura',
    description: 'Gestión de instrumentos, materiales y recursos del área cultural.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA ?? '#',
    sso: true,
    icon: 'box',
    color: 'blue',
  },
  {
    id: 'horarios',
    name: 'Horarios Cultura',
    description: 'Programación y consulta de horarios de grupos culturales.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_HORARIOS ?? '#',
    sso: true,
    icon: 'calendar',
    color: 'green',
  },
  {
    id: 'asistencias_cultura',
    name: 'Asistencias Cultura',
    description: 'Inscripciones, asistencia con QR y estadísticas del área cultural.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_ASISTENCIAS ?? '#',
    sso: true,
    icon: 'chart',
    color: 'violet',
  },
  {
    id: 'stock_cdu',
    name: 'Stock CDU',
    description: 'Inventario deportivo con registro de usuarios y préstamos de equipos.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_INVENTARIO_DEPORTE ?? '#',
    sso: true,
    icon: 'box',
    color: 'green',
  },
  {
    id: 'horarios_cdu',
    name: 'Horarios CDU',
    description: 'Consulta de horarios de grupos y disciplinas deportivas.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_HORARIOS_CDU ?? '#',
    sso: true,
    icon: 'calendar',
    color: 'green',
  },
  {
    id: 'gym_cdu',
    name: 'GymControl CDU',
    description: 'Registro y control de acceso al gimnasio del Centro Deportivo.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_GYM_CDU ?? '#',
    sso: true,
    icon: 'trophy',
    color: 'green',
  },
  {
    id: 'asistencias_deporte',
    name: 'Asistencias Deporte',
    description: 'Inscripciones, asistencia con QR y estadísticas del área deportiva.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_ASISTENCIAS ?? '#',
    sso: true,
    icon: 'chart',
    color: 'violet',
  },
]

const SSO_REDIRECT: Record<string, string> = {
  bitacoraac: '/',
  bitacora_comunicaciones: '/',
  stock_cultura: '/',
  stock_cdu: '/',
  horarios: '/adofi',
  horarios_cdu: '/',
  gym_cdu: '/admin',
  asistencias_cultura: '/estadisticas',
  asistencias_deporte: '/estadisticas',
}

function ModuleIcon({ type }: { type: string }) {
  switch (type) {
    case 'clipboard':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5C15 6.1 14.1 7 13 7H11C9.9 7 9 6.1 9 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      )
    case 'message':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'box':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 16V8L12 2L3 8V16L12 22L21 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01L20.73 6.96M12 22.08V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'calendar':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      )
    case 'trophy':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6 9H4.5C3.12 9 2 7.88 2 6.5C2 5.12 3.12 4 4.5 4H6M18 9H19.5C20.88 9 22 7.88 22 6.5C22 5.12 20.88 4 19.5 4H18M4 22H20M18 2H6V9C6 12.31 8.69 15 12 15C15.31 15 18 12.31 18 9V2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'chart':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function MonitorPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user?.role === 'admin') router.push('/dashboard')
    if (!loading && user?.role === 'superadmin') router.push('/superadmin')
  }, [user, loading, router])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }))
      setCurrentDate(now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const handleModuleClick = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    mod: (typeof ALL_MODULES)[0]
  ) => {
    e.preventDefault()
    if (!user || mod.url === '#') return
    if (mod.sso) {
      try {
        const res = await fetch('/api/auth/sso-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, platform: mod.id }),
        })
        const data = await res.json()
        if (res.ok && data.token) {
          const redirect = SSO_REDIRECT[mod.id] ?? '/'
          window.open(`${mod.url}/auth/sso?token=${data.token}&redirect=${redirect}`, '_blank')
          return
        }
      } catch { /* fallback */ }
    }
    window.open(mod.url, '_blank')
  }

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    )
  }

  const ASISTENCIAS_IDS = ['asistencias_cultura', 'asistencias_deporte']
  const availableModules = ALL_MODULES.filter((m) => {
    if (ASISTENCIAS_IDS.includes(m.id)) {
      if (user.area === 'all') return true
      if (user.platforms.includes(m.id)) return true
      return m.id === `asistencias_${user.area}`
    }
    return user.platforms.includes(m.id)
  })
  const areaLabel = user.area === 'cultura' ? 'Cultura' : user.area === 'deporte' ? 'Deporte' : 'Multi-área'
  const firstName = (user.displayName ?? 'Monitor').split(' ')[0]
  const initials = (user.displayName ?? 'M').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.sidebarLogo}>
            <LogoIcon size={40} />
            <div>
              <div className={styles.sidebarLogoName}>CampusFlow</div>
              <div className={styles.sidebarLogoTag}>Univalle</div>
            </div>
          </Link>

          <div className={styles.sidebarDivider} />

          <div className={styles.sidebarSection}>
            <span className={styles.sidebarSectionLabel}>Módulos</span>
            <nav className={styles.sidebarNav}>
              {availableModules.map((mod) => (
                <a
                  key={mod.id}
                  href={mod.url}
                  className={`${styles.sidebarNavItem} ${styles[`color_${mod.color}`]}`}
                  onClick={(e) => handleModuleClick(e, mod)}
                  rel="noopener noreferrer"
                >
                  <span className={styles.sidebarNavIcon}>
                    <ModuleIcon type={mod.icon} />
                  </span>
                  <span className={styles.sidebarNavName}>{mod.name}</span>
                  <span className={styles.sidebarNavArrow}><ArrowIcon /></span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarAvatar}>{initials}</div>
            <div className={styles.sidebarUserInfo}>
              <span className={styles.sidebarUserName}>{user.displayName ?? 'Monitor'}</span>
              <span className={styles.sidebarUserRole}>Monitor · {areaLabel}</span>
            </div>
          </div>
          <button onClick={handleSignOut} className={styles.sidebarSignOut} aria-label="Cerrar sesión">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.content}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarDate}>{currentDate}</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.topbarClock}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7 4V7L9 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span>{currentTime}</span>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className={styles.main}>
          {/* Welcome */}
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeText}>
              <p className={styles.welcomeGreeting}>{greeting},</p>
              <h1 className={styles.welcomeName}>{firstName}</h1>
            </div>
            <div className={styles.welcomeBadge}>
              <span className={styles.welcomeBadgeArea}>{areaLabel}</span>
            </div>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.4 7.2L18 8.1L14 12L15 17.6L10 15L5 17.6L6 12L2 8.1L7.6 7.2L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className={styles.statValue}>{availableModules.length}</div>
                <div className={styles.statLabel}>Módulos activos</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconGreen}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6.5 10L9 12.5L13.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className={styles.statValue}>Activo</div>
                <div className={styles.statLabel}>Estado de sesión</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconIndigo}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.13 2 3 5.13 3 9C3 12.87 6.13 16 10 16C13.87 16 17 12.87 17 9C17 5.13 13.87 2 10 2Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 6V10L12.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className={styles.statValue}>{areaLabel}</div>
                <div className={styles.statLabel}>Área asignada</div>
              </div>
            </div>
          </div>

          {/* Modules grid */}
          <div className={styles.modulesSection}>
            <div className={styles.modulesSectionHeader}>
              <div className={styles.modulesSectionEyebrow}>
                <span className={styles.eyebrowLine} />
                <span>Acceso rápido</span>
              </div>
              <p className={styles.modulesSectionSub}>Selecciona un módulo para continuar</p>
            </div>

            {availableModules.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="#cbd5e1" strokeWidth="2"/>
                  <path d="M14 20H26M20 14V26" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>No tienes módulos asignados aún.</p>
                <span>Contacta al administrador para obtener acceso.</span>
              </div>
            ) : (
              <div className={styles.modulesGrid}>
                {availableModules.map((mod) => (
                  <a
                    key={mod.id}
                    href={mod.url}
                    className={`${styles.moduleCard} ${styles[`card_${mod.color}`]}`}
                    onClick={(e) => handleModuleClick(e, mod)}
                    rel="noopener noreferrer"
                  >
                    <div className={styles.moduleCardTop}>
                      <div className={styles.moduleCardIcon}>
                        <ModuleIcon type={mod.icon} />
                      </div>
                      <span className={styles.moduleCardAreaBadge}>{mod.area === 'cultura' ? 'Cultura' : 'Deporte'}</span>
                    </div>
                    <div className={styles.moduleCardBody}>
                      <h3 className={styles.moduleCardName}>{mod.name}</h3>
                      <p className={styles.moduleCardDesc}>{mod.description}</p>
                    </div>
                    <div className={styles.moduleCardFooter}>
                      <span>Abrir módulo</span>
                      <ArrowIcon />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
