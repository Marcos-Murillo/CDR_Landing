"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hoocks/use-auth'
import styles from './monitor.module.css'

const ALL_MODULES = [
  {
    id: 'bitacoraac',
    name: 'Bitácora AC',
    description: 'Control de asistencia',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_BITACORA ?? '#',
    sso: true,
  },
  {
    id: 'bitacora_comunicaciones',
    name: 'Bitácora COM',
    description: 'Comunicaciones',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES ?? '#',
    sso: true,
  },
  {
    id: 'inventario_cultura',
    name: 'Inventario Cultura',
    description: 'Gestión de recursos',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA ?? '#',
    sso: true,
  },
  {
    id: 'horarios',
    name: 'Horarios',
    description: 'Programación',
    area: 'cultura',
    url: process.env.NEXT_PUBLIC_URL_HORARIOS ?? '#',
    sso: true,
  },
  {
    id: 'cducontrol',
    name: 'CDUControl',
    description: 'Centro Deportivo',
    area: 'deporte',
    url: process.env.NEXT_PUBLIC_URL_CDU ?? '#',
    sso: true,
  },
]

const SSO_REDIRECT: Record<string, string> = {
  bitacoraac: '/',
  bitacora_comunicaciones: '/',
  cducontrol: '/admin',
  inventario_cultura: '/',
  inventario_deporte: '/',
  horarios: '/adofi',
}

export default function MonitorPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user?.role === 'admin') router.push('/dashboard')
    if (!loading && user?.role === 'superadmin') router.push('/superadmin')
  }, [user, loading, router])

  useEffect(() => {
    const update = () =>
      setCurrentTime(
        new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      )
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
      } catch {
        // fallback
      }
    }

    window.open(mod.url, '_blank')
  }

  if (loading || !user) {
    return (
      <div
        className={styles.page}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        Cargando...
      </div>
    )
  }

  const availableModules = ALL_MODULES.filter((m) => user.platforms.includes(m.id))

  const areaLabel =
    user.area === 'cultura' ? 'Cultura' : user.area === 'deporte' ? 'Deporte' : 'Multi-área'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>RCD</span>
        </Link>
        <div className={styles.headerCenter}>
          <span className={styles.greeting}>
            Hola, {(user.displayName ?? 'Monitor').split(' ')[0]}
          </span>
          <span className={styles.time}>{currentTime}</span>
        </div>
        <button onClick={handleSignOut} className={styles.signOutButton} aria-label="Cerrar sesión">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.modulesGrid}>
          {availableModules.map((mod) => (
            <a
              key={mod.id}
              href={mod.url}
              className={styles.moduleCard}
              onClick={(e) => handleModuleClick(e, mod)}
              rel="noopener noreferrer"
            >
              <div className={styles.moduleInfo}>
                <span className={styles.moduleName}>{mod.name}</span>
                <span className={styles.moduleDescription}>{mod.description}</span>
              </div>
            </a>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Monitor — {areaLabel}</span>
        <span>v1.0.0</span>
      </footer>
    </div>
  )
}
