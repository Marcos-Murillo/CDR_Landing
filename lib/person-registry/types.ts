export type PersonSystemId =
  | 'asistencias_cultura'
  | 'asistencias_deporte'
  | 'gym_cdu'
  | 'stock_cdu'
  | 'stock_cultura'
  | 'prestamos_escenarios'

export type PersonArea = 'cultura' | 'deporte' | 'ambas'

export interface PersonRegistryStats {
  systemsConnected: PersonSystemId[]
  systemsUnavailable: string[]
  personasCultura: number
  personasDeporte: number
  personasAmbasAreas: number
  generatedAt: string
  fromCache?: boolean
  fromPersistedSnapshot?: boolean
  staleSnapshot?: boolean
  cacheAgeMinutes?: number | null
}

export interface PersonLookupResult {
  found: boolean
  query: { type: 'documento' | 'codigo'; value: string }
  nombres: string[]
  areas: PersonArea[]
  sistemas: PersonSystemId[]
  cultura: PersonAreaDetail | null
  deporte: PersonAreaDetail | null
}

export interface PersonAreaDetail {
  asistencias: AsistenciasPersonBlock | null
  stock: StockPersonBlock | null
  prestamosEscenarios: PrestamosPersonBlock | null
  gym: GymPersonBlock | null
}

export interface AsistenciasPersonBlock {
  userIds: string[]
  nombres: string[]
  grupos: string[]
  totalAsistencias: number
  ultimaAsistencia: string | null
  categorias: { grupo: string; categoria: string }[]
}

export interface GymPersonBlock {
  userIds: string[]
  nombres: string[]
  totalVisitas: number
  ultimaVisita: string | null
  porInstalacion: Record<string, number>
}

export interface StockPersonBlock {
  totalPrestamos: number
  activos: number
  items: { nombre: string; fecha: string; estado: string }[]
}

export interface PrestamosPersonBlock {
  usuarioIds: string[]
  nombres: string[]
  totalReservas: number
  porEstado: Record<string, number>
  reservas: { cancha: string; fecha: string; estado: string }[]
}
