"use client"

import { useAuth } from '@/hoocks/use-auth'
import { GlowingButton } from '@/components/ui/glowing-button'
import styles from './plataformas.module.css'

const ALL_MODULES = [
  { id: 'bitacoraac', name: 'Bitácora AC', description: 'Registro de actividades, seguimiento de tareas y control de asistencia de monitores del área cultural.', area: 'cultura', url: process.env.NEXT_PUBLIC_URL_BITACORA || '#', icon: 'clipboard' },
  { id: 'bitacora_comunicaciones', name: 'Bitácora COM', description: 'Registro y seguimiento de actividades del área de comunicaciones de la sección.', area: 'cultura', url: process.env.NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES || '#', icon: 'clipboard' },
  { id: 'stock_cultura', name: 'Stock Cultura', description: 'Gestión de inventario de instrumentos, materiales y recursos del área cultural.', area: 'cultura', url: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA || '#', icon: 'box' },
  { id: 'horarios', name: 'Horarios Cultura', description: 'Consulta de horarios de grupos culturales: danza, musica, teatro y mas.', area: 'cultura', url: process.env.NEXT_PUBLIC_URL_HORARIOS || '#', icon: 'calendar' },
  { id: 'stock_cdu', name: 'Stock CDU', description: 'Inventario deportivo con registro de usuarios, préstamos de equipos y reportes del Centro Deportivo.', area: 'deporte', url: process.env.NEXT_PUBLIC_URL_INVENTARIO_DEPORTE || '#', icon: 'box' },
  { id: 'horarios_cdu', name: 'Horarios CDU', description: 'Consulta de horarios de grupos y disciplinas deportivas del Centro Deportivo Universitario.', area: 'deporte', url: process.env.NEXT_PUBLIC_URL_HORARIOS_CDU || '#', icon: 'calendar' },
  { id: 'gym_cdu', name: 'GymControl CDU', description: 'Registro y control de acceso a las instalaciones del gimnasio del Centro Deportivo.', area: 'deporte', url: process.env.NEXT_PUBLIC_URL_GYM_CDU || '#', icon: 'trophy' },
  { id: 'asistencias_cultura', name: 'Asistencias Cultura', description: 'Inscripciones, asistencia con QR, estadísticas y reportes del área cultural.', area: 'cultura', url: process.env.NEXT_PUBLIC_URL_ASISTENCIAS || 'https://asistencia-cultura.vercel.app', icon: 'chart' },
  { id: 'asistencias_deporte', name: 'Asistencias Deporte', description: 'Inscripciones, asistencia con QR, estadísticas y reportes del área deportiva.', area: 'deporte', url: process.env.NEXT_PUBLIC_URL_ASISTENCIAS || 'https://asistencia-cultura.vercel.app', icon: 'chart' },
]

const SSO_PLATFORMS: Record<string, string> = {
  bitacoraac: '/admin', bitacora_comunicaciones: '/admin',
  stock_cdu: '/', stock_cultura: '/', horarios: '/adofi', horarios_cdu: '/', gym_cdu: '/admin',
  asistencias_cultura: '/usuarios', asistencias_deporte: '/usuarios',
}

function ArrowRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ModuleIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    clipboard: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5C15 6.1 14.1 7 13 7H11C9.9 7 9 6.1 9 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12H15M9 16H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    box: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 16V8L12 2L3 8V16L12 22L21 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01L20.73 6.96M12 22.08V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    calendar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
    chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    trophy: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 9H4.5C3.12 9 2 7.88 2 6.5C2 5.12 3.12 4 4.5 4H6M18 9H19.5C20.88 9 22 7.88 22 6.5C22 5.12 20.88 4 19.5 4H18M4 22H20M18 2H6V9C6 12.31 8.69 15 12 15C15.31 15 18 12.31 18 9V2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  }
  return <>{icons[type] ?? null}</>
}

export default function PlataformasPage() {
  const { user } = useAuth()

  const handleCardClick = async (e: React.MouseEvent, module: typeof ALL_MODULES[0]) => {
    e.preventDefault()
    if (!user) return
    if (module.id in SSO_PLATFORMS && module.url !== '#') {
      try {
        const res = await fetch('/api/auth/sso-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, platform: module.id }),
        })
        const data = await res.json()
        if (res.ok && data.token) {
          window.open(`${module.url}/auth/sso?token=${data.token}&redirect=${SSO_PLATFORMS[module.id]}`, '_blank')
          return
        }
      } catch { /* fallback */ }
    }
    window.open(module.url, '_blank')
  }

  if (!user) return null

  const ASISTENCIAS_IDS = ['asistencias_cultura', 'asistencias_deporte']
  const availableModules = ALL_MODULES.filter(m => {
    if (ASISTENCIAS_IDS.includes(m.id)) {
      if (user.area === 'all') return true
      if (user.platforms.includes(m.id)) return true
      return m.id === `asistencias_${user.area}`
    }
    return user.platforms.includes(m.id)
  })

  const getAreaLabel = (a: string) => ({ cultura: 'Cultura', deporte: 'Deporte', all: 'Multi-área' }[a] ?? a)

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.topbarEyebrow}>
            <span className={styles.eyebrowLine} />
            <span>Dashboard</span>
          </div>
          <h1 className={styles.topbarTitle}>Plataformas</h1>
        </div>
      </header>

      <main className={styles.main}>
          <p className={styles.sectionDesc}>Selecciona una plataforma para abrirla con inicio de sesión automático.</p>

          {availableModules.length === 0 ? (
            <div className={styles.empty}>No tienes plataformas asignadas aún.</div>
          ) : (
            <div className={styles.grid}>
              {availableModules.map(module => (
                <a key={module.id} href={module.url} className={styles.card} onClick={e => handleCardClick(e, module)} rel="noopener noreferrer">
                  <div className={styles.cardLine} />
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}><ModuleIcon type={module.icon} /></div>
                      <span className={`${styles.cardArea} ${module.area === 'deporte' ? styles.cardAreaDeporte : ''}`}>
                        {getAreaLabel(module.area)}
                      </span>
                    </div>
                    <h3 className={styles.cardName}>{module.name}</h3>
                    <p className={styles.cardDesc}>{module.description}</p>
                    <div className={styles.cardAction}>
                      <GlowingButton glowColor="#2563EB" className={styles.cardOpenBtn}>
                        <span>Abrir</span><ArrowRightIcon />
                      </GlowingButton>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
      </main>
    </>
  )
}
