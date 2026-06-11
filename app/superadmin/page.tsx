"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SuperadminSidebar } from '@/components/superadmin-sidebar'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/hoocks/use-auth'
import {
  SUPERADMIN_PLATFORMS,
  SUPERADMIN_PLATFORM_URLS,
  SUPERADMIN_SSO_REDIRECT,
} from '@/lib/superadmin-platforms'
import {
  type CdrRole,
  type StaffSede,
  type UserArea,
  validatePlatformAccess,
  resolveProfileSede,
  PLATFORM_BY_ID,
} from '@/lib/platform-access-config'
import {
  UserAccessForm,
  emptyAccessFormValues,
  type UserAccessFormValues,
} from '@/components/superadmin/user-access-form'
import { GlowingButton } from '@/components/ui/glowing-button'
import styles from './superadmin.module.css'

const PLATFORMS = SUPERADMIN_PLATFORMS.map((p) => ({
  id: p.id,
  name: p.name,
  area: p.area,
}))

/** Plantilla rápida: admin deporte con acceso Gym + Stock San Fernando */
const SANFER_ADMIN_PLATFORMS = ['gym_cdu', 'stock_cdu_sanfer'] as const

interface CreatedUser {
  id: string
  email: string
  displayName: string
  role: CdrRole
  area: UserArea
  platforms: string[]
  platformRoles?: Record<string, string>
  platformConfig?: Record<string, Record<string, string>>
  cedula?: string
  sede?: string
  createdAt: string
}

