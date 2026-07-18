import { NextResponse } from 'next/server'

const USUARIO = 'admin'
const SENHA = 'Alex'
const TRINTA_DIAS = 60 * 60 * 24 * 30

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const usuario = body?.usuario
  const senha = body?.senha

  if (usuario !== USUARIO || senha !== SENHA) {
    return NextResponse.json(
      { error: 'Usuário ou senha inválidos' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('pm_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TRINTA_DIAS,
  })
  return response
}
