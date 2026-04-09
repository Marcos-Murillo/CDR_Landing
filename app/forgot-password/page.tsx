"use client"

import Link from 'next/link'
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import LogoIcon from '@/components/logo-icon'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Ingresa tu correo electrónico.'); return }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setSent(true)
    } catch {
      setError('No se pudo enviar el correo. Verifica que la dirección sea correcta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <LogoIcon size={32} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>CampusFlow</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          Recuperar contraseña
        </h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
          Te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {sent ? (
          <div style={{ background: '#0d2b1a', border: '1px solid #166534', borderRadius: '10px', padding: '20px', color: '#4ade80', fontSize: '14px', marginBottom: '24px' }}>
            Correo enviado. Revisa tu bandeja de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ background: '#1a0d0d', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '14px', color: '#f87171', fontSize: '14px' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#ccc', fontSize: '13px', fontWeight: 500 }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correounivalle.edu.co"
                disabled={loading}
                style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}

        <Link href="/login" style={{ display: 'block', textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '13px', textDecoration: 'none' }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
