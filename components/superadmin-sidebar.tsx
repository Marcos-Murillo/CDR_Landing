"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import LogoIcon from '@/components/logo-icon'
import { GlowingButton } from '@/components/ui/glowing-button'
import { SUPERADMIN_NAV } from '@/lib/superadmin-nav'
import {
  SUPERADMIN_PLATFORMS,
  SUPERADMIN_PLATFORM_URLS,
  SUPERADMIN_SSO_REDIRECT,
} from '@/lib/superadmin-platforms'
import styles from '@/app/superadmin/superadmin.module.css'

function LogOutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 15.75H3.75C3.35 15.75 2.97 15.59 2.69 15.31C2.41 15.03 2.25 14.65 2.25 14.25V3.75C2.25 3.35 2.41 2.97 2.69 2.69C2.97 2.41 3.35 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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

function isNavActive(pathname: string, href: string, exact: boolean) {
  if (exact) {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SuperadminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    sessionStorage.removeItem('superadmin_auth')
    await signOut(auth)
    router.push('/login')
  }

  const handleOpenPlatform = async (platformId: string) => {
    const url = SUPERADMIN_PLATFORM_URLS[platformId]
    if (!url) return
    const uid = auth.currentUser?.uid ?? '1007260358'
    try {
      const res = await fetch('/api/auth/sso-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, platform: platformId }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        window.open(
          `${url}/auth/sso?token=${data.token}&redirect=${SUPERADMIN_SSO_REDIRECT[platformId] ?? '/'}`,
          '_blank'
        )
        return
      }
    } catch {
      /* fallback */
    }
    window.open(url, '_blank')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.sidebarLogo}>
          <LogoIcon size={40} />
          <div>
            <div className={styles.sidebarLogoName}>CampusFlow</div>
            <div className={styles.sidebarLogoTag}>Super Admin</div>
          </div>
        </Link>

        <div className={styles.sidebarDivider} />

        <span className={styles.sidebarSectionLabel}>Administración</span>
        {SUPERADMIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.sidebarNavItem} ${active ? styles.sidebarNavItemActive : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span className={styles.sidebarNavDot} />
              <span className={styles.sidebarNavName}>{item.label}</span>
            </Link>
          )
        })}

        <div className={styles.sidebarDivider} />

        <span className={styles.sidebarSectionLabel}>Plataformas</span>
        {['Cultura', 'Deporte', 'Transversal'].map((group) => {
          const items = SUPERADMIN_PLATFORMS.filter((p) => p.area === group && p.available)
          if (!items.length) return null
          return (
            <div key={group} className={styles.sidebarGroup}>
              <span className={styles.sidebarGroupLabel}>{group}</span>
              {items.map((p) => (
                <GlowingButton
                  key={p.id}
                  glowColor="#2563EB"
                  className={styles.sidebarNavItem}
                  onClick={() => handleOpenPlatform(p.id)}
                >
                  <span className={styles.sidebarNavDot} />
                  <span className={styles.sidebarNavName}>{p.name}</span>
                  <span className={styles.sidebarNavExt}>
                    <ExternalIcon />
                  </span>
                </GlowingButton>
              ))}
            </div>
          )
        })}
      </div>

      <div className={styles.sidebarBottom}>
        <div className={styles.sidebarUserChip}>
          <div className={styles.sidebarAvatar}>SA</div>
          <div className={styles.sidebarUserInfo}>
            <span className={styles.sidebarUserName}>Super Admin</span>
            <span className={styles.sidebarUserRole}>Acceso total</span>
          </div>
        </div>
        <button type="button" onClick={handleSignOut} className={styles.sidebarSignOut} aria-label="Salir">
          <LogOutIcon />
        </button>
      </div>
    </aside>
  )
}
