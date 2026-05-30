import { NextRequest, NextResponse } from 'next/server'
import { assertSuperadminApi } from '@/lib/superadmin-api-auth'
import { lookupPerson } from '@/lib/person-registry/lookup-person'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const denied = await assertSuperadminApi(req)
  if (denied) return denied

  const type = req.nextUrl.searchParams.get('type')
  const value = req.nextUrl.searchParams.get('value')?.trim() ?? ''

  if (type !== 'documento' && type !== 'codigo') {
    return NextResponse.json(
      { error: 'Parámetro type debe ser documento o codigo.' },
      { status: 400 }
    )
  }
  if (!value) {
    return NextResponse.json({ error: 'Parámetro value requerido.' }, { status: 400 })
  }

  try {
    const result = await lookupPerson(type, value)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[person-registry/lookup]', msg)
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
