'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { FadeIn } from '@/components/ui/animate'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

interface Pagamento {
  id: number
  valor: number
  mesReferencia: string
}

interface Cliente {
  id: number
  nome: string
  valor: number
  ativo: boolean
  pagamentos: Pagamento[]
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function Relatorios() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClientes = useCallback(async () => {
    try {
      const res = await fetch('/api/clientes')
      const data = await res?.json()
      setClientes(data ?? [])
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao carregar dados dos relatórios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClientes() }, [fetchClientes])

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

  const ativos = (clientes ?? []).filter((c: Cliente) => c?.ativo !== false)
  const totalContratado = ativos.reduce((acc: number, c: Cliente) => acc + (c?.valor ?? 0), 0)
  const medioContratado = ativos.length > 0 ? totalContratado / ativos.length : 0

  const anoAtual = new Date().getFullYear()
  const mesAtualNome = MESES[new Date().getMonth()]
  const refMesAtual = `${mesAtualNome}/${anoAtual}`

  const pendentes = ativos.filter((c: Cliente) =>
    !(c?.pagamentos ?? []).some((p: Pagamento) => p?.mesReferencia === refMesAtual)
  )

  const chartData = MESES.map((mes: string, i: number) => {
    const ref = `${mes}/${anoAtual}`
    const realizado = (clientes ?? []).reduce((acc: number, c: Cliente) => {
      const doMes = (c?.pagamentos ?? []).filter((p: Pagamento) => p?.mesReferencia === ref)
      return acc + doMes.reduce((s: number, p: Pagamento) => s + (p?.valor ?? 0), 0)
    }, 0)
    return {
      mes: MESES_CURTOS[i],
      Esperado: Number(totalContratado.toFixed(2)),
      Realizado: Number(realizado.toFixed(2)),
    }
  })

  const cards = [
    { label: 'Clientes Ativos', value: String(ativos.length), icon: Users, color: 'text-sky-600', bg: 'bg-sky-100' },
    { label: 'Valor Total Contratado', value: formatCurrency(totalContratado), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Valor Médio Contratado', value: formatCurrency(medioContratado), icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Pagamentos Pendentes', value: String(pendentes.length), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100', hint: `Referente a ${refMesAtual}` },
  ]

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <FadeIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BarChart3 size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Relatórios</h1>
          </div>
          <p className="text-muted-foreground ml-14">Visão geral financeira e de clientes do seu negócio.</p>
        </div>
      </FadeIn>

      {/* Cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card: any) => (
            <div key={card.label} className="bg-card rounded-xl p-6 shadow-md border border-border/50">
              <div className={`${card.bg} ${card.color} p-3 rounded-lg w-fit mb-4`}>
                <card.icon size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
              <p className="text-2xl font-bold font-display text-foreground">
                {loading ? '...' : card.value}
              </p>
              {card.hint ? <p className="text-xs text-muted-foreground mt-1">{card.hint}</p> : null}
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Gráfico */}
      <FadeIn delay={0.2}>
        <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
          <h2 className="font-display text-lg font-bold mb-1">Faturamento Mensal — {anoAtual}</h2>
          <p className="text-sm text-muted-foreground mb-6">Comparativo entre o valor esperado (contratado) e o realizado (recebido).</p>
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v: number) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v)}
                />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
                <Legend />
                <Bar dataKey="Esperado" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Realizado" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
