'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Pencil, DollarSign, Search, X, Save, Plus, Trash2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { FadeIn } from '@/components/ui/animate'

interface Pagamento {
  id: number
  clienteId: number
  dataPagamento: string
  valor: number
  mesReferencia: string
}

interface Cliente {
  id: number
  nome: string
  periodicidade: string
  valor: number
  diaPagamento: number
  rua: string
  numero: string
  complemento: string
  pontoReferencia: string
  observacoes: string
  pagamentos: Pagamento[]
}

export function ConsultaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [pagOpen, setPagOpen] = useState(false)
  const [selected, setSelected] = useState<Cliente | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [pagForm, setPagForm] = useState({ dataPagamento: '', valor: '', mesReferencia: '' })
  const [savingPag, setSavingPag] = useState(false)

  const fetchClientes = useCallback(async () => {
    try {
      const res = await fetch('/api/clientes')
      const data = await res?.json()
      setClientes(data ?? [])
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClientes() }, [fetchClientes])

  const filtered = (clientes ?? [])?.filter((c: Cliente) =>
    c?.nome?.toLowerCase()?.includes(filtro?.toLowerCase() ?? '')
  )

  const openEdit = (c: Cliente) => {
    setSelected(c)
    setEditForm({
      nome: c?.nome ?? '',
      periodicidade: c?.periodicidade ?? '',
      valor: String(c?.valor ?? 0),
      diaPagamento: String(c?.diaPagamento ?? 1),
      rua: c?.rua ?? '',
      numero: c?.numero ?? '',
      complemento: c?.complemento ?? '',
      pontoReferencia: c?.pontoReferencia ?? '',
      observacoes: c?.observacoes ?? '',
    })
    setEditOpen(true)
  }

  const saveEdit = async () => {
    if (!selected?.id) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/clientes/${selected?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(editForm ?? {}),
          valor: parseFloat(editForm?.valor ?? '0'),
          diaPagamento: parseInt(editForm?.diaPagamento ?? '1'),
        }),
      })
      if (!res?.ok) throw new Error('Erro ao atualizar')
      toast.success('Cliente atualizado!')
      setEditOpen(false)
      fetchClientes()
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao atualizar')
    } finally {
      setSavingEdit(false)
    }
  }

  const openPagamentos = (c: Cliente) => {
    setSelected(c)
    setPagForm({ dataPagamento: '', valor: '', mesReferencia: '' })
    setPagOpen(true)
  }

  const savePagamento = async () => {
    if (!selected?.id) return
    if (!pagForm?.dataPagamento || !pagForm?.valor || !pagForm?.mesReferencia) {
      toast.error('Preencha todos os campos do pagamento')
      return
    }
    setSavingPag(true)
    try {
      const res = await fetch('/api/pagamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteId: selected?.id,
          dataPagamento: pagForm?.dataPagamento,
          valor: parseFloat(pagForm?.valor ?? '0'),
          mesReferencia: pagForm?.mesReferencia,
        }),
      })
      if (!res?.ok) throw new Error('Erro ao registrar pagamento')
      toast.success('Pagamento registrado!')
      setPagForm({ dataPagamento: '', valor: '', mesReferencia: '' })
      fetchClientes()
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao registrar pagamento')
    } finally {
      setSavingPag(false)
    }
  }

  const formatCurrency = (v: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    } catch { return d ?? '' }
  }

  const enderecoResumo = (c: Cliente) => {
    const parts = [c?.rua, c?.numero].filter(Boolean)
    return parts?.join(', ') || 'Não informado'
  }

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const mesAnoOptions = () => {
    const opts: string[] = []
    const now = new Date()
    for (let i = -6; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      opts.push(`${meses[d.getMonth()]}/${d.getFullYear()}`)
    }
    return opts
  }

  // Get selected client's pagamentos from latest clientes state
  const selectedPagamentos = selected
    ? (clientes?.find((c: Cliente) => c?.id === selected?.id)?.pagamentos ?? [])
    : []

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <FadeIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Consulta de Clientes</h1>
          </div>
          <p className="text-muted-foreground ml-14">Visualize, edite e gerencie os pagamentos dos seus clientes.</p>
        </div>
      </FadeIn>

      {/* Search */}
      <FadeIn delay={0.1}>
        <div className="relative mb-6 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={filtro}
            onChange={(e: any) => setFiltro(e?.target?.value ?? '')}
            className="pl-10"
          />
        </div>
      </FadeIn>

      {/* Table */}
      <FadeIn delay={0.15}>
        <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 font-semibold">Nome</th>
                  <th className="text-left p-4 font-semibold">Periodicidade</th>
                  <th className="text-left p-4 font-semibold">Valor</th>
                  <th className="text-left p-4 font-semibold">Dia Pgto</th>
                  <th className="text-left p-4 font-semibold">Endereço</th>
                  <th className="text-center p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Carregando...</td></tr>
                ) : (filtered?.length ?? 0) === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum cliente encontrado.</td></tr>
                ) : (
                  filtered?.map((c: Cliente) => (
                    <tr key={c?.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{c?.nome}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {c?.periodicidade}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{formatCurrency(c?.valor)}</td>
                      <td className="p-4 text-center">{c?.diaPagamento}</td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin size={14} />
                          {enderecoResumo(c)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(c)} className="gap-1">
                            <Pencil size={14} /> Editar
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => openPagamentos(c)} className="gap-1">
                            <DollarSign size={14} /> Pagamentos
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <Pencil size={20} className="text-primary" />
              Editar Cliente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Nome do Cliente *</Label>
              <Input value={editForm?.nome ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), nome: e?.target?.value ?? '' }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Periodicidade *</Label>
                <Select value={editForm?.periodicidade ?? ''} onValueChange={(v: string) => setEditForm((p: any) => ({ ...(p ?? {}), periodicidade: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input type="number" step="0.01" min="0" value={editForm?.valor ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), valor: e?.target?.value ?? '' }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dia de Pagamento *</Label>
              <Select value={editForm?.diaPagamento ?? ''} onValueChange={(v: string) => setEditForm((p: any) => ({ ...(p ?? {}), diaPagamento: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1)?.map((d: number) => (
                    <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Endereço</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs">Rua</Label>
                  <Input value={editForm?.rua ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), rua: e?.target?.value ?? '' }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Número</Label>
                  <Input value={editForm?.numero ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), numero: e?.target?.value ?? '' }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Complemento</Label>
                  <Input value={editForm?.complemento ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), complemento: e?.target?.value ?? '' }))} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ponto de Referência</Label>
                  <Input value={editForm?.pontoReferencia ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), pontoReferencia: e?.target?.value ?? '' }))} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações ({(editForm?.observacoes ?? '').length}/200)</Label>
              <Textarea maxLength={200} value={editForm?.observacoes ?? ''} onChange={(e: any) => setEditForm((p: any) => ({ ...(p ?? {}), observacoes: e?.target?.value ?? '' }))} rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} className="gap-2"><X size={16} /> Cancelar</Button>
              <Button onClick={saveEdit} disabled={savingEdit} className="gap-2"><Save size={16} /> {savingEdit ? 'Salvando...' : 'Salvar Alterações'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagamentos Modal */}
      <Dialog open={pagOpen} onOpenChange={setPagOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <DollarSign size={20} className="text-primary" />
              Pagamentos — {selected?.nome}
            </DialogTitle>
          </DialogHeader>

          {/* Novo pagamento */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3 mt-4">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Plus size={16} /> Lançar Novo Pagamento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Mês/Ano Referência</Label>
                <Select value={pagForm?.mesReferencia ?? ''} onValueChange={(v: string) => setPagForm((p: any) => ({ ...(p ?? {}), mesReferencia: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {mesAnoOptions()?.map((m: string) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Data do Pagamento</Label>
                <Input type="date" value={pagForm?.dataPagamento ?? ''} onChange={(e: any) => setPagForm((p: any) => ({ ...(p ?? {}), dataPagamento: e?.target?.value ?? '' }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Valor Pago (R$)</Label>
                <Input type="number" step="0.01" min="0" placeholder="0,00" value={pagForm?.valor ?? ''} onChange={(e: any) => setPagForm((p: any) => ({ ...(p ?? {}), valor: e?.target?.value ?? '' }))} />
              </div>
            </div>
            <Button size="sm" onClick={savePagamento} disabled={savingPag} className="gap-2">
              <Save size={14} /> {savingPag ? 'Salvando...' : 'Registrar Pagamento'}
            </Button>
          </div>

          {/* Histórico */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-3">Histórico de Pagamentos</h3>
            {(selectedPagamentos?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Nenhum pagamento registrado.</p>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-semibold">Mês/Ano</th>
                      <th className="text-left p-3 font-semibold">Data Pagamento</th>
                      <th className="text-left p-3 font-semibold">Valor Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPagamentos?.map((p: Pagamento) => (
                      <tr key={p?.id} className="border-t border-border/50">
                        <td className="p-3">{p?.mesReferencia}</td>
                        <td className="p-3">{formatDate(p?.dataPagamento)}</td>
                        <td className="p-3 font-mono text-emerald-600 font-medium">{formatCurrency(p?.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
