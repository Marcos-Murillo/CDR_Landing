"use client"

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hoocks/use-auth'
import { SuperadminLayout } from '@/components/superadmin-layout'
import { superadminFetch } from '@/lib/superadmin-fetch'
import type { PersonLookupResult, PersonRegistryStats } from '@/lib/person-registry/types'
import styles from './personas.module.css'
import {
  PERSON_REGISTRY_PAGE_EYEBROW,
  PERSON_REGISTRY_PAGE_TITLE,
} from '@/lib/superadmin-nav'

const SYSTEM_LABELS: Record<string, string> = {
  asistencias_cultura: 'Asistencias Cultura',
  asistencias_deporte: 'Asistencias Deporte',
  gym_cdu: 'Gym CDU',
  stock_cdu: 'Stock CDU',
  stock_cultura: 'Stock Cultura',
  prestamos_escenarios: 'Préstamos escenarios',
}

function StatCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string
  value: number | string
  hint?: string
  highlight?: boolean
}) {
  return (
    <div className={`${styles.statCard} ${highlight ? styles.statCardHighlight : ''}`}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {hint && <div className={styles.statHint}>{hint}</div>}
    </div>
  )
}

function Block({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.block}>
      <div className={styles.blockTitle}>{title}</div>
      {children}
    </div>
  )
}

