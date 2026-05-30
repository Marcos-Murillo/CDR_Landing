/** URL base de Stock CDU San Fernando. Sin barra final. */
export const STOCK_CDU_SANFER_BASE_URL = (
  process.env.NEXT_PUBLIC_URL_STOCK_CDU_SANFER?.replace(/\/$/, '') ||
  'https://stock-cdu-sanfer-gimnasiouniversitario-3324s-projects.vercel.app'
)
