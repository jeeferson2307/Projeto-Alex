export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params?.id ?? '0')
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const pagamento = await prisma.pagamento.findUnique({
      where: { id },
      select: { comprovante: true, comprovanteNome: true },
    })

    if (!pagamento?.comprovante) {
      return NextResponse.json({ error: 'Comprovante não encontrado' }, { status: 404 })
    }

    const dataUrl = pagamento.comprovante
    const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl)
    if (!match) {
      return NextResponse.json({ error: 'Comprovante inválido' }, { status: 400 })
    }

    const mime = match[1] ?? 'application/octet-stream'
    const buffer = Buffer.from(match[2] ?? '', 'base64')
    const nome = pagamento.comprovanteNome ?? `comprovante-${id}`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(nome)}"`,
        'Content-Length': String(buffer.length),
      },
    })
  } catch (err: any) {
    console.error('GET /api/pagamentos/[id]/comprovante error:', err)
    return NextResponse.json({ error: 'Erro ao baixar comprovante' }, { status: 500 })
  }
}
