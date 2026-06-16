import { PRESTAMOS_ESCENARIOS_BASE_URL } from './prestamos-escenarios-url'
import { STOCK_CDU_SANFER_BASE_URL } from './stock-cdu-sanfer-url'

export const SUPERADMIN_PLATFORMS = [
  { id: 'bitacoraac', name: 'Bitácora AC', area: 'Cultura y Deporte', envKey: 'NEXT_PUBLIC_URL_BITACORA' },
  { id: 'bitacora_comunicaciones', name: 'Bitácora COM', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES' },
  { id: 'stock_cultura', name: 'Stock Cultura', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_INVENTARIO_CULTURA' },
  { id: 'horarios', name: 'Horarios Cultura', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_HORARIOS' },
  { id: 'asistencias_cultura', name: 'Asistencias', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_ASISTENCIAS' },
  { id: 'canal_comunicaciones', name: 'Canal Comunicaciones', area: 'Cultura y Deporte', envKey: 'NEXT_PUBLIC_URL_CANAL_COMUNICACIONES' },
  { id: 'stock_cdu', name: 'Stock CDU', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_INVENTARIO_DEPORTE' },
  { id: 'stock_cdu_sanfer', name: 'Stock CDU San Fernando', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_STOCK_CDU_SANFER' },
  { id: 'horarios_cdu', name: 'Horarios CDU', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_HORARIOS_CDU' },
  { id: 'gym_cdu', name: 'GymControl CDU', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_GYM_CDU' },
  { id: 'asistencias_deporte', name: 'Asistencias', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_ASISTENCIAS' },
  { id: 'prestamos_escenarios', name: 'Préstamos Escenarios', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_PRESTAMOS_ESCENARIOS' },
].map((p) => ({
  ...p,
  available: !!(
    {
      NEXT_PUBLIC_URL_BITACORA: process.env.NEXT_PUBLIC_URL_BITACORA,
      NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES: process.env.NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES,
      NEXT_PUBLIC_URL_INVENTARIO_CULTURA: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA,
      NEXT_PUBLIC_URL_HORARIOS: process.env.NEXT_PUBLIC_URL_HORARIOS,
      NEXT_PUBLIC_URL_HORARIOS_CDU: process.env.NEXT_PUBLIC_URL_HORARIOS_CDU,
      NEXT_PUBLIC_URL_GYM_CDU: process.env.NEXT_PUBLIC_URL_GYM_CDU,
      NEXT_PUBLIC_URL_INVENTARIO_DEPORTE: process.env.NEXT_PUBLIC_URL_INVENTARIO_DEPORTE,
      NEXT_PUBLIC_URL_STOCK_CDU_SANFER: STOCK_CDU_SANFER_BASE_URL,
      NEXT_PUBLIC_URL_ASISTENCIAS:
        process.env.NEXT_PUBLIC_URL_ASISTENCIAS || 'https://asistencia-cultura.vercel.app',
      NEXT_PUBLIC_URL_CANAL_COMUNICACIONES: process.env.NEXT_PUBLIC_URL_CANAL_COMUNICACIONES,
      NEXT_PUBLIC_URL_PRESTAMOS_ESCENARIOS: PRESTAMOS_ESCENARIOS_BASE_URL,
    } as Record<string, string | undefined>
  )[p.envKey],
  /** Superadmin UI: siempre mostrar en sidebar aunque falte env en build */
  visibleToSuperadmin: true,
}))

export const SUPERADMIN_PLATFORM_URLS: Record<string, string> = {
  bitacoraac: process.env.NEXT_PUBLIC_URL_BITACORA ?? '',
  bitacora_comunicaciones: process.env.NEXT_PUBLIC_URL_BITACORA_COMUNICACIONES ?? '',
  stock_cultura: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA ?? '',
  horarios: process.env.NEXT_PUBLIC_URL_HORARIOS ?? '',
  stock_cdu: process.env.NEXT_PUBLIC_URL_INVENTARIO_DEPORTE ?? '',
  stock_cdu_sanfer: STOCK_CDU_SANFER_BASE_URL,
  horarios_cdu: process.env.NEXT_PUBLIC_URL_HORARIOS_CDU ?? '',
  gym_cdu: process.env.NEXT_PUBLIC_URL_GYM_CDU ?? '',
  asistencias_cultura:
    process.env.NEXT_PUBLIC_URL_ASISTENCIAS || 'https://asistencia-cultura.vercel.app',
  asistencias_deporte:
    process.env.NEXT_PUBLIC_URL_ASISTENCIAS || 'https://asistencia-cultura.vercel.app',
  canal_comunicaciones: process.env.NEXT_PUBLIC_URL_CANAL_COMUNICACIONES ?? '',
  prestamos_escenarios: PRESTAMOS_ESCENARIOS_BASE_URL,
}

export const SUPERADMIN_SSO_REDIRECT: Record<string, string> = {
  bitacoraac: '/superadmin',
  bitacora_comunicaciones: '/superadmin',
  stock_cultura: '/',
  horarios: '/adofi',
  stock_cdu: '/',
  stock_cdu_sanfer: '/',
  horarios_cdu: '/adofi',
  gym_cdu: '/admin',
  asistencias_cultura: '/super-admin',
  asistencias_deporte: '/super-admin',
  // Canal ignora redirect y enruta por rol (superadmin/admin/manager)
  canal_comunicaciones: '/auth/sso',
  prestamos_escenarios: '/admin',
}
