/**
 * Requisitos de acceso por plataforma — fuente única para formulario superadmin y SSO.
 */

export type PlatformId =
  | 'bitacoraac'
  | 'bitacora_comunicaciones'
  | 'stock_cultura'
  | 'horarios'
  | 'asistencias_cultura'
  | 'canal_comunicaciones'
  | 'stock_cdu'
  | 'stock_cdu_sanfer'
  | 'horarios_cdu'
  | 'gym_cdu'
  | 'asistencias_deporte'
  | 'prestamos_escenarios'

export type UserArea = 'cultura' | 'deporte' | 'all'
export type CdrRole = 'admin' | 'monitor'
export type StaffSede = 'melendez' | 'san_fernando' | ''

export interface PlatformRoleOption {
  value: string
  label: string
  hint?: string
}

export interface PlatformSelectField {
  kind: 'select'
  key: string
  label: string
  options: { value: string; label: string }[]
  required?: boolean
  hint?: string
  /** Mostrar solo si el rol CDR del usuario es monitor */
  whenMonitor?: boolean
}

export interface PlatformRoleField {
  kind: 'role'
  label: string
  hint?: string
  options: PlatformRoleOption[]
}

export interface PlatformInfoField {
  kind: 'info'
  message: string
}

export type PlatformField = PlatformRoleField | PlatformSelectField | PlatformInfoField

export type PlatformArea = 'cultura' | 'deporte' | 'both'

export interface PlatformAccessDefinition {
  id: PlatformId
  name: string
  area: PlatformArea
  /** Todas las plataformas requieren asignación explícita en platforms[] desde super admin */
  grantMode: 'manual'
  /** Rol por defecto según rol CDR (si no hay platformRoles override) */
  defaultRoles: { admin: string; monitor: string; superadmin?: string }
  fields: PlatformField[]
}

export const PLATFORM_ACCESS: PlatformAccessDefinition[] = [
  {
    id: 'bitacoraac',
    name: 'Bitácora AC',
    area: 'both',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'guest', superadmin: 'superadmin' },
    fields: [
      {
        kind: 'info',
        message:
          'Asignación manual. Cada dependencia ve su propia base de datos. Rol CDR: Administrador → admin; Monitor → invitado (guest).',
      },
    ],
  },
  {
    id: 'bitacora_comunicaciones',
    name: 'Bitácora COM',
    area: 'cultura',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'guest', superadmin: 'superadmin' },
    fields: [
      {
        kind: 'info',
        message: 'Usa el rol CDR: Administrador → admin; Monitor → invitado (guest).',
      },
    ],
  },
  {
    id: 'stock_cultura',
    name: 'Stock Cultura',
    area: 'cultura',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'monitor', superadmin: 'admin' },
    fields: [
      {
        kind: 'info',
        message: 'Usa el rol CDR: Administrador o Monitor según permisos de inventario.',
      },
    ],
  },
  {
    id: 'horarios',
    name: 'Horarios Cultura',
    area: 'cultura',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'monitor', superadmin: 'admin' },
    fields: [
      {
        kind: 'info',
        message: 'Asignación manual desde super admin.',
      },
    ],
  },
  {
    id: 'asistencias_cultura',
    name: 'Asistencias Cultura',
    area: 'cultura',
    grantMode: 'manual',
    defaultRoles: { admin: 'ADMIN', monitor: 'MONITOR', superadmin: 'SUPER_ADMIN' },
    fields: [
      {
        kind: 'info',
        message: 'Asignación manual. Roles: ADMIN / MONITOR según rol CDR.',
      },
    ],
  },
  {
    id: 'canal_comunicaciones',
    name: 'Canal Comunicaciones',
    area: 'both',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'manager', superadmin: 'superadmin' },
    fields: [
      {
        kind: 'role',
        label: 'Rol en Canal Comunicaciones',
        hint: 'Obligatorio. Debe ser un rol nativo de la plataforma.',
        options: [
          { value: 'admin', label: 'Administrador', hint: 'Revisa y gestiona eventos' },
          { value: 'manager', label: 'Manager', hint: 'Envía peticiones de eventos' },
        ],
      },
    ],
  },
  {
    id: 'stock_cdu',
    name: 'Stock CDU Meléndez',
    area: 'deporte',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'monitor', superadmin: 'superadmin' },
    fields: [
      {
        kind: 'info',
        message: 'Usa el rol CDR para permisos de inventario deportivo.',
      },
    ],
  },
  {
    id: 'stock_cdu_sanfer',
    name: 'Stock CDU San Fernando',
    area: 'deporte',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'monitor', superadmin: 'superadmin' },
    fields: [
      {
        kind: 'select',
        key: 'sede',
        label: 'Sede',
        options: [
          { value: 'san_fernando', label: 'San Fernando' },
          { value: 'melendez', label: 'Meléndez' },
        ],
        required: true,
        hint: 'Sede asociada al préstamo en San Fernando.',
      },
    ],
  },
  {
    id: 'horarios_cdu',
    name: 'Horarios CDU',
    area: 'deporte',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'monitor', superadmin: 'admin' },
    fields: [
      {
        kind: 'info',
        message: 'Asignación manual desde super admin.',
      },
    ],
  },
  {
    id: 'gym_cdu',
    name: 'GymControl CDU',
    area: 'deporte',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'monitor', superadmin: 'admin' },
    fields: [
      {
        kind: 'select',
        key: 'sede',
        label: 'Sede CDU',
        options: [
          { value: '', label: 'Sin sede fija' },
          { value: 'melendez', label: 'Meléndez' },
          { value: 'san_fernando', label: 'San Fernando' },
        ],
        hint: 'Opcional. Filtra la sede en CDUControl.',
      },
      {
        kind: 'select',
        key: 'espacio',
        label: 'Espacio (solo monitor)',
        options: [
          { value: 'gimnasio', label: 'Gimnasio' },
          { value: 'guardarropas', label: 'Guardarropas' },
          { value: 'piscina', label: 'Piscina' },
        ],
        whenMonitor: true,
        hint: 'Zona de registro de accesos para monitores.',
      },
      {
        kind: 'info',
        message: 'La cédula es necesaria para el SSO con GymControl.',
      },
    ],
  },
  {
    id: 'asistencias_deporte',
    name: 'Asistencias Deporte',
    area: 'deporte',
    grantMode: 'manual',
    defaultRoles: { admin: 'ADMIN', monitor: 'MONITOR', superadmin: 'SUPER_ADMIN' },
    fields: [
      {
        kind: 'info',
        message: 'Asignación manual desde super admin.',
      },
    ],
  },
  {
    id: 'prestamos_escenarios',
    name: 'Préstamos Escenarios',
    area: 'deporte',
    grantMode: 'manual',
    defaultRoles: { admin: 'admin', monitor: 'admin', superadmin: 'superadmin' },
    fields: [
      {
        kind: 'info',
        message: 'Asignación manual desde super admin.',
      },
    ],
  },
]

