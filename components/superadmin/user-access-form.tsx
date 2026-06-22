'use client'

import { useState } from 'react'
import { GradientSlideButton } from '@/components/ui/gradient-slide-button'
import {
  type CdrRole,
  type PlatformFormState,
  type StaffSede,
  type UserArea,
  MANUAL_PLATFORMS,
  platformMatchesUserArea,
  requiresCedula,
} from '@/lib/platform-access-config'
import { PRESTAMOS_ESCENARIOS_BASE_URL } from '@/lib/prestamos-escenarios-url'
import { STOCK_CDU_SANFER_BASE_URL } from '@/lib/stock-cdu-sanfer-url'
import styles from '@/app/superadmin/superadmin.module.css'

const MANUAL_WITH_AVAILABILITY = MANUAL_PLATFORMS.map((p) => ({
  ...p,
  available:
    p.id === 'stock_cdu_sanfer'
      ? Boolean(STOCK_CDU_SANFER_BASE_URL)
      : true,
}))

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={open ? styles.accordionChevronOpen : styles.accordionChevron}
    >
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export interface UserAccessFormValues {
  role: CdrRole
  area: UserArea
  platforms: string[]
  platformRoles: Record<string, string>
  platformConfig: Record<string, Record<string, string>>
  cedula: string
  sede: StaffSede
}

interface UserAccessFormProps {
  values: UserAccessFormValues
  onChange: (patch: Partial<UserAccessFormValues>) => void
  disabled?: boolean
}

