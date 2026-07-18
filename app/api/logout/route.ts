import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('pm_auth', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
