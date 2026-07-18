'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { FadeIn } from '@/components/ui/animate'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList,
} from 'recharts'

interface Pagamento {
  id: number
  valor: number
  mesReferencia: string
  dataPagamento: string
}

interface Cliente {
  id: number
  nome: string
  valor: number
  ativo: boolean
  diaPagamento: number
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
    { label: 'Valor Total Contratado', value: formatCurrency(totalContratado), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Valor Médio Contratado', value: formatCurrency(medioContratado), icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Pagamentos Pendentes', value: String(pendentes.length), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100', hint: `Referente a ${refMesAtual}` },
  ]

  const formatDate = (iso?: string) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR')
  }

  const linhas = [...(clientes ?? [])]
    .sort((a: Cliente, b: Cliente) => (a?.nome ?? '').localeCompare(b?.nome ?? ''))
    .map((c: Cliente) => {
      const pagamentos = [...(c?.pagamentos ?? [])].sort(
        (a: Pagamento, b: Pagamento) =>
          new Date(b?.dataPagamento).getTime() - new Date(a?.dataPagamento).getTime()
      )
      const ultimo = pagamentos[0]
      const temDebito = !(c?.pagamentos ?? []).some(
        (p: Pagamento) => p?.mesReferencia === refMesAtual
      )
      return {
        id: c?.id,
        nome: c?.nome ?? '—',
        ativo: c?.ativo !== false,
        diaPagamento: c?.diaPagamento,
        temDebito,
        ultimoValor: ultimo?.valor,
        ultimaData: ultimo?.dataPagamento,
      }
    })

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
                <Bar dataKey="Esperado" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="Esperado"
                    position="top"
                    fontSize={10}
                    formatter={(v: number) => (v > 0 ? new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v) : '')}
                  />
                </Bar>
                <Bar dataKey="Realizado" fill="#10b981" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="Realizado"
                    position="top"
                    fontSize={10}
                    formatter={(v: number) => (v > 0 ? new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(v) : '')}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      {/* Tabela de clientes */}
      <FadeIn delay={0.3}>
        <div className="bg-card rounded-xl p-6 shadow-md border border-border/50 mt-8">
          <h2 className="font-display text-lg font-bold mb-1">Situação por Cliente</h2>
          <p className="text-sm text-muted-foreground mb-6">Status, débitos e histórico do último pagamento de cada cliente.</p>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Nome Cliente</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Dia de Pagamento</th>
                  <th className="py-3 pr-4 font-medium">Débitos</th>
                  <th className="py-3 pr-4 font-medium">Último Valor Pago</th>
                  <th className="py-3 pr-4 font-medium">Última Data de Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Carregando...</td></tr>
                ) : linhas.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Nenhum cliente cadastrado.</td></tr>
                ) : (
                  linhas.map((l: any) => (
                    <tr key={l.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 font-medium text-foreground">{l.nome}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${l.ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {l.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{l.diaPagamento ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${l.temDebito ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {l.temDebito ? 'Sim' : 'Não'}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{l.ultimoValor != null ? formatCurrency(l.ultimoValor) : '—'}</td>
                      <td className="py-3 pr-4">{formatDate(l.ultimaData)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
