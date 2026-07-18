export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const pagamento = await prisma.pagamento.create({
      data: {
        clienteId: body?.clienteId ?? 0,
        dataPagamento: new Date(body?.dataPagamento ?? new Date()),
        valor: body?.valor ?? 0,
        mesReferencia: body?.mesReferencia ?? '',
      },
    })
    return NextResponse.json(pagamento, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/pagamentos error:', err)
    return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 })
  }
}
