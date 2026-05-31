/** URL de producción de Stock CDU San Fernando (dominio canónico Vercel). */
export const STOCK_CDU_SANFER_PRODUCTION_URL = 'https://stock-cdu-sanfer.vercel.app'

/** URL base de Stock CDU San Fernando. Sin barra final. */
export const STOCK_CDU_SANFER_BASE_URL = (() => {
  const env = process.env.NEXT_PUBLIC_URL_STOCK_CDU_SANFER?.replace(/\/$/, '')
  if (!env) return STOCK_CDU_SANFER_PRODUCTION_URL
  // Override solo para desarrollo local
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(env)) return env
  return STOCK_CDU_SANFER_PRODUCTION_URL
})()
