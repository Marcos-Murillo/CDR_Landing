"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import styles from './superadmin.module.css'

const PLATFORMS = [
  { id: 'bitacoraac', name: 'Bitácora AC', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_BITACORA' },
  { id: 'inventario_cultura', name: 'Inventario', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_INVENTARIO_CULTURA' },
  { id: 'horarios', name: 'Horarios', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_HORARIOS' },
  { id: 'estadisticas', name: 'Estadísticas', area: 'Cultura', envKey: 'NEXT_PUBLIC_URL_ESTADISTICAS' },
  { id: 'cducontrol', name: 'CDUControl', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_CDU' },
  { id: 'inventario_deporte', name: 'Inventario', area: 'Deporte', envKey: 'NEXT_PUBLIC_URL_INVENTARIO_DEPORTE' },
  { id: 'multiarea', name: 'Multi-Área', area: 'Transversal', envKey: 'NEXT_PUBLIC_URL_MULTIAREA' },
].map((p) => ({
  ...p,
  available: !!({
    NEXT_PUBLIC_URL_BITACORA: process.env.NEXT_PUBLIC_URL_BITACORA,
    NEXT_PUBLIC_URL_INVENTARIO_CULTURA: process.env.NEXT_PUBLIC_URL_INVENTARIO_CULTURA,
    NEXT_PUBLIC_URL_HORARIOS: process.env.NEXT_PUBLIC_URL_HORARIOS,
    NEXT_PUBLIC_URL_ESTADISTICAS: process.env.NEXT_PUBLIC_URL_ESTADISTICAS,
    NEXT_PUBLIC_URL_CDU: process.env.NEXT_PUBLIC_URL_CDU,
    NEXT_PUBLIC_URL_INVENTARIO_DEPORTE: process.env.NEXT_PUBLIC_URL_INVENTARIO_DEPORTE,
    NEXT_PUBLIC_URL_MULTIAREA: process.env.NEXT_PUBLIC_URL_MULTIAREA,
  } as Record<string, string | undefined>)[p.envKey],
}))

type NewUserRole = 'admin' | 'monitor'
type UserArea = 'cultura' | 'deporte' | 'all'

interface CreatedUser {
  id: string
  email: string
  displayName: string
  role: NewUserRole
  area: UserArea
  platforms: string[]
  createdAt: string
}

// ── Icons ──────────────────────────────────────────────────────────────────

function HexagonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3.75V14.25M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 5.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="12" r="0.75" fill="currentColor"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4H14M5.33 4V2.67C5.33 2.3 5.63 2 6 2H10C10.37 2 10.67 2.3 10.67 2.67V4M12.67 4L12 13.33C12 13.7 11.7 14 11.33 14H4.67C4.3 14 4 13.7 4 13.33L3.33 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
      <circle cx="8" cy="13" r="1.2" fill="currentColor"/>
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10.5 1.5L13.5 4.5L5 13H2V10L10.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function SuperAdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<CreatedUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Create form state
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<NewUserRole>('monitor')
  const [area, setArea] = useState<UserArea>('cultura')
  const [platforms, setPlatforms] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit state
  const [editingUser, setEditingUser] = useState<CreatedUser | null>(null)
  const [editDisplayName, setEditDisplayName] = useState('')
  const [editRole, setEditRole] = useState<NewUserRole>('monitor')
  const [editArea, setEditArea] = useState<UserArea>('cultura')
  const [editPlatforms, setEditPlatforms] = useState<string[]>([])
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [editError, setEditError] = useState('')

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  // Load users from Firestore
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/users/list')
      if (!res.ok) throw new Error('Error al cargar usuarios.')
      const list = await res.json()
      setUsers(list as CreatedUser[])
    } catch {
      setError('Error al cargar usuarios.')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/login')
  }

  const resetForm = () => {
    setDisplayName('')
    setEmail('')
    setPassword('')
    setRole('monitor')
    setArea('cultura')
    setPlatforms([])
    setError('')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Completa todos los campos.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (platforms.length === 0) {
      setError('Selecciona al menos una plataforma.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
          role,
          area,
          platforms,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Error al crear el usuario. Intenta nuevamente.')
        return
      }

      setSuccess(`Usuario "${displayName}" creado correctamente como ${role === 'admin' ? 'Administrador' : 'Monitor'}.`)
      resetForm()
      setShowForm(false)
      fetchUsers()
    } catch {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: id }),
      })
      if (!res.ok) throw new Error()
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch {
      setError('Error al eliminar el usuario.')
    }
  }

  const openEdit = (u: CreatedUser) => {
    setEditingUser(u)
    setEditDisplayName(u.displayName)
    setEditRole(u.role)
    setEditArea(u.area)
    setEditPlatforms(u.platforms)
    setEditError('')
    setOpenDropdown(null)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setEditError('')
    setIsEditSubmitting(true)
    try {
      const res = await fetch('/api/users/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: editingUser.id,
          displayName: editDisplayName.trim(),
          role: editRole,
          area: editArea,
          platforms: editPlatforms,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setEditError(data.error ?? 'Error al actualizar.'); return }
      setSuccess(`Usuario "${editDisplayName}" actualizado correctamente.`)
      setEditingUser(null)
      fetchUsers()
    } catch {
      setEditError('Error de conexión.')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const getRoleLabel = (r: NewUserRole) => r === 'admin' ? 'Administrador' : 'Monitor'
  const getAreaLabel = (a: UserArea) => ({ cultura: 'Cultura', deporte: 'Deporte', all: 'Multi-área' }[a])
  const getPlatformName = (ids: string[]) =>
    ids.map((id) => PLATFORMS.find((p) => p.id === id)?.name ?? id).join(', ')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            <HexagonIcon />
            <div className={styles.logoText}>
              <span className={styles.logoName}>RCD Digital</span>
              <span className={styles.logoTag}>Super Admin</span>
            </div>
          </Link>
          <button onClick={handleSignOut} className={styles.signOutButton} aria-label="Cerrar sesión">
            <LogOutIcon />
            <span>Salir</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainContent}>

          <div className={styles.pageHeader}>
            <div>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine}></span>
                <span>Panel de control</span>
              </div>
              <h1 className={styles.pageTitle}>Gestión de usuarios</h1>
              <p className={styles.pageSubtitle}>Crea y administra administradores y monitores por plataforma.</p>
            </div>
            <button className={styles.createButton} onClick={() => { setShowForm(true); setSuccess(''); setError('') }}>
              <PlusIcon />
              <span>Nuevo usuario</span>
            </button>
          </div>

          {success && (
            <div className={styles.successAlert}>
              <CheckIcon />
              <span>{success}</span>
            </div>
          )}

          {showForm && (
            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h2 className={styles.formCardTitle}>Crear nuevo usuario</h2>
                <button className={styles.closeButton} onClick={() => { setShowForm(false); resetForm() }}>✕</button>
              </div>

              {error && (
                <div className={styles.errorAlert}>
                  <AlertIcon />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCreate} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre completo</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="María Rodríguez"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Correo electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@correounivalle.edu.co"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Contraseña temporal</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={styles.input}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Rol</label>
                    <select value={role} onChange={(e) => setRole(e.target.value as NewUserRole)} className={styles.select} disabled={isSubmitting}>
                      <option value="monitor">Monitor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Área</label>
                  <select value={area} onChange={(e) => setArea(e.target.value as UserArea)} className={styles.select} disabled={isSubmitting}>
                    <option value="cultura">Cultura</option>
                    <option value="deporte">Deporte</option>
                    <option value="all">Multi-área</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Plataformas vinculadas</label>
                  <div className={styles.platformGrid}>
                    {PLATFORMS.map((p) => {
                      const selected = platforms.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={!p.available || isSubmitting}
                          onClick={() => {
                            if (!p.available) return
                            setPlatforms((prev) =>
                              prev.includes(p.id)
                                ? prev.filter((x) => x !== p.id)
                                : [...prev, p.id]
                            )
                          }}
                          className={`${styles.platformOption} ${selected ? styles.platformSelected : ''} ${!p.available ? styles.platformDisabled : ''}`}
                        >
                          <span className={styles.platformName}>{p.name}</span>
                          <span className={styles.platformArea}>{p.area}</span>
                          {!p.available && <span className={styles.platformSoon}>Próximamente</span>}
                          {selected && p.available && (
                            <span className={styles.platformCheck}><CheckIcon /></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelButton} onClick={() => { setShowForm(false); resetForm() }} disabled={isSubmitting}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Creando...' : 'Crear usuario'}
                  </button>
                </div>
              </form>
            </div>
          )}

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
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Área</th>
                      <th>Plataforma</th>
                      <th>Creado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className={styles.tdUsername}>{u.displayName}</td>
                        <td className={styles.tdDate}>{u.email}</td>
                        <td>
                          <span className={`${styles.roleBadge} ${styles[u.role]}`}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td>{getAreaLabel(u.area)}</td>
                        <td>{getPlatformName(u.platforms)}</td>
                        <td className={styles.tdDate}>{u.createdAt}</td>
                        <td className={styles.tdActions}>
                          <div className={styles.dropdownWrapper}>
                            <button
                              className={styles.dotsButton}
                              onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)}
                              aria-label="Opciones"
                            >
                              <DotsIcon />
                            </button>
                            {openDropdown === u.id && (
                              <div className={styles.dropdown}>
                                <button className={styles.dropdownItem} onClick={() => openEdit(u)}>
                                  <EditIcon />
                                  <span>Editar</span>
                                </button>
                                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={() => { handleDelete(u.id); setOpenDropdown(null) }}>
                                  <TrashIcon />
                                  <span>Eliminar</span>
                                </button>
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

        </div>
      </main>

      {/* Click-outside overlay to close dropdown */}
      {openDropdown && (
        <div className={styles.overlay} onClick={() => setOpenDropdown(null)} />
      )}

      {/* Edit modal */}
      {editingUser && (
        <div className={styles.modalBackdrop} onClick={() => setEditingUser(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.formCardHeader}>
              <h2 className={styles.formCardTitle}>Editar usuario</h2>
              <button className={styles.closeButton} onClick={() => setEditingUser(null)}>✕</button>
            </div>

            {editError && (
              <div className={styles.errorAlert}>
                <AlertIcon />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEdit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre completo</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className={styles.input}
                  disabled={isEditSubmitting}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Rol</label>
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value as NewUserRole)} className={styles.select} disabled={isEditSubmitting}>
                    <option value="monitor">Monitor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Área</label>
                  <select value={editArea} onChange={(e) => setEditArea(e.target.value as UserArea)} className={styles.select} disabled={isEditSubmitting}>
                    <option value="cultura">Cultura</option>
                    <option value="deporte">Deporte</option>
                    <option value="all">Multi-área</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Plataformas vinculadas</label>
                <div className={styles.platformGrid}>
                  {PLATFORMS.map((p) => {
                    const selected = editPlatforms.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={!p.available || isEditSubmitting}
                        onClick={() => {
                          if (!p.available) return
                          setEditPlatforms((prev) =>
                            prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                          )
                        }}
                        className={`${styles.platformOption} ${selected ? styles.platformSelected : ''} ${!p.available ? styles.platformDisabled : ''}`}
                      >
                        <span className={styles.platformName}>{p.name}</span>
                        <span className={styles.platformArea}>{p.area}</span>
                        {!p.available && <span className={styles.platformSoon}>Próximamente</span>}
                        {selected && p.available && <span className={styles.platformCheck}><CheckIcon /></span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingUser(null)} disabled={isEditSubmitting}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton} disabled={isEditSubmitting}>
                  {isEditSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© 2024 Sección RCD — Universidad del Valle</span>
          <span className={styles.footerVersion}>v1.0.0</span>
        </div>
      </footer>
    </div>
  )
}
