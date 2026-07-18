'use client'

import { useState } from 'react'
import { Calculator, Droplets, FlaskConical, Info, Beaker, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/ui/animate'
import { toast } from 'sonner'

export function CalculadoraAlcalinidade() {
  const [volume, setVolume] = useState('')
  const [indicacao, setIndicacao] = useState('')
  const [ppmIdeal, setPpmIdeal] = useState('')
  const [resultado, setResultado] = useState<{
    gramas: number
    kg: number
    litros: number
  } | null>(null)

  const calcular = () => {
    const vol = parseFloat(volume ?? '0')
    const ind = parseFloat(indicacao ?? '0')
    const ppm = parseFloat(ppmIdeal ?? '0')

    if (!vol || vol <= 0) { toast.error('Volume da piscina deve ser maior que zero'); return }
    if (!ind || ind <= 0) { toast.error('Indicação do fabricante deve ser maior que zero'); return }
    if (!ppm || ppm < 80 || ppm > 120) { toast.error('PPM Ideal deve estar entre 80 e 120'); return }

    const litros = vol * 1000
    const gramas = (ppm / 10) * (litros / 1000) * ind
    const kg = gramas / 1000

    setResultado({ gramas, kg, litros })
  }

  const limpar = () => {
    setVolume('')
    setIndicacao('')
    setPpmIdeal('')
    setResultado(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:p-6 md:p-10">
      <FadeIn>
        <div className="mb-6 md:mb-8">
          <div className="mb-2 flex items-start gap-3 sm:items-center">
            <div className="shrink-0 rounded-lg bg-primary/10 p-2">
              <Calculator size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">Calculadora de Alcalinidade</h1>
          </div>
          <p className="text-sm text-muted-foreground sm:ml-14 sm:text-base">Calcule a quantidade de produto elevador de alcalinidade necessária para sua piscina.</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
        {/* Inputs */}
        <FadeIn delay={0.1}>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FlaskConical size={20} className="text-primary" />
                Dados da Piscina
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="volume" className="flex items-center gap-2">
                  <Droplets size={16} className="text-sky-500" />
                  Volume da Piscina (m³)
                </Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ex: 50"
                  value={volume}
                  onChange={(e: any) => setVolume(e?.target?.value ?? '')}
                />
                <p className="text-xs text-muted-foreground">1 m³ = 1.000 litros</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indicacao" className="flex items-center gap-2">
                  <Beaker size={16} className="text-sky-500" />
                  Indicação do Fabricante (g/1000L)
                </Label>
                <Input
                  id="indicacao"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Gramas para cada 1000 litros"
                  value={indicacao}
                  onChange={(e: any) => setIndicacao(e?.target?.value ?? '')}
                />
                <p className="text-xs text-muted-foreground">Confira a embalagem do produto</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ppm" className="flex items-center gap-2">
                  <Info size={16} className="text-sky-500" />
                  PPM Ideal (entre 80 e 120)
                </Label>
                <Input
                  id="ppm"
                  type="number"
                  min="80"
                  max="120"
                  placeholder="Ex: 100"
                  value={ppmIdeal}
                  onChange={(e: any) => {
                    const val = e?.target?.value ?? ''
                    setPpmIdeal(val)
                  }}
                />
                <p className="text-xs text-muted-foreground">Faixa ideal: 80 a 120 ppm</p>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={calcular} className="gap-2 flex-1">
                  <Calculator size={16} /> Calcular
                </Button>
                <Button variant="outline" onClick={limpar} className="gap-2">
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Results */}
        <FadeIn delay={0.2}>
          <div className="space-y-6">
            {resultado ? (
              <>
                <Card className="shadow-md bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-200 dark:border-sky-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-sky-700 dark:text-sky-300">
                      <ArrowRight size={20} />
                      Resultado do Cálculo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm text-center">
                        <p className="text-xs text-muted-foreground mb-1">Produto Necessário</p>
                        <p className="text-2xl font-bold font-mono text-primary">{resultado?.gramas?.toFixed?.(1) ?? '0'} g</p>
                      </div>
                      <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm text-center">
                        <p className="text-xs text-muted-foreground mb-1">Em Quilogramas</p>
                        <p className="text-2xl font-bold font-mono text-primary">{resultado?.kg?.toFixed?.(3) ?? '0'} kg</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm text-center">
                      <p className="text-xs text-muted-foreground mb-1">Volume Total da Piscina</p>
                      <p className="text-xl font-bold font-mono text-sky-600">{resultado?.litros?.toLocaleString?.('pt-BR') ?? '0'} litros</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="shadow-md border-dashed border-2">
                <CardContent className="py-12 text-center">
                  <Calculator size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground">Preencha os dados e clique em <strong>Calcular</strong> para ver o resultado.</p>
                </CardContent>
              </Card>
            )}

            {/* Tips */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info size={20} className="text-amber-500" />
                  Dicas de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                    A alcalinidade ideal da água da piscina deve estar entre <strong className="text-foreground">80 e 120 ppm</strong>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                    Alcalinidade baixa pode causar corrosão em equipamentos e irritação na pele.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                    Alcalinidade alta deixa a água turva e dificulta o ajuste do pH.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                    Sempre adicione o produto com a bomba ligada para garantir boa distribuição.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">5</span>
                    Teste a alcalinidade pelo menos uma vez por semana para manter a qualidade.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