export function UserAccessForm({ values, onChange, disabled }: UserAccessFormProps) {
  const { role, area, platforms, platformRoles, platformConfig, cedula, sede } = values
  const [expanded, setExpanded] = useState<string | null>(null)

  const showCedula = requiresCedula(platforms)

  const togglePlatform = (id: string, available: boolean) => {
    if (!available || disabled) return
    const next = platforms.includes(id)
      ? platforms.filter((x) => x !== id)
      : [...platforms, id]
    onChange({ platforms: next })
    if (!platforms.includes(id)) setExpanded(id)
    else if (expanded === id) setExpanded(null)
  }

  const setConfig = (platformId: string, key: string, value: string) => {
    const prev = platformConfig[platformId] ?? {}
    const nextConfig = { ...platformConfig, [platformId]: { ...prev, [key]: value } }
    const patch: Partial<UserAccessFormValues> = { platformConfig: nextConfig }
    if (key === 'sede' && (platformId === 'gym_cdu' || platformId === 'stock_cdu_sanfer')) {
      patch.sede = value as StaffSede
    }
    onChange(patch)
  }

  const selectedManual = MANUAL_WITH_AVAILABILITY.filter((p) => platforms.includes(p.id))

  return (
    <div className={styles.accessFormSections}>
      {/* Rol y área CDR */}
      <section className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Acceso en CDR Landing</h3>
        <p className={styles.formSectionDesc}>
          Define cómo ingresa al panel central. Las plataformas externas pueden tener roles propios abajo.
        </p>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Rol CDR</label>
            <select
              value={role}
              onChange={(e) => onChange({ role: e.target.value as CdrRole })}
              className={styles.select}
              disabled={disabled}
            >
              <option value="monitor">Monitor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Área</label>
            <select
              value={area}
              onChange={(e) => {
                const nextArea = e.target.value as UserArea
                const nextPlatforms = platforms.filter((id) => {
                  const def = MANUAL_WITH_AVAILABILITY.find((p) => p.id === id)
                  if (!def) return true
                  return platformMatchesUserArea(def.area, nextArea)
                })
                onChange({ area: nextArea, platforms: nextPlatforms })
              }}
              className={styles.select}
              disabled={disabled}
            >
              <option value="cultura">Cultura</option>
              <option value="deporte">Deporte</option>
              <option value="all">Multi-área</option>
            </select>
          </div>
        </div>
      </section>

      {/* Asignación de plataformas */}
      <section className={styles.formSection}>
        <h3 className={styles.formSectionTitle}>Plataformas asignadas</h3>
        <p className={styles.formSectionDesc}>
          Selecciona las plataformas. Cada una despliega solo los campos que necesita.
        </p>

        <div className={styles.platformGroup}>
          <span className={styles.platformGroupLabel}>Cultura y Deporte</span>
          <div className={styles.platformGrid}>
            {MANUAL_WITH_AVAILABILITY.filter((p) => p.area === 'both').map((p) => {
              const sel = platforms.includes(p.id)
              return (
                <GradientSlideButton
                  key={p.id}
                  type="button"
                  disabled={!p.available || disabled}
                  onClick={() => togglePlatform(p.id, p.available)}
                  colorFrom="#4ade80"
                  colorTo="#15803d"
                  className={`${styles.platformOption} ${sel ? styles.platformSelected : ''} ${!p.available ? styles.platformDisabled : ''}`}
                >
                  <span className={styles.platformName}>{p.name}</span>
                  {sel && <span className={styles.platformCheck}><CheckIcon /></span>}
                </GradientSlideButton>
              )
            })}
          </div>
        </div>

        <div className={styles.platformGroup}>
          <span className={styles.platformGroupLabel}>Cultura</span>
          <div className={styles.platformGrid}>
            {MANUAL_WITH_AVAILABILITY.filter((p) => p.area === 'cultura').map((p) => {
              const sel = platforms.includes(p.id)
              return (
                <GradientSlideButton
                  key={p.id}
                  type="button"
                  disabled={!p.available || disabled}
                  onClick={() => togglePlatform(p.id, p.available)}
                  colorFrom="#4ade80"
                  colorTo="#15803d"
                  className={`${styles.platformOption} ${sel ? styles.platformSelected : ''} ${!p.available ? styles.platformDisabled : ''}`}
                >
                  <span className={styles.platformName}>{p.name}</span>
                  {sel && <span className={styles.platformCheck}><CheckIcon /></span>}
                </GradientSlideButton>
              )
            })}
          </div>
        </div>

        <div className={styles.platformGroup}>
          <span className={styles.platformGroupLabel}>Deporte</span>
          <div className={styles.platformGrid}>
            {MANUAL_WITH_AVAILABILITY.filter((p) => p.area === 'deporte').map((p) => {
              const sel = platforms.includes(p.id)
              return (
                <GradientSlideButton
                  key={p.id}
                  type="button"
                  disabled={!p.available || disabled}
                  onClick={() => togglePlatform(p.id, p.available)}
                  colorFrom="#4ade80"
                  colorTo="#15803d"
                  className={`${styles.platformOption} ${sel ? styles.platformSelected : ''} ${!p.available ? styles.platformDisabled : ''}`}
                >
                  <span className={styles.platformName}>{p.name}</span>
                  {!p.available && <span className={styles.platformSoon}>Próximamente</span>}
                  {sel && p.available && <span className={styles.platformCheck}><CheckIcon /></span>}
                </GradientSlideButton>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cédula global si aplica */}
      {showCedula && (
        <section className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Cédula</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => onChange({ cedula: e.target.value })}
              placeholder="Requerida para SSO en plataformas seleccionadas"
              className={styles.input}
              disabled={disabled}
            />
          </div>
        </section>
      )}

      {/* Acordeones por plataforma seleccionada */}
      {selectedManual.length > 0 && (
        <section className={styles.formSection}>
          <h3 className={styles.formSectionTitle}>Configuración por plataforma</h3>
          <div className={styles.accordionList}>
            {selectedManual.map((p) => {
              const isOpen = expanded === p.id
              const hasRoleField = p.fields.some((f) => f.kind === 'role')
              const configSummary = hasRoleField
                ? platformRoles[p.id]
                  ? `Rol: ${platformRoles[p.id]}`
                  : 'Pendiente: rol'
                : 'Ver opciones'

              return (
                <div key={p.id} className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''}`}>
                  <button
                    type="button"
                    className={styles.accordionTrigger}
                    onClick={() => setExpanded(isOpen ? null : p.id)}
                    disabled={disabled}
                  >
                    <div className={styles.accordionTriggerText}>
                      <span className={styles.accordionTitle}>{p.name}</span>
                      <span className={styles.accordionMeta}>{configSummary}</span>
                    </div>
                    <ChevronIcon open={isOpen} />
                  </button>

                  {isOpen && (
                    <div className={styles.accordionBody}>
                      {p.fields.map((field, idx) => {
                        if (field.kind === 'info') {
                          return (
                            <p key={idx} className={styles.fieldHint}>
                              {field.message}
                            </p>
                          )
                        }
                        if (field.kind === 'role') {
                          return (
                            <div key={idx} className={styles.inputGroup}>
                              <label className={styles.label}>{field.label}</label>
                              {field.hint && <p className={styles.fieldHint}>{field.hint}</p>}
                              <select
                                value={platformRoles[p.id] ?? ''}
                                onChange={(e) =>
                                  onChange({
                                    platformRoles: { ...platformRoles, [p.id]: e.target.value },
                                  })
                                }
                                className={styles.select}
                                disabled={disabled}
                              >
                                <option value="">Seleccionar rol…</option>
                                {field.options.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                    {opt.hint ? ` — ${opt.hint}` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )
                        }
                        if (field.kind === 'select') {
                          if (field.whenMonitor && role !== 'monitor') return null
                          const val =
                            platformConfig[p.id]?.[field.key] ??
                            (field.key === 'sede' ? sede : '') ??
                            ''
                          return (
                            <div key={idx} className={styles.inputGroup}>
                              <label className={styles.label}>
                                {field.label}
                                {field.required ? ' *' : ''}
                              </label>
                              {field.hint && <p className={styles.fieldHint}>{field.hint}</p>}
                              <select
                                value={val}
                                onChange={(e) => setConfig(p.id, field.key, e.target.value)}
                                className={styles.select}
                                disabled={disabled}
                              >
                                {field.options.map((opt) => (
                                  <option key={opt.value || '__empty'} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

export function emptyAccessFormValues(): UserAccessFormValues {
  return {
    role: 'monitor',
    area: 'cultura',
    platforms: [],
    platformRoles: {},
    platformConfig: {},
    cedula: '',
    sede: '',
  }
}

export type { PlatformFormState }
