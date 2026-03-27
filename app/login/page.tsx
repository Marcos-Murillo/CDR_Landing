"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { UserRole } from '@/hoocks/use-auth'
import styles from './login.module.css'

const MODULES = [
  { name: 'Bitácora AC', area: 'Cultura' },
  { name: 'Bitácora COM', area: 'Cultura' },
  { name: 'Stock Cultura', area: 'Cultura' },
  { name: 'Horarios Cultura', area: 'Cultura' },
  { name: 'Asistencias', area: 'Multi-área' },
  { name: 'Stock CDU', area: 'Deporte' },
  { name: 'Horarios CDU', area: 'Deporte' },
  { name: 'GymControl CDU', area: 'Deporte' },
]

const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con este usuario.',
  'auth/wrong-password': 'La contraseña es incorrecta.',
  'auth/invalid-credential': 'Las credenciales proporcionadas no son válidas.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
  'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión.',
  'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
  'default': 'Ocurrió un error al iniciar sesión. Intenta nuevamente.',
}

// Superadmin credentials — stored locally, no Firebase Auth needed
const SUPERADMIN_ID = '1007260358'
const SUPERADMIN_PASS = 'romanos812'

function redirectByRole(role: UserRole, router: ReturnType<typeof useRouter>) {
  if (role === 'superadmin') router.push('/superadmin')
  else if (role === 'admin') router.push('/dashboard')
  else router.push('/monitor')
}

// ── Icons ──────────────────────────────────────────────────────────────────

function HexagonIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 10C2.5 10 5 4.5 10 4.5C15 4.5 17.5 10 17.5 10C17.5 10 15 15.5 10 15.5C5 15.5 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 3L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M8.5 4.8C9 4.6 9.5 4.5 10 4.5C15 4.5 17.5 10 17.5 10C17.1 10.7 16.6 11.4 16 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 6.5C3.8 8 2.5 10 2.5 10C2.5 10 5 15.5 10 15.5C11.5 15.5 12.8 15 14 14.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 8H4M4 8L7 5M4 8L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2"/>
      <path d="M10 2C14.4183 2 18 5.58172 18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

  const getErrorMessage = (code: string) =>
    ERROR_MESSAGES[code] || ERROR_MESSAGES['default']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }

    setIsLoading(true)

    try {
      // Superadmin local check
      if (identifier === SUPERADMIN_ID && password === SUPERADMIN_PASS) {
        router.push('/superadmin')
        return
      }

      // Firebase Auth
      const credential = await signInWithEmailAndPassword(auth, identifier, password)
      const snap = await getDoc(doc(db, 'users', credential.user.uid))

      if (!snap.exists()) {
        setError('Usuario no encontrado en el sistema.')
        return
      }

      const role = snap.data().role as UserRole
      redirectByRole(role, router)
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? 'default'
      setError(getErrorMessage(code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsGoogleLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const snap = await getDoc(doc(db, 'users', result.user.uid))

      if (!snap.exists()) {
        setError('Tu cuenta de Google no está registrada en el sistema.')
        return
      }

      const role = snap.data().role as UserRole
      redirectByRole(role, router)
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? 'default'
      setError(getErrorMessage(code))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.brandHeader}>
            <div className={styles.brandLogo}>
              <HexagonIcon />
              <div className={styles.brandText}>
                <span className={styles.brandName}>CRD Digital</span>
                <span className={styles.brandTag}>Universidad del Valle</span>
              </div>
            </div>
          </div>

          <div className={styles.brandMain}>
            <h1 className={styles.brandTitle}>
              Gestión digital para <em>Cultura, Recreación y Deporte</em>
            </h1>
            <p className={styles.brandDescription}>
              Accede a todas las herramientas del ecosistema CRD desde un solo lugar.
            </p>
          </div>

          <div className={styles.modulesGrid}>
            {MODULES.map((m) => (
              <div key={m.name} className={styles.moduleItem}>
                <span className={styles.moduleName}>{m.name}</span>
                <span className={styles.moduleArea}>{m.area}</span>
              </div>
            ))}
          </div>

          <div className={styles.leftFooter}>
            <span>© 2026 Sección CRD — Universidad del Valle</span>
          </div>
        </div>
        <div className={styles.decorativeCircles}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeftIcon />
            <span>Volver al inicio</span>
          </Link>

          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowLine}></span>
                <span>Acceso al portal</span>
              </div>
              <h2 className={styles.formTitle}>Bienvenido</h2>
              <p className={styles.formSubtitle}>
                Ingresa con tu correo institucional o usuario asignado
              </p>
            </div>

            {error && (
              <div className={styles.errorAlert}>
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="identifier" className={styles.label}>
                  Usuario o correo electrónico
                </label>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && passwordRef.current?.focus()}
                  placeholder="nombre@correounivalle.edu.co"
                  className={styles.input}
                  autoComplete="username"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Contraseña
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    autoComplete="current-password"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <span>Recordarme</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button type="submit" className={styles.submitButton} disabled={isLoading || isGoogleLoading}>
                {isLoading ? <><SpinnerIcon /><span>Ingresando...</span></> : <span>Ingresar al portal</span>}
              </button>
            </form>

            <div className={styles.divider}><span>o continúa con</span></div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={styles.googleButton}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? <><SpinnerIcon /><span>Conectando...</span></> : <><GoogleIcon /><span>Continuar con Google</span></>}
            </button>

            <p className={styles.legalText}>
              Al iniciar sesión, aceptas nuestros{' '}
              <Link href="/terms">Términos de servicio</Link> y{' '}
              <Link href="/privacy">Política de privacidad</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