export const PLATFORM_BY_ID = Object.fromEntries(
  PLATFORM_ACCESS.map((p) => [p.id, p])
) as Record<PlatformId, PlatformAccessDefinition>

export const MANUAL_PLATFORMS = PLATFORM_ACCESS

export function platformMatchesUserArea(platformArea: PlatformArea, userArea: UserArea): boolean {
  if (platformArea === 'both' || userArea === 'all') return true
  return platformArea === userArea
}

export function requiresCedula(platforms: string[]): boolean {
  return platforms.some((id) => id === 'gym_cdu' || id === 'canal_comunicaciones')
}

export interface PlatformFormState {
  platforms: string[]
  platformRoles: Record<string, string>
  platformConfig: Record<string, Record<string, string>>
  cedula: string
  sede: StaffSede
}

export function validatePlatformAccess(
  role: CdrRole,
  area: UserArea,
  state: PlatformFormState
): string | null {
  if (state.platforms.length === 0) {
    return 'Selecciona al menos una plataforma.'
  }

  for (const id of state.platforms) {
    const def = PLATFORM_BY_ID[id as PlatformId]
    if (!def) continue

    if (!platformMatchesUserArea(def.area, area)) {
      const areaLabel =
        def.area === 'cultura' ? 'Cultura' : def.area === 'deporte' ? 'Deporte' : 'Cultura o Deporte'
      return `${def.name} requiere área ${areaLabel}. Cambia el área del usuario.`
    }

    for (const field of def.fields) {
      if (field.kind === 'role') {
        const val = state.platformRoles[id]
        if (!val || !field.options.some((o) => o.value === val)) {
          return `Selecciona el rol en ${def.name}.`
        }
      }
      if (field.kind === 'select' && field.required) {
        const val = state.platformConfig[id]?.[field.key] ?? (field.key === 'sede' ? state.sede : '')
        if (!val) {
          return `Completa "${field.label}" para ${def.name}.`
        }
      }
    }
  }

  if (requiresCedula(state.platforms) && !state.cedula.trim()) {
    return 'La cédula es obligatoria para GymControl y/o Canal Comunicaciones.'
  }

  return null
}

/** Resuelve sede global del perfil a partir de configs por plataforma */
/** Mapa de roles SSO usado por /api/auth/sso-token */
export const SSO_ROLE_MAP: Record<string, Record<string, string>> = Object.fromEntries(
  PLATFORM_ACCESS.map((p) => [
    p.id,
    {
      admin: p.defaultRoles.admin,
      monitor: p.defaultRoles.monitor,
      superadmin: p.defaultRoles.superadmin ?? p.defaultRoles.admin,
    },
  ])
)

export function resolveProfileSede(
  platforms: string[],
  platformConfig: Record<string, Record<string, string>>,
  explicitSede: StaffSede
): StaffSede | undefined {
  if (explicitSede) return explicitSede
  if (platforms.includes('stock_cdu_sanfer')) {
    return (platformConfig.stock_cdu_sanfer?.sede as StaffSede) || 'san_fernando'
  }
  if (platforms.includes('gym_cdu') && platformConfig.gym_cdu?.sede) {
    return platformConfig.gym_cdu.sede as StaffSede
  }
  return undefined
}
