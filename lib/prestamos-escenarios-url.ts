/** URL base de Préstamos Escenarios (Vercel). Sin barra final. */
export const PRESTAMOS_ESCENARIOS_BASE_URL = (
  process.env.NEXT_PUBLIC_URL_PRESTAMOS_ESCENARIOS?.replace(/\/$/, '') ||
  'https://prestamo-escenarios.vercel.app'
)
