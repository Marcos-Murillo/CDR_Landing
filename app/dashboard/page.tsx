"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hoocks/use-auth'
import styles from './dashboard.module.css'

const ALL_MODULES = [
  {
    id: 'bitacoraac',
    name: 'Bitácora AC',
    description: 'Control de asistencia y seguimiento de actividades culturales.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_BITACORA || '#',
    icon: 'clipboard',
  },
  {
    id: 'bitacora_comunicaciones',
    name: 'Bitácora COM',
    description: 'Registro y seguimiento de actividades de comunicaciones.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES || '#',
    icon: 'clipboard',
  },
  {
    id: 'inventario_cultura',
    name: 'Inventario',
    description: 'Gestión de recursos, instrumentos y materiales de la sección.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA || '#',
    icon: 'box',
  },
  {
    id: 'horarios',
    name: 'Horarios',
    description: 'Programación de espacios, grupos y actividades culturales.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_HORARIOS || '#',
    icon: 'calendar',
  },
  {
    id: 'estadisticas',
    name: 'Estadísticas',
    description: 'Visualización de datos, métricas e informes institucionales.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_ESTADISTICAS || '#',
    icon: 'chart',
  },
  {
    id: 'cducontrol',
    name: 'CDUControl',
    description: 'Sistema integral para la gestión del Centro Deportivo.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_CDU || '#',
    icon: 'trophy',
  },
  {
    id: 'inventario_deporte',
    name: 'Inventario',
    description: 'Gestión de recursos y materiales deportivos.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_INVENTARIO_DEPORTE || '#',
    icon: 'box',
  },
  {
    id: 'multiarea',
    name: 'Multi-Área',
    description: 'Herramientas compartidas entre cultura y deporte.',
    area: 'all',
    url: process.env.NEXT_PUBLIC_URL_MULTIAREA || '#',
    icon: 'grid',
  },
  {
    id: 'asistencias_cultura',
    name: 'Asistencias Cultura',
    description: 'Gestión de asistencias, grupos y estadísticas culturales.',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_ASISTENCIAS || '#',
    icon: 'chart',
  },
  {
    id: 'asistencias_deporte',
    name: 'Asistencias Deporte',
    description: 'Gestión de asistencias, grupos y estadísticas deportivas.',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_ASISTENCIAS || '#',
    icon: 'trophy',
  },
]

function HexagonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ModuleIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    clipboard: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5C15 6.1 14.1 7 13 7H11C9.9 7 9 6.1 9 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    box: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 16V8L12 2L3 8V16L12 22L21 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01L20.73 6.96M12 22.08V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    calendar: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    chart: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    trophy: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9H4.5C3.12 9 2 7.88 2 6.5C2 5.12 3.12 4 4.5 4H6M18 9H19.5C20.88 9 22 7.88 22 6.5C22 5.12 20.88 4 19.5 4H18M4 22H20M18 2H6V9C6 12.31 8.69 15 12 15C15.31 15 18 12.31 18 9V2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    grid: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/></svg>,
  }
  return <>{icons[type] ?? null}</>
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user?.role === 'monitor') router.push('/monitor')
    if (!loading && user?.role === 'superadmin') router.push('/superadmin')
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const handleModuleClick = async (e: React.MouseEvent<HTMLAnchorElement>, module: typeof ALL_MODULES[0]) => {
    e.preventDefault()
    if (!user) return

    // Platforms with SSO support and their landing page after login
    const SSO_PLATFORMS: Record<string, string> = {
      bitacoraac: '/admin',
      bitacora_comunicaciones: '/admin',
      cducontrol: '/admin',
      inventario_cultura: '/',
      inventario_deporte: '/',
      horarios: '/adofi',
      asistencias_cultura: user.role === 'superadmin' ? '/super-admin' : '/usuarios',
      asistencias_deporte: user.role === 'superadmin' ? '/super-admin' : '/usuarios',
    }

    if (module.id in SSO_PLATFORMS && module.url !== '#') {
      try {
        const res = await fetch('/api/auth/sso-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, platform: module.id }),
        })
        const data = await res.json()
        if (res.ok && data.token) {
          const redirect = SSO_PLATFORMS[module.id]
          window.open(`${module.url}/auth/sso?token=${data.token}&redirect=${redirect}`, '_blank')
          return
        }
      } catch {
        // fallback to direct URL
      }
    }

    window.open(module.url, '_blank')
  }

  if (loading || !user) {
    return <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>
  }

  // Filter modules by user's assigned platforms
  // Asistencias cards are shown automatically based on area (no platform assignment needed)
  const ASISTENCIAS_IDS = ['asistencias_cultura', 'asistencias_deporte']
  const availableModules = ALL_MODULES.filter((m) => {
    if (ASISTENCIAS_IDS.includes(m.id)) {
      if (user.area === 'all') return true
      return m.id === `asistencias_${user.area}`
    }
    return user.platforms.includes(m.id)
  })

  const getAreaLabel = (a: string) => ({ cultura: 'Cultura', deporte: 'Deporte', all: 'Multi-área' }[a] ?? a)
  const getRoleLabel = (r: string) => ({ admin: 'Administrador', monitor: 'Monitor', superadmin: 'Super Admin' }[r] ?? r)
  const initials = (user.displayName ?? user.email ?? 'U').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <HexagonIcon />
            <div className={styles.logoText}>
              <span className={styles.logoName}>RCD Digital</span>
              <span className={styles.logoTag}>Universidad del Valle</span>
            </div>
          </Link>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{initials}</div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.displayName ?? 'Usuario'}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
            </div>
            <button onClick={handleSignOut} className={styles.signOutButton} aria-label="Cerrar sesión">
              <LogOutIcon />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainContent}>
          <section className={styles.welcome}>
            <div className={styles.welcomeText}>
              <h1 className={styles.welcomeTitle}>
                Hola, <span>{(user.displayName ?? 'Usuario').split(' ')[0]}</span>
              </h1>
            </div>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.roleBadge}`}>{getRoleLabel(user.role)}</span>
              <span className={`${styles.badge} ${styles.areaBadge}`}>{getAreaLabel(user.area)}</span>
            </div>
          </section>

          <section className={styles.modulesSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine}></span>
                <span>Módulos disponibles</span>
              </div>
              <p className={styles.sectionDescription}>Selecciona una aplicación para comenzar</p>
            </div>

            {availableModules.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '15px' }}>No tienes módulos asignados aún.</p>
            ) : (
              <div className={styles.modulesGrid}>
                {availableModules.map((module) => (
                  <a key={module.id} href={module.url} className={styles.moduleCard} onClick={(e) => handleModuleClick(e, module)} rel="noopener noreferrer">
                    <div className={styles.moduleCardLine}></div>
                    <div className={styles.moduleCardContent}>
                      <div className={styles.moduleHeader}>
                        <div className={styles.moduleIcon}><ModuleIcon type={module.icon} /></div>
                        <span className={`${styles.moduleArea} ${styles[module.area]}`}>{getAreaLabel(module.area)}</span>
                      </div>
                      <h3 className={styles.moduleName}>{module.name}</h3>
                      <p className={styles.moduleDescription}>{module.description}</p>
                      <div className={styles.moduleAction}><span>Abrir</span><ArrowRightIcon /></div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© 2024 Sección RCD — Universidad del Valle</span>
          <span className={styles.footerVersion}>v1.0.0</span>
        </div>
      </footer>
    </div>
  )
}
