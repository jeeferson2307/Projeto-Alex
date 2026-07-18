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
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg shadow-lg"
        aria-label="Menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-sky-600 to-blue-700 text-white flex flex-col transition-transform duration-300',
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
