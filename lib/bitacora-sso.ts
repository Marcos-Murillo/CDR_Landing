import type { UserArea } from '@/lib/platform-access-config'

/** Ruta SSO hacia bitacoraac con el parámetro de área correcto. */
export function bitacoraRedirectPath(path: string, userArea: UserArea): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (userArea === 'deporte') return `${normalized}?area=deporte`
  if (userArea === 'cultura') return `${normalized}?area=cultura`
  return normalized
}

/** Añade ?area= a una URL pública de bitacoraac. */
export function bitacoraPublicUrl(baseUrl: string, area: 'cultura' | 'deporte'): string {
  if (!baseUrl || baseUrl === '/login' || baseUrl === '#') return baseUrl
  const sep = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${sep}area=${area}`
}
