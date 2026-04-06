"use client"

import { useState } from 'react'
import Link from 'next/link'
import LogoIcon from '@/components/logo-icon'
import { FlippingCard } from '@/components/ui/flipping-card'
import { GlowingButton } from '@/components/ui/glowing-button'
import { BorderBeam } from '@/components/ui/border-beam'
import { CursorCard, CursorCardsContainer } from '@/components/ui/cursor-cards'
import styles from './page.module.css'

const PLATFORMS = [
  {
    id: 'bitacoraac',
    name: 'Bitácora AC',
    description: 'Registro de actividades, seguimiento de tareas y control de asistencia de monitores del área de cultura.',
    area: 'cultura',
    tags: ['Actividades', 'Asistencia', 'Monitores'],
  },
  {
    id: 'bitacora_comunicaciones',
    name: 'Bitácora COM',
    description: 'Registro y seguimiento de actividades del área de comunicaciones de la sección.',
    area: 'cultura',
    tags: ['Comunicaciones', 'Registros', 'Seguimiento'],
  },
  {
    id: 'stock_cultura',
    name: 'Stock Cultura',
    description: 'Gestión de inventario de instrumentos, materiales y recursos del área cultural.',
    area: 'cultura',
    tags: ['Inventario', 'Instrumentos', 'Recursos'],
  },
  {
    id: 'horarios',
    name: 'Horarios Cultura',
    description: 'Consulta pública de horarios de grupos culturales: danza, música, teatro y más.',
    area: 'cultura',
    tags: ['Horarios', 'Grupos', 'Espacios'],
  },
  {
    id: 'asistencias',
    name: 'Asistencias',
    description: 'Sistema multi-área de inscripciones, asistencia con QR, estadísticas y reportes para cultura y deporte.',
    area: 'all',
    tags: ['Inscripciones', 'QR', 'Estadísticas'],
  },
  {
    id: 'stock_cdu',
    name: 'Stock CDU',
    description: 'Inventario deportivo con registro de usuarios, préstamos de equipos y reportes del Centro Deportivo.',
    area: 'deporte',
    tags: ['Préstamos', 'Inventario', 'Reportes'],
  },
  {
    id: 'horarios_cdu',
    name: 'Horarios CDU',
    description: 'Consulta de horarios de grupos y disciplinas deportivas del Centro Deportivo Universitario.',
    area: 'deporte',
    tags: ['Horarios', 'Deportes', 'CDU'],
  },
  {
    id: 'gym_cdu',
    name: 'GymControl CDU',
    description: 'Registro y control de acceso a las instalaciones del gimnasio del Centro Deportivo.',
    area: 'deporte',
    tags: ['Gimnasio', 'Registro', 'Acceso'],
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
            <LogoIcon size={40} />
            <div className={styles.logoText}>
              <span className={styles.logoName}>CampusFlow</span>
              <span className={styles.logoTag}>Universidad del Valle</span>
            </div>
          </Link>

          <div className={styles.navLinks}>
            <a href="#plataformas">Plataformas</a>
            <a href="#ecosistema">Ecosistema</a>
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
              <span>CampusFlow</span>
            </div>
            <h1 className={`${styles.heroTitle} animate-fadeUp delay-1`}>
              Controla toda la operación de{' '}
              <span className={styles.heroTitleAccent}>Cultura, Recreación y Deporte</span>
              {' '} desde un solo lugar
            </h1>
            <p className={`${styles.heroDescription} animate-fadeUp delay-2`}>
              Gestiona inscripciones, asistencia y espacios en tiempo real y más
              con estadísticas automáticas para tomar mejores decisiones.
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
                <span className={styles.statValue}>8</span>
                <span className={styles.statLabel}>Aplicaciones</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>3</span>
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
              {/* Browser chrome */}
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span className={styles.dot1}></span>
                  <span className={styles.dot2}></span>
                  <span className={styles.dot3}></span>
                </div>
                <span className={styles.mockupUrl}>campusflow.univalle.edu.co/dashboard</span>
              </div>

              {/* App shell */}
              <div className={styles.mockupShell}>
                {/* Sidebar */}
                <div className={styles.mockupSidebar}>
                  <div className={styles.mockupBrand}>
                    <div className={styles.mockupBrandDot}></div>
                    <span>CampusFlow</span>
                  </div>
                  <div className={styles.mockupUser}>
                    <div className={styles.mockupAvatar}>MA</div>
                    <div>
                      <div className={styles.mockupUserName}>M. Alejandra</div>
                      <div className={styles.mockupUserRole}>Admin · Cultura</div>
                    </div>
                  </div>
                  <div className={styles.mockupNav}>
                    <div className={`${styles.mockupNavItem} ${styles.active}`}>
                      <span className={styles.mockupNavDot}></span>Dashboard
                    </div>
                    <div className={styles.mockupNavItem}>
                      <span className={styles.mockupNavDot}></span>Bitácora
                    </div>
                    <div className={styles.mockupNavItem}>
                      <span className={styles.mockupNavDot}></span>Asistencias
                    </div>
                    <div className={styles.mockupNavItem}>
                      <span className={styles.mockupNavDot}></span>Inventario
                    </div>
                    <div className={styles.mockupNavItem}>
                      <span className={styles.mockupNavDot}></span>Horarios
                    </div>
                  </div>
                </div>

                {/* Main area */}
                <div className={styles.mockupMain}>
                  {/* Topbar */}
                  <div className={styles.mockupTopbar}>
                    <span className={styles.mockupTopbarTitle}>Dashboard</span>
                    <div className={styles.mockupTopbarActions}>
                      <div className={styles.mockupTopbarBtn}></div>
                      <div className={styles.mockupTopbarAvatar}>MA</div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className={styles.mockupStats}>
                    <div className={styles.mockupStatCard}>
                      <div className={styles.mockupStatLabel}>Asistencias hoy</div>
                      <div className={styles.mockupStatValue}>142</div>
                      <div className={styles.mockupStatBadge + ' ' + styles.green}>+12%</div>
                    </div>
                    <div className={styles.mockupStatCard}>
                      <div className={styles.mockupStatLabel}>Grupos activos</div>
                      <div className={styles.mockupStatValue}>28</div>
                      <div className={styles.mockupStatBadge + ' ' + styles.blue}>Cultura</div>
                    </div>
                    <div className={styles.mockupStatCard}>
                      <div className={styles.mockupStatLabel}>Inscripciones</div>
                      <div className={styles.mockupStatValue}>1.4k</div>
                      <div className={styles.mockupStatBadge + ' ' + styles.green}>+5%</div>
                    </div>
                  </div>

                  {/* Chart bar mock */}
                  <div className={styles.mockupChartCard}>
                    <div className={styles.mockupChartHeader}>
                      <span className={styles.mockupChartTitle}>Asistencia semanal</span>
                      <span className={styles.mockupChartPill}>Esta semana</span>
                    </div>
                    <div className={styles.mockupChart}>
                      <div className={styles.mockupBar} style={{height:'45%'}}></div>
                      <div className={styles.mockupBar} style={{height:'70%'}}></div>
                      <div className={styles.mockupBar} style={{height:'55%'}}></div>
                      <div className={styles.mockupBar} style={{height:'90%'}}></div>
                      <div className={styles.mockupBar} style={{height:'65%'}}></div>
                      <div className={styles.mockupBarActive} style={{height:'80%'}}></div>
                      <div className={styles.mockupBar} style={{height:'40%'}}></div>
                    </div>
                    <div className={styles.mockupChartLabels}>
                      <span>L</span><span>M</span><span>X</span>
                      <span>J</span><span>V</span><span>S</span><span>D</span>
                    </div>
                  </div>

                  {/* Activity list */}
                  <div className={styles.mockupActivity}>
                    <div className={styles.mockupActivityRow}>
                      <div className={styles.mockupActivityDot + ' ' + styles.green}></div>
                      <span className={styles.mockupActivityText}>Danza Contemporánea — 24 asistentes</span>
                      <span className={styles.mockupActivityTime}>09:00</span>
                    </div>
                    <div className={styles.mockupActivityRow}>
                      <div className={styles.mockupActivityDot + ' ' + styles.blue}></div>
                      <span className={styles.mockupActivityText}>Teatro — 18 asistentes</span>
                      <span className={styles.mockupActivityTime}>10:30</span>
                    </div>
                    <div className={styles.mockupActivityRow}>
                      <div className={styles.mockupActivityDot + ' ' + styles.yellow}></div>
                      <span className={styles.mockupActivityText}>Stock bajo: Percusión</span>
                      <span className={styles.mockupActivityTime}>Alerta</span>
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
            <GlowingButton
              glowColor={activeFilter === 'all' ? '#2563EB' : '#93c5fd'}
              className={`${styles.filterTabBtn} ${activeFilter === 'all' ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Todas
            </GlowingButton>
            <GlowingButton
              glowColor={activeFilter === 'cultura' ? '#2563EB' : '#93c5fd'}
              className={`${styles.filterTabBtn} ${activeFilter === 'cultura' ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter('cultura')}
            >
              Cultura
            </GlowingButton>
            <GlowingButton
              glowColor={activeFilter === 'deporte' ? '#2563EB' : '#93c5fd'}
              className={`${styles.filterTabBtn} ${activeFilter === 'deporte' ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter('deporte')}
            >
              Deporte
            </GlowingButton>
          </div>

          <div className={styles.platformsGrid}>
            {filteredPlatforms.map((platform) => (
              <FlippingCard
                key={platform.id}
                width={320}
                height={200}
                className="!rounded-2xl"
                frontContent={
                  <div className={styles.flipFront}>
                    <div className={styles.platformCardLine} />
                    <div className={styles.platformHeader}>
                      <h3 className={styles.platformName}>{platform.name}</h3>
                      <span className={`${styles.platformArea} ${styles[platform.area]}`}>
                        {platform.area === 'all' ? 'Multi-área' : platform.area}
                      </span>
                    </div>
                    <p className={styles.platformDescription}>{platform.description}</p>
                    <div className={styles.platformTags}>
                      {platform.tags.map((tag) => (
                        <span key={tag} className={styles.platformTag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                }
                backContent={
                  <div className={styles.flipBack}>
                    <p className={styles.flipBackDesc}>{platform.description}</p>
                    <Link href="/login" className={styles.flipBackBtn}>
                      Acceder <ArrowRightIcon />
                    </Link>
                  </div>
                }
              />
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
              <BorderBeam lightColor="#3b82f6" duration={6} lightWidth={180} />
              <div className={styles.ecosystemCardInner}>
                <span className={styles.ecosystemNumber}>01</span>
                <h3 className={styles.ecosystemCardTitle}>Operativa</h3>
                <p className={styles.ecosystemCardDescription}>
                  Control de asistencia, gestión de grupos, seguimiento de actividades y registro de participación.
                </p>
              </div>
            </div>
            <div className={styles.ecosystemCard}>
              <BorderBeam lightColor="#8b5cf6" duration={8} lightWidth={180} />
              <div className={styles.ecosystemCardInner}>
                <span className={styles.ecosystemNumber}>02</span>
                <h3 className={styles.ecosystemCardTitle}>Formativa</h3>
                <p className={styles.ecosystemCardDescription}>
                  Programación de horarios, coordinación de espacios, gestión de instructores y planificación semestral.
                </p>
              </div>
            </div>
            <div className={styles.ecosystemCard}>
              <BorderBeam lightColor="#22c55e" duration={10} lightWidth={180} />
              <div className={styles.ecosystemCardInner}>
                <span className={styles.ecosystemNumber}>03</span>
                <h3 className={styles.ecosystemCardTitle}>Logística</h3>
                <p className={styles.ecosystemCardDescription}>
                  Inventario de recursos, préstamos de equipos, mantenimiento y trazabilidad de activos.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.ecosystemFlow}>
            <div className={styles.flowChip}>Usuario</div>
            <div className={styles.flowArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.flowChip}>Portal CampusFlow</div>
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

          <CursorCardsContainer className={styles.impactGrid}>
            {IMPACT_ITEMS.map((item) => (
              <CursorCard
                key={item.title}
                borderColor="#e2e8f0"
                primaryHue="#93c5fd"
                secondaryHue="#2563EB"
                illuminationColor="#3b82f620"
                className={styles.impactCard}
              >
                <div className={styles.impactCardIcon}>
                  <ImpactIcon type={item.icon} />
                </div>
                <h3 className={styles.impactCardTitle}>{item.title}</h3>
                <p className={styles.impactCardDescription}>{item.description}</p>
              </CursorCard>
            ))}
          </CursorCardsContainer>
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
            <a href="mailto:campusflow@correounivalle.edu.co" className={styles.ctaButtonSecondary}>
              Contactar soporte
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <span>© 2026 Sección Cultura, Recreación y Deporte</span>
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
