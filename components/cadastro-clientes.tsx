'use client'

import { useState } from 'react'
import { UserPlus, Plus, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { FadeIn } from '@/components/ui/animate'

export function CadastroClientes() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    periodicidade: '',
    valor: '',
    diaPagamento: '',
    rua: '',
    numero: '',
    complemento: '',
    pontoReferencia: '',
    observacoes: '',
  })

  const resetForm = () => {
    setForm({
      nome: '', periodicidade: '', valor: '', diaPagamento: '',
      rua: '', numero: '', complemento: '', pontoReferencia: '', observacoes: '',
    })
  }

  const handleSubmit = async () => {
    if (!form?.nome?.trim()) { toast.error('Nome é obrigatório'); return }
    if (!form?.periodicidade) { toast.error('Periodicidade é obrigatória'); return }
    if (!form?.valor || parseFloat(form?.valor) <= 0) { toast.error('Valor deve ser maior que zero'); return }
    if (!form?.diaPagamento) { toast.error('Dia de pagamento é obrigatório'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          valor: parseFloat(form?.valor ?? '0'),
          diaPagamento: parseInt(form?.diaPagamento ?? '1'),
        }),
      })
      if (!res?.ok) throw new Error('Erro ao salvar')
      toast.success('Cliente cadastrado com sucesso!')
      resetForm()
      setOpen(false)
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao cadastrar cliente')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [field]: value }))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:p-6 md:p-10">
      <FadeIn>
        <div className="mb-6 md:mb-8">
          <div className="mb-2 flex items-start gap-3 sm:items-center">
            <div className="shrink-0 rounded-lg bg-primary/10 p-2">
              <UserPlus size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">Cadastro de Clientes</h1>
          </div>
          <p className="text-sm text-muted-foreground sm:ml-14 sm:text-base">Registre novos clientes para o serviço de limpeza de piscinas.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full gap-2 shadow-md sm:w-auto">
              <Plus size={20} />
              Cadastrar Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display text-xl">
                <UserPlus size={22} className="text-primary" />
                Novo Cliente
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Cliente *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={form?.nome ?? ''}
                  onChange={(e: any) => updateField('nome', e?.target?.value ?? '')}
                />
              </div>

              {/* Periodicidade + Valor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Periodicidade *</Label>
                  <Select value={form?.periodicidade ?? ''} onValueChange={(v: string) => updateField('periodicidade', v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semanal">Semanal</SelectItem>
                      <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="Mensal">Mensal</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Negociado (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={form?.valor ?? ''}
                    onChange={(e: any) => updateField('valor', e?.target?.value ?? '')}
                  />
                </div>
              </div>

              {/* Dia de Pagamento */}
              <div className="space-y-2">
                <Label>Dia de Pagamento *</Label>
                <Select value={form?.diaPagamento ?? ''} onValueChange={(v: string) => updateField('diaPagamento', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o dia" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1)?.map((d: number) => (
                      <SelectItem key={d} value={String(d)}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Endereço */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Endereço</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="rua" className="text-xs">Rua</Label>
                    <Input id="rua" placeholder="Nome da rua" value={form?.rua ?? ''} onChange={(e: any) => updateField('rua', e?.target?.value ?? '')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero" className="text-xs">Número</Label>
                    <Input id="numero" placeholder="Nº" value={form?.numero ?? ''} onChange={(e: any) => updateField('numero', e?.target?.value ?? '')} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="complemento" className="text-xs">Complemento</Label>
                    <Input id="complemento" placeholder="Apto, bloco..." value={form?.complemento ?? ''} onChange={(e: any) => updateField('complemento', e?.target?.value ?? '')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pontoReferencia" className="text-xs">Ponto de Referência</Label>
                    <Input id="pontoReferencia" placeholder="Próximo a..." value={form?.pontoReferencia ?? ''} onChange={(e: any) => updateField('pontoReferencia', e?.target?.value ?? '')} />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="obs">Observações ({(form?.observacoes ?? '').length}/200)</Label>
                <Textarea
                  id="obs"
                  placeholder="Notas adicionais sobre o cliente..."
                  maxLength={200}
                  value={form?.observacoes ?? ''}
                  onChange={(e: any) => updateField('observacoes', e?.target?.value ?? '')}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => { resetForm(); setOpen(false) }} className="w-full gap-2 sm:w-auto">
                  <X size={16} /> Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2 sm:w-auto">
                  <Save size={16} /> {loading ? 'Salvando...' : 'Salvar Cliente'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </FadeIn>

      {/* Info cards */}
      <FadeIn delay={0.2}>
        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
          <div className="bg-card rounded-xl p-5 sm:p-6 shadow-md border border-border/50">
            <div className="bg-sky-100 text-sky-600 p-3 rounded-lg w-fit mb-3">
              <UserPlus size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Cadastro Rápido</h3>
            <p className="text-sm text-muted-foreground">Registre clientes com todos os dados necessários de forma simples e organizada.</p>
          </div>
          <div className="bg-card rounded-xl p-5 sm:p-6 shadow-md border border-border/50">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg w-fit mb-3">
              <Save size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Dados Seguros</h3>
            <p className="text-sm text-muted-foreground">Informações armazenadas com segurança no banco de dados da plataforma.</p>
          </div>
          <div className="bg-card rounded-xl p-5 sm:p-6 shadow-md border border-border/50">
            <div className="bg-amber-100 text-amber-600 p-3 rounded-lg w-fit mb-3">
              <Plus size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-1">Gestão Completa</h3>
            <p className="text-sm text-muted-foreground">Gerencie periodicidade, valores e endereços de todos os seus clientes.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