function AreaPanel({
  title,
  detail,
  variant,
}: {
  title: string
  detail: NonNullable<PersonLookupResult['cultura']>
  variant: 'cultura' | 'deporte'
}) {
  const hasAny =
    detail.asistencias ||
    detail.stock ||
    detail.prestamosEscenarios ||
    detail.gym

  if (!hasAny) return null

  return (
    <section className={styles.areaSection}>
      <h3 className={styles.areaTitle}>
        <span className={variant === 'cultura' ? styles.badgeCultura : styles.badgeDeporte}>
          {title}
        </span>
      </h3>

      {detail.asistencias && (
        <Block title="Asistencias a grupos">
          <div className={styles.blockRow}>
            <span>Total asistencias</span>
            <strong>{detail.asistencias.totalAsistencias}</strong>
          </div>
          {detail.asistencias.ultimaAsistencia && (
            <div className={styles.blockRow}>
              <span>Última asistencia</span>
              <span>{detail.asistencias.ultimaAsistencia}</span>
            </div>
          )}
          {detail.asistencias.grupos.length > 0 && (
            <>
              <p className={styles.statHint}>Grupos ({detail.asistencias.grupos.length})</p>
              <ul className={styles.list}>
                {detail.asistencias.grupos.slice(0, 8).map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </>
          )}
          {detail.asistencias.categorias.length > 0 && (
            <ul className={styles.list}>
              {detail.asistencias.categorias.map((c) => (
                <li key={`${c.grupo}-${c.categoria}`}>
                  {c.grupo}: {c.categoria}
                </li>
              ))}
            </ul>
          )}
        </Block>
      )}

      {detail.gym && (
        <Block title="Gym CDU">
          <div className={styles.blockRow}>
            <span>Visitas registradas</span>
            <strong>{detail.gym.totalVisitas}</strong>
          </div>
          {detail.gym.ultimaVisita && (
            <div className={styles.blockRow}>
              <span>Última visita</span>
              <span>{detail.gym.ultimaVisita}</span>
            </div>
          )}
          {Object.entries(detail.gym.porInstalacion).map(([inst, n]) => (
            <div key={inst} className={styles.blockRow}>
              <span>{inst}</span>
              <span>{n}</span>
            </div>
          ))}
        </Block>
      )}

      {detail.stock && (
        <Block title="Préstamo de implementos (Stock)">
          <div className={styles.blockRow}>
            <span>Préstamos totales</span>
            <strong>{detail.stock.totalPrestamos}</strong>
          </div>
          <div className={styles.blockRow}>
            <span>Activos</span>
            <strong>{detail.stock.activos}</strong>
          </div>
          {detail.stock.items.length > 0 && (
            <ul className={styles.list}>
              {detail.stock.items.map((item, i) => (
                <li key={i}>
                  {item.nombre} — {item.fecha} ({item.estado})
                </li>
              ))}
            </ul>
          )}
        </Block>
      )}

      {detail.prestamosEscenarios && (
        <Block title="Préstamo de escenarios">
          <div className={styles.blockRow}>
            <span>Reservas</span>
            <strong>{detail.prestamosEscenarios.totalReservas}</strong>
          </div>
          {Object.entries(detail.prestamosEscenarios.porEstado).map(([est, n]) => (
            <div key={est} className={styles.blockRow}>
              <span>{est}</span>
              <span>{n}</span>
            </div>
          ))}
          {detail.prestamosEscenarios.reservas.length > 0 && (
            <ul className={styles.list}>
              {detail.prestamosEscenarios.reservas.map((r, i) => (
                <li key={i}>
                  {r.cancha} — {r.fecha} ({r.estado})
                </li>
              ))}
            </ul>
          )}
        </Block>
      )}
    </section>
  )
}

export default function SuperadminPersonasPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const [stats, setStats] = useState<PersonRegistryStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  const [searchType, setSearchType] = useState<'documento' | 'codigo'>('documento')
  const [searchValue, setSearchValue] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [result, setResult] = useState<PersonLookupResult | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const loadStats = useCallback(async (forceRefresh = false) => {
    setStatsLoading(true)
    setStatsError('')
    try {
      const url = forceRefresh
        ? '/api/superadmin/person-registry/stats?refresh=1'
        : '/api/superadmin/person-registry/stats'
      const res = await superadminFetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al cargar estadísticas')
      setStats(data)
    } catch (e) {
      setStatsError(e instanceof Error ? e.message : 'Error de conexión')
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (loading) return
    const isSuperadminSession = sessionStorage.getItem('superadmin_auth') === 'true'
    const isAuthorized = isSuperadminSession || user?.role === 'superadmin'
    if (!isAuthorized) {
      router.push('/login')
      return
    }
    setAuthorized(true)
    void loadStats(false)
  }, [user, loading, router, loadStats])

  const handleDownloadPdf = async () => {
    if (!result?.found) return
    setPdfLoading(true)
    setSearchError('')
    try {
      const res = await superadminFetch('/api/superadmin/person-registry/report-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'No se pudo generar el PDF')
      }
      const blob = await res.blob()
      const disposition = res.headers.get('Content-Disposition') ?? ''
      const match = disposition.match(/filename="([^"]+)"/)
      const fileName = match?.[1] ?? `reporte-360-${result.query.value}.pdf`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : 'No se pudo generar el PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return
    setSearching(true)
    setSearchError('')
    setResult(null)
    try {
      const params = new URLSearchParams({
        type: searchType,
        value: searchValue.trim(),
      })
      const res = await superadminFetch(
        `/api/superadmin/person-registry/lookup?${params}`
      )
      const data: PersonLookupResult = await res.json()
      if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Error en búsqueda')
      setResult(data)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setSearching(false)
    }
  }

  if (authorized !== true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' }}>
        Cargando...
      </div>
    )
  }

  return (
    <SuperadminLayout
      title={PERSON_REGISTRY_PAGE_TITLE}
      eyebrow={PERSON_REGISTRY_PAGE_EYEBROW}
      headerAction={
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={() => loadStats(true)}
          disabled={statsLoading}
        >
          {statsLoading ? 'Actualizando…' : stats ? 'Actualizar datos' : 'Cargar resumen'}
        </button>
      }
    >
      {statsError && <div className={`${styles.alert} ${styles.alertError}`}>{statsError}</div>}

      {stats?.fromPersistedSnapshot && !stats.staleSnapshot && (
        <div className={`${styles.alert} ${styles.alertWarn}`}>
          Resumen desde caché
          {stats.cacheAgeMinutes != null ? ` (${stats.cacheAgeMinutes} min)` : ''}. Use «Actualizar datos»
          solo cuando necesite cifras al día (lee todas las bases y consume cuota).
        </div>
      )}

      {stats?.systemsUnavailable && stats.systemsUnavailable.length > 0 && (
        <div className={`${styles.alert} ${styles.alertWarn}`}>
          Sistemas no disponibles: {stats.systemsUnavailable.join(' · ')}
        </div>
      )}

      {statsLoading && !stats ? (
        <div className={styles.loading}>Cargando resumen… (puede tardar un minuto)</div>
      ) : stats ? (
        <>
          <div className={styles.statsGrid}>
            <StatCard label="Personas Cultura" value={stats.personasCultura} hint="Asistencias y/o Stock Cultura" highlight />
            <StatCard label="Personas Deporte" value={stats.personasDeporte} hint="Asistencias, Gym y/o Stock CDU" />
            <StatCard label="En ambas áreas" value={stats.personasAmbasAreas} hint="Cultura y Deporte" />
          </div>
        </>
      ) : null}

      <div className={styles.searchCard}>
        <div className={styles.searchTabs}>
          <button
            type="button"
            className={`${styles.tab} ${searchType === 'documento' ? styles.tabActive : ''}`}
            onClick={() => setSearchType('documento')}
          >
            Cédula / documento
          </button>
          <button
            type="button"
            className={`${styles.tab} ${searchType === 'codigo' ? styles.tabActive : ''}`}
            onClick={() => setSearchType('codigo')}
          >
            Código estudiantil
          </button>
        </div>
        <form onSubmit={handleSearch} className={styles.searchRow}>
          <input
            className={styles.input}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              searchType === 'documento'
                ? 'Ej: 1234567890'
                : 'Ej: 2233445'
            }
          />
          <button type="submit" className={styles.searchBtn} disabled={searching}>
            {searching ? 'Buscando…' : 'Buscar'}
          </button>
        </form>
      </div>

      {searchError && <div className={`${styles.alert} ${styles.alertError}`}>{searchError}</div>}

      {result && !result.found && (
        <div className={styles.empty}>
          No se encontró uso de servicios para{' '}
          {result.query.type === 'documento' ? 'el documento' : 'el código'}{' '}
          <strong>{result.query.value}</strong> en los sistemas conectados.
        </div>
      )}

      {result?.found && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div className={styles.resultHeaderTop}>
              <div className={styles.resultTitle}>
                {result.nombres.length > 0 ? result.nombres.join(' · ') : 'Persona encontrada'}
              </div>
              <button
                type="button"
                className={styles.pdfBtn}
                onClick={() => void handleDownloadPdf()}
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Generando PDF…' : 'Descargar PDF'}
              </button>
            </div>
            <div className={styles.badges}>
              {result.areas.map((a) => (
                <span
                  key={a}
                  className={`${styles.badge} ${a === 'cultura' ? styles.badgeCultura : a === 'deporte' ? styles.badgeDeporte : ''}`}
                >
                  {a === 'ambas' ? 'Cultura + Deporte' : a === 'cultura' ? 'Cultura' : 'Deporte'}
                </span>
              ))}
            </div>
            <div className={styles.systemsRow}>
              {result.sistemas.map((s) => (
                <span key={s} className={styles.systemChip}>
                  {SYSTEM_LABELS[s] ?? s}
                </span>
              ))}
            </div>
          </div>

          {result.cultura && (
            <AreaPanel title="Área Cultura" detail={result.cultura} variant="cultura" />
          )}
          {result.deporte && (
            <AreaPanel title="Área Deporte" detail={result.deporte} variant="deporte" />
          )}
        </div>
      )}
    </SuperadminLayout>
  )
}
