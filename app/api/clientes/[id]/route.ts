export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId ?? '0')
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    const body = await req.json()
    const cliente = await prisma.cliente.update({
      where: { id },
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
        ativo: typeof body?.ativo === 'boolean' ? body.ativo : true,
      },
    })
    return NextResponse.json(cliente)
  } catch (err: any) {
    console.error('PUT /api/clientes/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: rawId } = await params
    const id = parseInt(rawId ?? '0')
    if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    await prisma.cliente.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/clientes/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao excluir cliente' }, { status: 500 })
  }
}
