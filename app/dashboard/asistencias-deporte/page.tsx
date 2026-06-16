'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Alias: el dashboard deporte vive en /dashboard */
export default function AsistenciasDeporteRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return null
}
