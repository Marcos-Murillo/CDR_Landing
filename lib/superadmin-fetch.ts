import { auth } from '@/lib/firebase'

const SUPERADMIN_ID = '1007260358'

export async function superadminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)

  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem('superadmin_auth') === 'true') {
      headers.set('X-Superadmin-Uid', SUPERADMIN_ID)
    }
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return fetch(input, { ...init, headers })
}
