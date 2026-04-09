import Link from 'next/link'
import LogoIcon from '@/components/logo-icon'

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '48px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <LogoIcon size={32} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>CampusFlow</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Términos de servicio
        </h1>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '40px' }}>
          Última actualización: abril 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#aaa', fontSize: '14px', lineHeight: '1.7' }}>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>1. Uso del sistema</h2>
            <p>CampusFlow es una plataforma de gestión interna de la Universidad del Valle, destinada exclusivamente al personal autorizado de las áreas de Cultura, Recreación y Deporte (CRD). El acceso está restringido a usuarios con credenciales institucionales válidas.</p>
          </section>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>2. Responsabilidades del usuario</h2>
            <p>Cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta. No está permitido compartir credenciales ni acceder al sistema con fines distintos a los laborales.</p>
          </section>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>3. Datos e información</h2>
            <p>La información registrada en el sistema es propiedad de la Universidad del Valle. Los usuarios se comprometen a ingresar datos verídicos y a no divulgar información sensible fuera del contexto institucional.</p>
          </section>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>4. Modificaciones</h2>
            <p>La Universidad del Valle se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de los canales institucionales correspondientes.</p>
          </section>
        </div>

        <Link href="/login" style={{ display: 'inline-block', marginTop: '48px', color: '#888', fontSize: '13px', textDecoration: 'none' }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
