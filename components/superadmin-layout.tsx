"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SuperadminSidebar } from '@/components/superadmin-sidebar'
import styles from '@/app/superadmin/superadmin.module.css'

export function SuperadminLayout({
  title,
  eyebrow = 'Panel de control',
  children,
  headerAction,
  backHref,
  backLabel = '← Gestión de usuarios',
}: {
  title: string
  eyebrow?: string
  children: React.ReactNode
  headerAction?: React.ReactNode
  backHref?: string
  backLabel?: string
}) {
  const pathname = usePathname()
  const showBack = backHref ?? (pathname.startsWith('/superadmin/personas') ? '/superadmin' : undefined)

  return (
    <div className={styles.page}>
      <SuperadminSidebar />
      <div className={styles.content}>
        <header className={styles.topbar}>
          <div className={styles.topbarMain}>
            {showBack && (
              <Link href={showBack} className={styles.superadminBackLink}>
                {backLabel}
              </Link>
            )}
            <div>
              <div className={styles.topbarEyebrow}>
                <span className={styles.eyebrowLine} />
                <span>{eyebrow}</span>
              </div>
              <h1 className={styles.topbarTitle}>{title}</h1>
            </div>
          </div>
          {headerAction && <div className={styles.topbarActions}>{headerAction}</div>}
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
