'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hoocks/use-auth'
import DashboardSidebar from '@/components/dashboard-sidebar'
import styles from './dashboard.module.css'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/login'); return }
    if (user.role === 'monitor') { router.push('/monitor'); return }
    if (user.role === 'superadmin') { router.push('/superadmin'); return }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className={styles.page} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className={styles.skeletonKpiRow} style={{ width: '100%', maxWidth: 900, padding: '0 28px' }}>
          {[0, 1, 2, 3].map(i => <div key={i} className={`${styles.skeleton} ${styles.skeletonKpi}`} />)}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <DashboardSidebar user={user} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
