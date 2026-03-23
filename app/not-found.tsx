import Link from 'next/link'

function HexagonIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10L22 13.5V20.5L16 24L10 20.5V13.5L16 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 9H4M4 9L8 5M4 9L8 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#ffffff',
        textAlign: 'center',
      }}
    >
      <div style={{ color: '#c0111f', marginBottom: '32px' }}>
        <HexagonIcon />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <span
          style={{
            width: '20px',
            height: '2px',
            background: '#c0111f',
            display: 'block',
          }}
        ></span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#c0111f',
          }}
        >
          Error 404
        </span>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '48px',
          fontWeight: '700',
          color: '#1a0608',
          marginBottom: '12px',
          lineHeight: '1.2',
        }}
      >
        Página no encontrada
      </h1>

      <p
        style={{
          fontSize: '17px',
          color: '#7a5558',
          marginBottom: '32px',
          maxWidth: '400px',
          lineHeight: '1.6',
        }}
      >
        La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: '#c0111f',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: '500',
            textDecoration: 'none',
            borderRadius: '6px',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeftIcon />
          <span>Volver al inicio</span>
        </Link>

        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '14px 24px',
            background: 'transparent',
            color: '#1a0608',
            fontSize: '15px',
            fontWeight: '500',
            textDecoration: 'none',
            border: '1px solid rgba(192, 17, 31, 0.22)',
            borderRadius: '6px',
            transition: 'all 0.2s',
          }}
        >
          Ir al login
        </Link>
      </div>

      <p
        style={{
          marginTop: '64px',
          fontSize: '12px',
          color: '#7a5558',
        }}
      >
        RCD Digital — Universidad del Valle
      </p>
    </div>
  )
}
