import { NextRequest, NextResponse } from 'next/server'
import { assertSuperadminApi } from '@/lib/superadmin-api-auth'
import {
  buildPersonReportPdfBuffer,
  buildPersonReportPdfFileName,
} from '@/lib/person-registry/person-report-pdf-server'
import type { PersonLookupResult } from '@/lib/person-registry/types'

export async function POST(req: NextRequest) {
  const denied = await assertSuperadminApi(req)
  if (denied) return denied

  let result: PersonLookupResult
  try {
    result = (await req.json()) as PersonLookupResult
  } catch {
    return NextResponse.json({ error: 'Cuerpo JSON inválido.' }, { status: 400 })
  }

  if (!result?.found) {
    return NextResponse.json({ error: 'No hay datos de persona para exportar.' }, { status: 400 })
  }

  try {
    const buffer = buildPersonReportPdfBuffer(result)
    const fileName = buildPersonReportPdfFileName(result)

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[person-registry/report-pdf]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
