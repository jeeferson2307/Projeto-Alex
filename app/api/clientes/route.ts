export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' },
      include: { pagamentos: { orderBy: { dataPagamento: 'desc' } } },
    })
    return NextResponse.json(clientes ?? [])
  } catch (err: any) {
    console.error('GET /api/clientes error:', err)
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cliente = await prisma.cliente.create({
      data: {
        nome: body?.nome ?? '',
        periodicidade: body?.periodicidade ?? '',
        valor: body?.valor ?? 0,
        diaPagamento: body?.diaPagamento ?? 1,
        rua: body?.rua ?? '',
        numero: body?.numero ?? '',
        complemento: body?.complemento ?? '',
        pontoReferencia: body?.pontoReferencia ?? '',
        observacoes: body?.observacoes ?? '',
      },
    })
    return NextResponse.json(cliente, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/clientes error:', err)
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
