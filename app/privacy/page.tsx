import Link from 'next/link'
import LogoIcon from '@/components/logo-icon'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '48px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <LogoIcon size={32} />
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>CampusFlow</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Política de privacidad
        </h1>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '40px' }}>
          Última actualización: abril 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#aaa', fontSize: '14px', lineHeight: '1.7' }}>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>1. Datos que recopilamos</h2>
            <p>CampusFlow recopila únicamente la información necesaria para el funcionamiento del sistema: correo electrónico institucional, nombre, rol asignado y registros de actividad dentro de la plataforma.</p>
          </section>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>2. Uso de los datos</h2>
            <p>Los datos recopilados se utilizan exclusivamente para la gestión interna de las áreas de CRD de la Universidad del Valle. No se comparten con terceros ni se utilizan con fines comerciales.</p>
          </section>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>3. Almacenamiento y seguridad</h2>
            <p>La información se almacena en Firebase (Google Cloud) con medidas de seguridad estándar de la industria. El acceso está restringido por roles y autenticación.</p>
          </section>
          <section>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '10px' }}>4. Derechos del usuario</h2>
            <p>Los usuarios pueden solicitar la revisión, corrección o eliminación de sus datos contactando al administrador del sistema a través de los canales institucionales de la Universidad del Valle.</p>
          </section>
        </div>

        <Link href="/login" style={{ display: 'inline-block', marginTop: '48px', color: '#888', fontSize: '13px', textDecoration: 'none' }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