// ── Icons ──────────────────────────────────────────────────────────────────
function HexIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function LogOutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function AlertIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 5.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="12" r="0.75" fill="currentColor"/>
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 4H14M5.33 4V2.67C5.33 2.3 5.63 2 6 2H10C10.37 2 10.67 2.3 10.67 2.67V4M12.67 4L12 13.33C12 13.7 11.7 14 11.33 14H4.67C4.3 14 4 13.7 4 13.33L3.33 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function DotsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="13" r="1.2" fill="currentColor"/>
    </svg>
  )
}
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
      <path d="M10.5 1.5L13.5 4.5L5 13H2V10L10.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M6 2H2V12H12V8M8 2H12V6M12 2L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [users, setUsers]               = useState<CreatedUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [showForm, setShowForm]         = useState(false)
  const [success, setSuccess]           = useState('')
  const [error, setError]               = useState('')
  // null = still checking, true = authorized, false = not authorized
  const [authorized, setAuthorized]     = useState<boolean | null>(null)

  const handleOpenPlatform = async (platformId: string) => {
    const url = SUPERADMIN_PLATFORM_URLS[platformId]
    if (!url) return
    const uid = auth.currentUser?.uid ?? '1007260358'
    try {
      const res  = await fetch('/api/auth/sso-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid, platform: platformId }) })
      const data = await res.json()
      if (res.ok && data.token) { window.open(`${url}/auth/sso?token=${data.token}&redirect=${SUPERADMIN_SSO_REDIRECT[platformId] ?? '/'}`, '_blank'); return }
    } catch { /* fallback */ }
    window.open(url, '_blank')
  }

  // Create form
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [access, setAccess] = useState<UserAccessFormValues>(emptyAccessFormValues())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit
  const [editingUser, setEditingUser]       = useState<CreatedUser | null>(null)
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editAccess, setEditAccess] = useState<UserAccessFormValues>(emptyAccessFormValues())
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [editError, setEditError]           = useState('')
  const [openDropdown, setOpenDropdown]     = useState<string | null>(null)

  useEffect(() => {
    if (loading) return
    const isSuperadminSession = sessionStorage.getItem('superadmin_auth') === 'true'
    const isAuthorized = isSuperadminSession || user?.role === 'superadmin'
    if (!isAuthorized) {
      router.push('/login')
      return
    }
    setAuthorized(true)
    fetchUsers()
  }, [user, loading, router])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res  = await fetch('/api/users/list')
      if (!res.ok) throw new Error()
      setUsers(await res.json())
    } catch { setError('Error al cargar usuarios.') }
    finally  { setLoadingUsers(false) }
  }

  const handleSignOut = async () => { sessionStorage.removeItem('superadmin_auth'); await signOut(auth); router.push('/login') }

  const resetForm = () => {
    setDisplayName('')
    setEmail('')
    setPassword('')
    setAccess(emptyAccessFormValues())
    setError('')
  }

  const applySanferAdminPreset = () => {
    setAccess({
      role: 'admin',
      area: 'deporte',
      platforms: [...SANFER_ADMIN_PLATFORMS],
      platformRoles: {},
      platformConfig: {
        gym_cdu: { sede: 'san_fernando', espacio: 'gimnasio' },
        stock_cdu_sanfer: { sede: 'san_fernando' },
      },
      cedula: '',
      sede: 'san_fernando',
    })
    setError('')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('')
    if (!displayName.trim() || !email.trim() || !password.trim()) { setError('Completa todos los campos.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    const validationError = validatePlatformAccess(access.role, access.area, access)
    if (validationError) { setError(validationError); return }
    const resolvedSede = resolveProfileSede(access.platforms, access.platformConfig, access.sede)
    setIsSubmitting(true)
    try {
      const res  = await fetch('/api/users/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), password, displayName: displayName.trim(), role: access.role, area: access.area, platforms: access.platforms, platformRoles: access.platformRoles, platformConfig: access.platformConfig, cedula: access.cedula.trim() || undefined, sede: resolvedSede || undefined }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al crear el usuario.'); return }
      setSuccess(`Usuario "${displayName}" creado correctamente.`)
      resetForm(); setShowForm(false); fetchUsers()
    } catch { setError('Error de conexión.') }
    finally  { setIsSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/users/delete', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: id }) })
      if (!res.ok) throw new Error()
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch { setError('Error al eliminar el usuario.') }
  }

  const openEdit = (u: CreatedUser) => {
    setEditingUser(u)
    setEditDisplayName(u.displayName)
    setEditAccess({
      role: u.role,
      area: u.area,
      platforms: u.platforms,
      platformRoles: u.platformRoles ?? {},
      platformConfig: u.platformConfig ?? {},
      cedula: u.cedula ?? '',
      sede: (u.sede as StaffSede) ?? '',
    })
    setEditError('')
    setOpenDropdown(null)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editingUser) return; setEditError('')
    const validationError = validatePlatformAccess(editAccess.role, editAccess.area, editAccess)
    if (validationError) { setEditError(validationError); return }
    const resolvedSede = resolveProfileSede(editAccess.platforms, editAccess.platformConfig, editAccess.sede)
    setIsEditSubmitting(true)
    try {
      const res  = await fetch('/api/users/update', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ uid: editingUser.id, displayName: editDisplayName.trim(), role: editAccess.role, area: editAccess.area, platforms: editAccess.platforms, platformRoles: editAccess.platformRoles, platformConfig: editAccess.platformConfig, cedula: editAccess.cedula.trim(), sede: resolvedSede || null }) })
      const data = await res.json()
      if (!res.ok) { setEditError(data.error ?? 'Error al actualizar.'); return }
      setSuccess(`Usuario "${editDisplayName}" actualizado.`); setEditingUser(null); fetchUsers()
    } catch { setEditError('Error de conexión.') }
    finally  { setIsEditSubmitting(false) }
  }

  const getRoleLabel  = (r: CdrRole) => r === 'admin' ? 'Administrador' : 'Monitor'
  const getAreaLabel  = (a: UserArea)    => ({ cultura: 'Cultura', deporte: 'Deporte', all: 'Multi-área' }[a])
  const getPlatNames  = (ids: string[])  => ids.map((id) => PLATFORMS.find((p) => p.id === id)?.name ?? PLATFORM_BY_ID[id as keyof typeof PLATFORM_BY_ID]?.name ?? id).join(', ')

  // ── Render ────────────────────────────────────────────────────────────────
  if (authorized !== true) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' }}>Cargando...</div>
  }

  return (
    <div className={styles.page}>

      <SuperadminSidebar />
      {/* ── CONTENT ── */}
      <div className={styles.content}>

        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <div className={styles.topbarEyebrow}>
              <span className={styles.eyebrowLine} />
              <span>Panel de control</span>
            </div>
            <h1 className={styles.topbarTitle}>Gestión de usuarios</h1>
          </div>
          <GlowingButton glowColor="#2563EB" className={styles.createButton} onClick={() => { setShowForm(true); setSuccess(''); setError('') }}>
            <PlusIcon />
            <span>Nuevo usuario</span>
          </GlowingButton>
        </header>

        {/* Main */}
        <main className={styles.main}>

          {success && (
            <div className={styles.successAlert}>
              <CheckIcon /><span>{success}</span>
            </div>
          )}

          {/* Users table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>Usuarios registrados</h2>
              <span className={styles.tableCount}>{users.length} usuarios</span>
            </div>
            {loadingUsers ? (
              <div className={styles.emptyState}>Cargando usuarios...</div>
            ) : users.length === 0 ? (
              <div className={styles.emptyState}>No hay usuarios creados aún.</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Correo</th><th>Rol</th><th>Área</th><th>Plataformas</th><th>Creado</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className={styles.tdUsername}>{u.displayName}</td>
                        <td className={styles.tdMuted}>{u.email}</td>
                        <td><span className={`${styles.roleBadge} ${styles[u.role]}`}>{getRoleLabel(u.role)}</span></td>
                        <td>{getAreaLabel(u.area)}</td>
                        <td className={styles.tdMuted}>{getPlatNames(u.platforms)}</td>
                        <td className={styles.tdMuted}>{u.createdAt}</td>
                        <td className={styles.tdActions}>
                          <div className={styles.dropdownWrapper}>
                            <button className={styles.dotsButton} onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)} aria-label="Opciones">
                              <DotsIcon />
                            </button>
                            {openDropdown === u.id && (
                              <div className={styles.dropdown}>
                                <button className={styles.dropdownItem} onClick={() => openEdit(u)}><EditIcon /><span>Editar</span></button>
                                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={() => { handleDelete(u.id); setOpenDropdown(null) }}><TrashIcon /><span>Eliminar</span></button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── DRAWER: Crear usuario ── */}
      {showForm && (
        <div className={styles.drawerBackdrop} onClick={() => { setShowForm(false); resetForm() }}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>Nuevo usuario</h2>
                <p className={styles.drawerSubtitle}>Completa los datos para crear la cuenta</p>
              </div>
              <button className={styles.drawerClose} onClick={() => { setShowForm(false); resetForm() }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            </div>

            {error && <div className={styles.errorAlert}><AlertIcon /><span>{error}</span></div>}

            <div className={styles.drawerPresetRow}>
              <button
                type="button"
                className={styles.presetButton}
                onClick={applySanferAdminPreset}
                disabled={isSubmitting}
              >
                Plantilla: Admin San Fernando (Gym + Stock)
              </button>
            </div>

            <form onSubmit={handleCreate} className={styles.drawerForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre completo</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="María Rodríguez" className={styles.input} disabled={isSubmitting} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Correo electrónico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correounivalle.edu.co" className={styles.input} disabled={isSubmitting} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña temporal</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className={styles.input} disabled={isSubmitting} />
              </div>
              <UserAccessForm
                values={access}
                onChange={(patch) => setAccess((prev) => ({ ...prev, ...patch }))}
                disabled={isSubmitting}
              />
              <div className={styles.drawerActions}>
                <button type="button" className={styles.cancelButton} onClick={() => { setShowForm(false); resetForm() }} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Editar usuario ── */}
      {editingUser && (
        <div className={styles.drawerBackdrop} onClick={() => setEditingUser(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>Editar usuario</h2>
                <p className={styles.drawerSubtitle}>{editingUser.email}</p>
              </div>
              <button className={styles.drawerClose} onClick={() => setEditingUser(null)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            </div>
            {editError && <div className={styles.errorAlert}><AlertIcon /><span>{editError}</span></div>}
            <form onSubmit={handleEdit} className={styles.drawerForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre completo</label>
                <input type="text" value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} className={styles.input} disabled={isEditSubmitting} />
              </div>
              <UserAccessForm
                values={editAccess}
                onChange={(patch) => setEditAccess((prev) => ({ ...prev, ...patch }))}
                disabled={isEditSubmitting}
              />
              <div className={styles.drawerActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingUser(null)} disabled={isEditSubmitting}>Cancelar</button>
                <button type="submit" className={styles.submitButton} disabled={isEditSubmitting}>{isEditSubmitting ? 'Guardando...' : 'Guardar cambios'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openDropdown && <div className={styles.overlay} onClick={() => setOpenDropdown(null)} />}
    </div>
  )
}
