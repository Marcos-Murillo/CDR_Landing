"use client"

import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

const PLATFORMS = [
  {
    id: 'bitacora',
    name: 'Bitácora',
    description: 'Control de asistencia y seguimiento de actividades culturales en tiempo real.',
    area: 'cultura',
    tags: ['Asistencia', 'Seguimiento', 'Reportes'],
  },
  {
    id: 'inventario',
    name: 'Inventario',
    description: 'Gestión completa de recursos, instrumentos y materiales de la sección.',
    area: 'cultura',
    tags: ['Recursos', 'Control', 'Préstamos'],
  },
  {
    id: 'horarios',
    name: 'Horarios',
    description: 'Programación y coordinación de espacios, grupos y actividades culturales.',
    area: 'cultura',
    tags: ['Programación', 'Espacios', 'Grupos'],
  },
  {
    id: 'estadisticas',
    name: 'Estadísticas',
    description: 'Visualización de datos, métricas de impacto y reportes institucionales.',
    area: 'cultura',
    tags: ['Métricas', 'Reportes', 'Datos'],
  },
  {
    id: 'cducontrol',
    name: 'CDUControl',
    description: 'Sistema integral para la gestión del Centro Deportivo Universitario.',
    area: 'deporte',
    tags: ['Deportes', 'Reservas', 'Torneos'],
  },
  {
    id: 'multiarea',
    name: 'Multi-Área',
    description: 'Herramientas compartidas entre las áreas de cultura y deporte.',
    area: 'all',
    tags: ['Integración', 'Colaboración', 'Transversal'],
  },
]

const TECH_STACK = [
  {
    name: 'Next.js 15',
    description: 'Framework React con App Router para aplicaciones web modernas y performantes.',
    icon: 'nextjs',
  },
  {
    name: 'Firebase',
    description: 'Backend-as-a-Service con autenticación, base de datos y hosting en la nube.',
    icon: 'firebase',
  },
  {
    name: 'Vercel',
    description: 'Plataforma de despliegue con CI/CD automático y edge network global.',
    icon: 'vercel',
  },
  {
    name: 'Real-time',
    description: 'Sincronización en tiempo real para colaboración y actualizaciones instantáneas.',
    icon: 'realtime',
  },
]

const IMPACT_ITEMS = [
  {
    title: 'Eficiencia Operativa',
    description: 'Reducción significativa en tiempos de gestión administrativa y operativa.',
    icon: 'efficiency',
  },
  {
    title: 'Datos en Tiempo Real',
    description: 'Información actualizada al instante para toma de decisiones informadas.',
    icon: 'realtime',
  },
  {
    title: 'Acceso Unificado',
    description: 'Un solo punto de entrada para todas las herramientas de la sección.',
    icon: 'unified',
  },
  {
    title: 'Escalabilidad',
    description: 'Arquitectura preparada para crecer con las necesidades de la universidad.',
    icon: 'scale',
  },
]

function HexagonIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 10H16M16 10L11 5M16 10L11 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 10L8.5 13.5L15 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TechIcon({ type }: { type: string }) {
  switch (type) {
    case 'nextjs':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'firebase':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 20L6 4L12 12L4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L20 20L4 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 14L12 8L14 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'vercel':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L22 21H2L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'realtime':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M12 5V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M12 21V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M5 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M21 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M7.05 7.05L5.64 5.64" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M18.36 18.36L16.95 16.95" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M7.05 16.95L5.64 18.36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M18.36 5.64L16.95 7.05" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      )
    default:
      return null
  }
}

