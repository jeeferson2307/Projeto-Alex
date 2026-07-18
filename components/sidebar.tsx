'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserPlus, Users, Calculator, Droplets, Menu, X, BarChart3, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Cadastro de Clientes', icon: UserPlus },
  { href: '/consulta', label: 'Consulta de Clientes', icon: Users },
  { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/calculadora', label: 'Calculadora de Alcalinidade', icon: Calculator },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (pathname === '/login') {
    return null
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-sky-700/30 bg-gradient-to-r from-sky-600 to-blue-700 px-4 text-white shadow-md md:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="rounded-lg bg-white/20 p-1.5">
            <Droplets size={24} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">Alex Piscinas</p>
            <p className="text-[11px] text-sky-100">Gestão de Piscinas</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg bg-white/15 p-2.5 transition-colors hover:bg-white/25"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-[100dvh] w-[min(82vw,18rem)] flex-col bg-gradient-to-b from-sky-600 to-blue-700 text-white shadow-2xl transition-transform duration-300 md:sticky md:z-40 md:h-screen md:w-64 md:shadow-none',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/20">
          <div className="bg-white/20 p-2 rounded-lg">
            <Droplets size={28} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight">Alex Piscinas</h1>
            <p className="text-xs text-sky-200">Gestão de Piscinas</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems?.map((item: any) => {
            const isActive = pathname === item?.href
            return (
              <Link
                key={item?.href}
                href={item?.href ?? '/'}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium',
                  isActive
                    ? 'bg-white/25 text-white shadow-md'
                    : 'text-sky-100 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon size={20} />
                {item?.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 space-y-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium text-sky-100 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={20} />
            Sair
          </button>
          <p className="text-xs text-sky-200 text-center">© 2026 Alex Piscinas</p>
        </div>
      </aside>
    </>
  )
}
