import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaDisplay, FormulaSteps, FormulaTable } from '@/components/FormulaDisplay';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { DataTable } from '@/components/DataTable';
import { MaterialSelector, MaterialsTable } from '@/components/MaterialSelector';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap, FlaskConical, Database, BookOpen, Settings2, Layers } from 'lucide-react';
import * as calc from '@/lib/calculations';
import { type MaterialData, fatoresCorrecao } from '@/lib/materialData';
import { useToast } from '@/hooks/use-toast';

export default function ForcaPage() {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | undefined>();
  
  // Parâmetros básicos
  const [h, setH] = useState(0.2);
  const [b, setB] = useState(2);
  const [kc1, setKc1] = useState(1800);
  const [m, setM] = useState(0.25);
  
  // Parâmetros de torneamento
  const [f, setF] = useState(0.25);
  const [ap, setAp] = useState(2);
  const [kr, setKr] = useState(90);
  
  // Fatores de correção
  const [gamma, setGamma] = useState(6);
  const [Vc, setVc] = useState(200);
  const [usarCorrecoes, setUsarCorrecoes] = useState(false);
  
  const [results, setResults] = useState<any>(null);
  const [calcMode, setCalcMode] = useState<'basico' | 'torneamento'>('basico');

  // Dados experimentais
  const [expData, setExpData] = useState([
    { h: 0.1, Fc: 500, b: 2 },
    { h: 0.2, Fc: 850, b: 2 },
    { h: 0.3, Fc: 1100, b: 2 },
  ]);
  const [expResults, setExpResults] = useState<any>(null);

  const handleMaterialSelect = (material: MaterialData) => {
    setSelectedMaterial(material);
    setKc1(material.kc1_1);
    setM(material.m);
    toast({
      title: 'Material selecionado',
      description: `${material.nome}: kc1.1=${material.kc1_1} N/mm², m=${material.m}`,
    });
  };

  const calcularBasico = () => {
    let kcCorrigido = kc1 * Math.pow(h, -m);
    
    // Aplicar correções se habilitado
    if (usarCorrecoes) {
      // Correção ângulo de saída
      const gammaCorr = fatoresCorrecao.anguloDeSaida.find(f => f.valor === gamma);
      if (gammaCorr) kcCorrigido *= gammaCorr.fator;
      
      // Correção velocidade
      let vcCorr = 1;
      if (Vc < 50) vcCorr = 1.10;
      else if (Vc < 100) vcCorr = 1.00;
      else if (Vc < 200) vcCorr = 0.95;
      else vcCorr = 0.90;
      kcCorrigido *= vcCorr;
    }
    
    const Fc = kcCorrigido * b * h;
    const Ff = Fc * 0.5; // Força de avanço estimada
    const Fp = Fc * 0.3; // Força passiva estimada
    const Fr = Math.sqrt(Fc * Fc + Ff * Ff + Fp * Fp); // Força resultante
    const Pc = calc.calcularPotenciaCorte(Fc, Vc);
    
    setCalcMode('basico');
    setResults({ kc: kcCorrigido, Fc, Ff, Fp, Fr, Pc, A: b * h });
  };

  const calcularTorneamento = () => {
    // Calcular h e b a partir de f, ap e kr
    const krRad = kr * Math.PI / 180;
    const hCalc = f * Math.sin(krRad);
    const bCalc = ap / Math.sin(krRad);
    const A = ap * f;
    
    let kcCorrigido = kc1 * Math.pow(hCalc, -m);
    
    if (usarCorrecoes) {
      const gammaCorr = fatoresCorrecao.anguloDeSaida.find(fc => fc.valor === gamma);
      if (gammaCorr) kcCorrigido *= gammaCorr.fator;
    }
    
    const Fc = kcCorrigido * A;
    const Ff = Fc * 0.4 * Math.tan(krRad); // Força de avanço
    const Fp = Fc * 0.3; // Força passiva
    const Fr = Math.sqrt(Fc * Fc + Ff * Ff + Fp * Fp);
    const Pc = calc.calcularPotenciaCorte(Fc, Vc);
    
    setCalcMode('torneamento');
    setResults({ kc: kcCorrigido, Fc, Ff, Fp, Fr, Pc, h: hCalc, b: bCalc, A });
  };

  const calcularCoeficientes = () => {
    try {
      const res = calc.calcularCoeficientesKienzle(expData);
      setExpResults(res);
      toast({ 
        title: 'Coeficientes calculados', 
        description: `kc1.1 = ${res.kc1.toFixed(0)} N/mm², m = ${res.m.toFixed(3)}` 
      });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Força de Corte" 
        description="Cálculo completo das forças de usinagem usando o modelo de Kienzle" 
        icon={Zap} 
      />

      <Tabs defaultValue="teoria" className="mt-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="teoria"><BookOpen className="h-4 w-4 mr-2" />Teoria</TabsTrigger>
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
          <TabsTrigger value="torneamento"><Settings2 className="h-4 w-4 mr-2" />Torneamento</TabsTrigger>
          <TabsTrigger value="materiais"><Database className="h-4 w-4 mr-2" />Materiais</TabsTrigger>
          <TabsTrigger value="experimental"><FlaskConical className="h-4 w-4 mr-2" />Experimental</TabsTrigger>
        </TabsList>

        {/* Aba Teoria Completa */}
        <TabsContent value="teoria" className="space-y-6 mt-6">
          <TheorySection title="Mecânica do Corte de Metais">
            <p className="mb-4">
              Durante o processo de usinagem, a ferramenta de corte penetra no material da peça, 
              causando deformação plástica e eventual separação do material na forma de cavaco. 
              Este processo gera forças que atuam sobre a ferramenta e a peça.
            </p>
            <p>
              As forças de usinagem são fundamentais para o dimensionamento de máquinas-ferramenta, 
              dispositivos de fixação, seleção de ferramentas e determinação dos parâmetros de corte ideais.
            </p>
          </TheorySection>

          <div className="grid md:grid-cols-2 gap-6">
            <FormulaDisplay
              formula="F_c = k_c \\cdot A = k_c \\cdot b \\cdot h"
              title="Força de Corte Principal"
              description="Componente tangencial à velocidade de corte"
              variant="primary"
              variables={[
                { symbol: 'F_c', name: 'Força de corte', unit: 'N' },
                { symbol: 'k_c', name: 'Pressão específica', unit: 'N/mm²' },
                { symbol: 'A', name: 'Área do cavaco', unit: 'mm²' },
              ]}
            />
            <FormulaDisplay
              formula="k_c = k_{c1.1} \\cdot h^{-m_c}"
              title="Pressão Específica de Corte (Kienzle)"
              description="Variação com a espessura do cavaco"
              variant="primary"
              variables={[
                { symbol: 'k_{c1.1}', name: 'Pressão para h=b=1mm', unit: 'N/mm²' },
                { symbol: 'm_c', name: 'Expoente de Kienzle' },
              ]}
            />
          </div>

          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Componentes da Força de Usinagem
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-primary mb-2">Força de Corte (Fc)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Componente principal, tangente à superfície de corte e na direção da velocidade de corte.
                  É a maior componente e a mais importante para o cálculo de potência.
                </p>
                <FormulaDisplay formula="F_c = k_c \\cdot b \\cdot h" variant="compact" />
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-primary mb-2">Força de Avanço (Ff)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Componente na direção do avanço da ferramenta. Importante para o dimensionamento 
                  do sistema de avanço da máquina.
                </p>
                <FormulaDisplay formula="F_f \\approx (0.3 \\sim 0.5) \\cdot F_c" variant="compact" />
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-primary mb-2">Força Passiva (Fp)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Componente perpendicular à superfície usinada. Importante para a rigidez da peça 
                  e precisão dimensional.
                </p>
                <FormulaDisplay formula="F_p \\approx (0.2 \\sim 0.4) \\cdot F_c" variant="compact" />
              </div>
            </div>
          </Card>

          <FormulaSteps
            title="Derivação Completa da Força de Corte"
            steps={[
              { label: 'Área da seção transversal do cavaco', formula: 'A = b \\cdot h = a_p \\cdot f' },
              { label: 'Espessura do cavaco em função do avanço', formula: 'h = f \\cdot \\sin(\\chi_r)' },
              { label: 'Largura de corte em função da profundidade', formula: 'b = \\frac{a_p}{\\sin(\\chi_r)}' },
              { label: 'Pressão específica de corte (Kienzle)', formula: 'k_c = k_{c1.1} \\cdot h^{-m_c}' },
              { label: 'Força de corte principal', formula: 'F_c = k_{c1.1} \\cdot h^{1-m_c} \\cdot b' },
              { label: 'Substituindo h e b', formula: 'F_c = k_{c1.1} \\cdot (f \\sin\\chi_r)^{1-m_c} \\cdot \\frac{a_p}{\\sin\\chi_r}' },
            ]}
          />

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="geometria">
              <AccordionTrigger className="text-lg font-semibold">
                Geometria do Cavaco
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-muted-foreground">
                  A geometria do cavaco é definida por dois parâmetros principais: a espessura (h) e a largura (b).
                  Estes são função dos parâmetros de corte (avanço f e profundidade ap) e da geometria da ferramenta 
                  (ângulo de posição χr).
                </p>
                <FormulaTable
                  title="Relações Geométricas"
                  formulas={[
                    { name: 'Espessura do cavaco', formula: 'h = f \\cdot \\sin(\\chi_r)', description: 'mm' },
                    { name: 'Largura de corte', formula: 'b = a_p / \\sin(\\chi_r)', description: 'mm' },
                    { name: 'Área do cavaco', formula: 'A = a_p \\cdot f = b \\cdot h', description: 'mm²' },
                    { name: 'Taxa de remoção', formula: 'Q = A \\cdot V_c = a_p \\cdot f \\cdot V_c', description: 'mm³/min' },
                  ]}
                />
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <h5 className="font-semibold mb-2">χr = 90° (Faceamento)</h5>
                    <p className="text-sm text-muted-foreground">h = f, b = ap</p>
                    <p className="text-sm">Condição mais comum em torneamento cilíndrico.</p>
                  </Card>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <h5 className="font-semibold mb-2">χr = 45°</h5>
                    <p className="text-sm text-muted-foreground">h = 0.707f, b = 1.414ap</p>
                    <p className="text-sm">Maior área de contato, distribui melhor o desgaste.</p>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="kienzle">
              <AccordionTrigger className="text-lg font-semibold">
                Modelo de Kienzle
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-muted-foreground">
                  O modelo de Kienzle é um modelo empírico que relaciona a força específica de corte (kc) 
                  com a espessura do cavaco (h) através de uma função de potência.
                </p>
                <FormulaDisplay
                  formula="k_c = k_{c1.1} \\cdot h^{-m_c}"
                  title="Equação Fundamental de Kienzle"
                  variant="highlight"
                  variables={[
                    { symbol: 'k_{c1.1}', name: 'Constante para h=1mm, b=1mm', unit: 'N/mm²' },
                    { symbol: 'm_c', name: 'Expoente (tipicamente 0.17-0.40)' },
                    { symbol: 'h', name: 'Espessura do cavaco', unit: 'mm' },
                  ]}
                />
                <Card className="p-4 bg-muted/50">
                  <h5 className="font-semibold mb-2">Significado do Expoente mc</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <strong>mc baixo (0.17-0.22)</strong>: Materiais duros (aços ligados, inox)</li>
                    <li>• <strong>mc médio (0.22-0.28)</strong>: Aços carbono, ferros fundidos</li>
                    <li>• <strong>mc alto (0.28-0.40)</strong>: Materiais macios (alumínio, cobre, plásticos)</li>
                  </ul>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fatores">
              <AccordionTrigger className="text-lg font-semibold">
                Fatores de Correção
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-muted-foreground">
                  O valor de kc tabelado considera condições de referência. Para condições diferentes, 
                  aplicam-se fatores de correção multiplicativos.
                </p>
                <FormulaDisplay
                  formula="k_c = k_{c1.1} \\cdot h^{-m_c} \\cdot K_\\gamma \\cdot K_v \\cdot K_{ver} \\cdot K_{lub}"
                  title="Pressão Específica Corrigida"
                  variant="highlight"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h5 className="font-semibold mb-3">Ângulo de Saída (Kγ)</h5>
                    <div className="space-y-2 text-sm">
                      {fatoresCorrecao.anguloDeSaida.map(f => (
                        <div key={f.valor} className="flex justify-between">
                          <span>γ = {f.valor}°</span>
                          <span className="font-mono font-semibold">Kγ = {f.fator.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Referência: γ = 6°
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-semibold mb-3">Velocidade de Corte (Kv)</h5>
                    <div className="space-y-2 text-sm">
                      {fatoresCorrecao.velocidadeDeCorte.map(f => (
                        <div key={f.faixa} className="flex justify-between">
                          <span>{f.faixa}</span>
                          <span className="font-mono font-semibold">Kv = {f.fator.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Referência: Vc = 100 m/min
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-semibold mb-3">Desgaste (Kver)</h5>
                    <div className="space-y-2 text-sm">
                      {fatoresCorrecao.desgaste.map(f => (
                        <div key={f.nivel} className="flex justify-between">
                          <span>{f.nivel}</span>
                          <span className="font-mono font-semibold">Kver = {f.fator.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h5 className="font-semibold mb-3">Fluido de Corte (Klub)</h5>
                    <div className="space-y-2 text-sm">
                      {fatoresCorrecao.fluido.map(f => (
                        <div key={f.tipo} className="flex justify-between">
                          <span>{f.tipo}</span>
                          <span className="font-mono font-semibold">Klub = {f.fator.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {/* Aba Calculadora Básica */}
        <TabsContent value="calculadora" className="space-y-6 mt-6">
          <FormulaDisplay
            formula="F_c = k_{c1.1} \\cdot h^{1-m_c} \\cdot b"
            title="Equação de Kienzle para Força de Corte"
            variant="primary"
            variables={[
              { symbol: 'F_c', name: 'Força de corte', unit: 'N' },
              { symbol: 'k_{c1.1}', name: 'Pressão específica (h=b=1mm)', unit: 'N/mm²' },
              { symbol: 'h', name: 'Espessura do cavaco', unit: 'mm' },
              { symbol: 'm_c', name: 'Expoente de Kienzle' },
              { symbol: 'b', name: 'Largura de corte', unit: 'mm' },
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Selecionar Material
                </h3>
                <MaterialSelector 
                  selectedMaterial={selectedMaterial}
                  onSelect={handleMaterialSelect}
                />
              </Card>
            </div>

            <div className="lg:col-span-2">
              <CalculatorCard title="Calcular Força de Corte" onCalculate={calcularBasico}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumericInput id="h" label="Espessura do cavaco (h)" value={h} onChange={setH} unit="mm" 
                    tooltip="h = f·sin(χr)" />
                  <NumericInput id="b" label="Largura de corte (b)" value={b} onChange={setB} unit="mm" 
                    tooltip="b = ap/sin(χr)" />
                  <NumericInput id="kc1" label="kc1.1" value={kc1} onChange={setKc1} unit="N/mm²" />
                  <NumericInput id="m" label="Expoente (1-mc)" value={m} onChange={setM} unit="" />
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <input 
                      type="checkbox" 
                      id="correcoes" 
                      checked={usarCorrecoes} 
                      onChange={(e) => setUsarCorrecoes(e.target.checked)}
                      className="rounded border-border"
                    />
                    <label htmlFor="correcoes" className="text-sm font-medium">Aplicar fatores de correção</label>
                  </div>
                  {usarCorrecoes && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumericInput id="gamma" label="Ângulo de saída (γ)" value={gamma} onChange={setGamma} unit="°" />
                      <NumericInput id="Vc" label="Velocidade de corte" value={Vc} onChange={setVc} unit="m/min" />
                    </div>
                  )}
                </div>
              </CalculatorCard>
            </div>
          </div>

          {results && calcMode === 'basico' && (
            <>
              <ResultsGrid 
                columns={3}
                results={[
                  { label: 'Área do cavaco (A)', value: results.A, unit: 'mm²' },
                  { label: 'Pressão específica (kc)', value: results.kc, unit: 'N/mm²' },
                  { label: 'Força de corte (Fc)', value: results.Fc, unit: 'N', highlight: true },
                ]} 
              />
              <ResultsGrid 
                columns={4}
                results={[
                  { label: 'Força de avanço (Ff)', value: results.Ff, unit: 'N' },
                  { label: 'Força passiva (Fp)', value: results.Fp, unit: 'N' },
                  { label: 'Força resultante (Fr)', value: results.Fr, unit: 'N' },
                  { label: 'Potência estimada', value: results.Pc, unit: 'kW' },
                ]} 
              />
            </>
          )}
        </TabsContent>

        {/* Aba Torneamento */}
        <TabsContent value="torneamento" className="space-y-6 mt-6">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2">Cálculo para Torneamento</h3>
            <p className="text-sm text-muted-foreground">
              Informe os parâmetros de corte do torneamento (f, ap, χr) e o sistema calcula automaticamente 
              h e b antes de aplicar a equação de Kienzle.
            </p>
          </Card>

          <FormulaSteps
            title="Sequência de Cálculo"
            steps={[
              { label: 'Espessura do cavaco', formula: 'h = f \\cdot \\sin(\\chi_r)' },
              { label: 'Largura de corte', formula: 'b = \\frac{a_p}{\\sin(\\chi_r)}' },
              { label: 'Pressão específica', formula: 'k_c = k_{c1.1} \\cdot h^{-m_c}' },
              { label: 'Força de corte', formula: 'F_c = k_c \\cdot a_p \\cdot f' },
            ]}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Material
                </h3>
                <MaterialSelector 
                  selectedMaterial={selectedMaterial}
                  onSelect={handleMaterialSelect}
                />
              </Card>
            </div>

            <div className="lg:col-span-2">
              <CalculatorCard title="Parâmetros de Torneamento" onCalculate={calcularTorneamento}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <NumericInput id="f2" label="Avanço (f)" value={f} onChange={setF} unit="mm/rot" />
                  <NumericInput id="ap2" label="Profundidade (ap)" value={ap} onChange={setAp} unit="mm" />
                  <NumericInput id="kr" label="Ângulo de posição (χr)" value={kr} onChange={setKr} unit="°" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3 mt-4">
                  <NumericInput id="kc1_2" label="kc1.1" value={kc1} onChange={setKc1} unit="N/mm²" />
                  <NumericInput id="m_2" label="Expoente m" value={m} onChange={setM} unit="" />
                  <NumericInput id="Vc_2" label="Velocidade Vc" value={Vc} onChange={setVc} unit="m/min" />
                </div>
              </CalculatorCard>
            </div>
          </div>

          {results && calcMode === 'torneamento' && (
            <>
              <Card className="p-4 bg-muted/30">
                <h4 className="font-semibold mb-3">Geometria do Cavaco Calculada</h4>
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Espessura (h)</p>
                    <p className="text-2xl font-bold text-primary">{results.h.toFixed(3)} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Largura (b)</p>
                    <p className="text-2xl font-bold text-primary">{results.b.toFixed(3)} mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Área (A)</p>
                    <p className="text-2xl font-bold text-primary">{results.A.toFixed(3)} mm²</p>
                  </div>
                </div>
              </Card>
              <ResultsGrid 
                columns={3}
                results={[
                  { label: 'Pressão específica (kc)', value: results.kc, unit: 'N/mm²' },
                  { label: 'Força de corte (Fc)', value: results.Fc, unit: 'N', highlight: true },
                  { label: 'Potência de corte', value: results.Pc, unit: 'kW' },
                ]} 
              />
              <ResultsGrid 
                columns={3}
                results={[
                  { label: 'Força de avanço (Ff)', value: results.Ff, unit: 'N' },
                  { label: 'Força passiva (Fp)', value: results.Fp, unit: 'N' },
                  { label: 'Força resultante (Fr)', value: results.Fr, unit: 'N' },
                ]} 
              />
            </>
          )}
        </TabsContent>

        {/* Aba Materiais */}
        <TabsContent value="materiais" className="mt-6">
          <MaterialsTable onSelect={handleMaterialSelect} />
        </TabsContent>

        {/* Aba Experimental */}
        <TabsContent value="experimental" className="space-y-6 mt-6">
          <TheorySection title="Determinação Experimental dos Coeficientes">
            <p>
              Os coeficientes kc1.1 e mc podem ser determinados experimentalmente através de ensaios de corte 
              com diferentes espessuras de cavaco. Os dados são linearizados em escala log-log e ajustados 
              por regressão linear.
            </p>
          </TheorySection>

          <FormulaDisplay
            formula="\\ln(k_c) = \\ln(k_{c1.1}) - m_c \\cdot \\ln(h)"
            title="Linearização para Regressão"
            description="Transformação log-log da equação de Kienzle"
            variant="highlight"
          />

          <DataTable
            columns={[
              { key: 'h', label: 'Espessura h', unit: 'mm' },
              { key: 'Fc', label: 'Força Fc', unit: 'N' },
              { key: 'b', label: 'Largura b', unit: 'mm' },
            ]}
            data={expData}
            onChange={setExpData}
          />
          
          <Button onClick={calcularCoeficientes} className="w-full" size="lg">
            <FlaskConical className="h-4 w-4 mr-2" />
            Calcular Coeficientes por Regressão
          </Button>
          
          {expResults && (
            <ResultsGrid
              columns={3}
              results={[
                { label: 'kc1.1 (calculado)', value: expResults.kc1, unit: 'N/mm²', highlight: true },
                { label: 'Expoente mc', value: expResults.m, unit: '' },
                { label: 'R²', value: expResults.rSquared, unit: '', success: expResults.rSquared > 0.95 },
              ]}
            />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