function ImpactIcon({ type }: { type: string }) {
  switch (type) {
    case 'efficiency':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3V14L20 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      )
    case 'realtime':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 14C4 14 7 8 14 8C21 8 24 14 24 14C24 14 21 20 14 20C7 20 4 14 4 14Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      )
    case 'unified':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          <rect x="16" y="4" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          <rect x="4" y="16" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          <rect x="16" y="16" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        </svg>
      )
    case 'scale':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 20L10 14L14 18L24 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 8H24V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'cultura' | 'deporte'>('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredPlatforms = PLATFORMS.filter(
    (p) => activeFilter === 'all' || p.area === activeFilter || p.area === 'all'
  )

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <HexagonIcon />
            <div className={styles.logoText}>
              <span className={styles.logoName}>CDR</span>
              <span className={styles.logoTag}>Universidad del Valle</span>
            </div>
          </Link>

          <div className={styles.navLinks}>
            <a href="#plataformas">Plataformas</a>
            <a href="#ecosistema">Ecosistema</a>
            <a href="#tecnologia">Tecnología</a>
            <a href="#impacto">Impacto</a>
          </div>

          <Link href="/login" className={styles.navCta}>
            Ingresar
          </Link>

          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#plataformas" onClick={() => setMobileMenuOpen(false)}>Plataformas</a>
            <a href="#ecosistema" onClick={() => setMobileMenuOpen(false)}>Ecosistema</a>
            <a href="#tecnologia" onClick={() => setMobileMenuOpen(false)}>Tecnología</a>
            <a href="#impacto" onClick={() => setMobileMenuOpen(false)}>Impacto</a>
            <Link href="/login" className={styles.mobileMenuCta} onClick={() => setMobileMenuOpen(false)}>
              Ingresar
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={`${styles.eyebrow} animate-fadeUp`}>
              <span className={styles.eyebrowLine}></span>
              <span>Sección RCD</span>
            </div>
            <h1 className={`${styles.heroTitle} animate-fadeUp delay-1`}>
              La transformación digital de{' '}
              <span className={styles.heroTitleAccent}>Recreación, Cultura y Deporte</span>
            </h1>
            <p className={`${styles.heroDescription} animate-fadeUp delay-2`}>
              Ecosistema de aplicaciones web diseñado para optimizar la gestión operativa, 
              el seguimiento de actividades y la toma de decisiones en la Universidad del Valle.
            </p>
            <div className={`${styles.heroCtas} animate-fadeUp delay-3`}>
              <Link href="/login" className={styles.ctaPrimary}>
                Acceder al portal
                <ArrowRightIcon />
              </Link>
              <a href="#plataformas" className={styles.ctaSecondary}>
                Explorar plataformas
              </a>
            </div>
            <div className={`${styles.heroStats} animate-fadeUp delay-4`}>
              <div className={styles.stat}>
                <span className={styles.statValue}>6</span>
                <span className={styles.statLabel}>Aplicaciones</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>2</span>
                <span className={styles.statLabel}>Áreas integradas</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>24/7</span>
                <span className={styles.statLabel}>Disponibilidad</span>
              </div>
            </div>
          </div>

          <div className={`${styles.heroMockup} animate-fadeIn delay-3`}>
            <div className={styles.mockupWindow}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className={styles.mockupUrl}>rcd.univalle.edu.co</span>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupSidebar}>
                  <div className={styles.mockupUser}>
                    <div className={styles.mockupAvatar}>MA</div>
                    <div>
                      <div className={styles.mockupUserName}>María Alejandra</div>
                      <div className={styles.mockupUserRole}>Coordinadora</div>
                    </div>
                  </div>
                  <div className={styles.mockupNav}>
                    <div className={styles.mockupNavItem + ' ' + styles.active}>Dashboard</div>
                    <div className={styles.mockupNavItem}>Bitácora</div>
                    <div className={styles.mockupNavItem}>Horarios</div>
                    <div className={styles.mockupNavItem}>Inventario</div>
                  </div>
                </div>
                <div className={styles.mockupMain}>
                  <div className={styles.mockupCard + ' ' + styles.floatingCard1}>
                    <div className={styles.mockupCardIcon}>
                      <CheckIcon />
                    </div>
                    <div>
                      <div className={styles.mockupCardTitle}>Asistencia registrada</div>
                      <div className={styles.mockupCardValue}>24 participantes</div>
                    </div>
                  </div>
                  <div className={styles.mockupCard + ' ' + styles.floatingCard2}>
                    <div className={styles.mockupCardIconAlert}>!</div>
                    <div>
                      <div className={styles.mockupCardTitle}>Alerta de inventario</div>
                      <div className={styles.mockupCardValue}>Stock bajo en percusión</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="plataformas" className={styles.platforms}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine}></span>
              <span>Plataformas</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Aplicaciones especializadas para cada necesidad
            </h2>
            <p className={styles.sectionDescription}>
              Cada módulo está diseñado para resolver desafíos específicos de la gestión cultural y deportiva.
            </p>
          </div>

          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Todas
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'cultura' ? styles.active : ''}`}
              onClick={() => setActiveFilter('cultura')}
            >
              Cultura
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === 'deporte' ? styles.active : ''}`}
              onClick={() => setActiveFilter('deporte')}
            >
              Deporte
            </button>
          </div>

          <div className={styles.platformsGrid}>
            {filteredPlatforms.map((platform) => (
              <div key={platform.id} className={styles.platformCard}>
                <div className={styles.platformCardLine}></div>
                <div className={styles.platformCardContent}>
                  <div className={styles.platformHeader}>
                    <h3 className={styles.platformName}>{platform.name}</h3>
                    <span className={`${styles.platformArea} ${styles[platform.area]}`}>
                      {platform.area === 'all' ? 'Multi-área' : platform.area}
                    </span>
                  </div>
                  <p className={styles.platformDescription}>{platform.description}</p>
                  <div className={styles.platformTags}>
                    {platform.tags.map((tag) => (
                      <span key={tag} className={styles.platformTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosistema" className={styles.ecosystem}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <div className={`${styles.eyebrow} ${styles.light}`}>
              <span className={styles.eyebrowLine}></span>
              <span>Ecosistema</span>
            </div>
            <h2 className={`${styles.sectionTitle} ${styles.light}`}>
              Tres dimensiones integradas
            </h2>
            <p className={`${styles.sectionDescription} ${styles.light}`}>
              Un sistema cohesivo que conecta la operación diaria con la formación y la logística institucional.
            </p>
          </div>

          <div className={styles.ecosystemGrid}>
            <div className={styles.ecosystemCard}>
              <span className={styles.ecosystemNumber}>01</span>
              <h3 className={styles.ecosystemCardTitle}>Operativa</h3>
              <p className={styles.ecosystemCardDescription}>
                Control de asistencia, gestión de grupos, seguimiento de actividades y registro de participación.
              </p>
            </div>
            <div className={styles.ecosystemCard}>
              <span className={styles.ecosystemNumber}>02</span>
              <h3 className={styles.ecosystemCardTitle}>Formativa</h3>
              <p className={styles.ecosystemCardDescription}>
                Programación de horarios, coordinación de espacios, gestión de instructores y planificación semestral.
              </p>
            </div>
            <div className={styles.ecosystemCard}>
              <span className={styles.ecosystemNumber}>03</span>
              <h3 className={styles.ecosystemCardTitle}>Logística</h3>
              <p className={styles.ecosystemCardDescription}>
                Inventario de recursos, préstamos de equipos, mantenimiento y trazabilidad de activos.
              </p>
            </div>
          </div>

          <div className={styles.ecosystemFlow}>
            <div className={styles.flowChip}>Usuario</div>
            <div className={styles.flowArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.flowChip}>Portal RCD</div>
            <div className={styles.flowArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.flowChip}>Módulos</div>
            <div className={styles.flowArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.flowChip}>Datos</div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tecnologia" className={styles.technology}>
        <div className={styles.sectionContent}>
          <div className={styles.techGrid}>
            <div className={styles.techText}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine}></span>
                <span>Tecnología</span>
              </div>
              <h2 className={styles.sectionTitle}>
                Construido con tecnología de vanguardia
              </h2>
              <p className={styles.sectionDescription}>
                Stack moderno que garantiza rendimiento, seguridad y escalabilidad para las necesidades actuales y futuras de la universidad.
              </p>
            </div>
            <div className={styles.techCards}>
              {TECH_STACK.map((tech) => (
                <div key={tech.name} className={styles.techCard}>
                  <div className={styles.techCardIcon}>
                    <TechIcon type={tech.icon} />
                  </div>
                  <div>
                    <h3 className={styles.techCardName}>{tech.name}</h3>
                    <p className={styles.techCardDescription}>{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impacto" className={styles.impact}>
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine}></span>
              <span>Impacto</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Transformando la gestión universitaria
            </h2>
            <p className={styles.sectionDescription}>
              Resultados tangibles que mejoran la experiencia de usuarios, monitores y administrativos.
            </p>
          </div>

          <div className={styles.impactGrid}>
            {IMPACT_ITEMS.map((item) => (
              <div key={item.title} className={styles.impactCard}>
                <div className={styles.impactCardIcon}>
                  <ImpactIcon type={item.icon} />
                </div>
                <h3 className={styles.impactCardTitle}>{item.title}</h3>
                <p className={styles.impactCardDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Comienza a transformar la gestión de tu área hoy
          </h2>
          <p className={styles.ctaDescription}>
            Accede al portal con tu cuenta institucional y descubre todas las herramientas disponibles.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/login" className={styles.ctaButtonPrimary}>
              Ingresar al portal
              <ArrowRightIcon />
            </Link>
            <a href="mailto:rcd@correounivalle.edu.co" className={styles.ctaButtonSecondary}>
              Contactar soporte
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <span>© 2024 Sección Recreación, Cultura y Deporte</span>
            <span className={styles.footerDivider}>|</span>
            <span>Universidad del Valle, Cali, Colombia</span>
          </div>
          <div className={styles.footerRight}>
            <span className={styles.footerVersion}>v1.0.0</span>
            <span className={styles.footerDivider}>|</span>
            <span>Next.js · Firebase · Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
