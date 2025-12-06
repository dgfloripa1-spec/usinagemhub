import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaDisplay, FormulaSteps, FormulaTable } from '@/components/FormulaDisplay';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { MaterialSelector } from '@/components/MaterialSelector';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Battery, Database, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import * as calc from '@/lib/calculations';
import { type MaterialData } from '@/lib/materialData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PotenciaPage() {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | undefined>();
  
  // Parâmetros de entrada
  const [Fc, setFc] = useState(1000);
  const [Vc, setVc] = useState(200);
  const [rendimento, setRendimento] = useState(0.85);
  const [potenciaMaquina, setPotenciaMaquina] = useState(15);
  
  // Cálculo via Kienzle
  const [h, setH] = useState(0.2);
  const [b, setB] = useState(2);
  const [kc1, setKc1] = useState(1800);
  const [m, setM] = useState(0.25);
  
  const [results, setResults] = useState<any>(null);
  const [calcMode, setCalcMode] = useState<'direto' | 'kienzle'>('direto');

  const handleMaterialSelect = (material: MaterialData) => {
    setSelectedMaterial(material);
    setKc1(material.kc1_1);
    setM(material.m);
    toast({
      title: 'Material selecionado',
      description: `${material.nome}: kc1.1=${material.kc1_1} N/mm²`,
    });
  };

  const calcularDireto = () => {
    const Pc = calc.calcularPotenciaCorte(Fc, Vc);
    const Peixo = calc.calcularPotenciaEixo(Pc, rendimento);
    const capacidade = calc.verificarCapacidadeMaquina(Peixo, potenciaMaquina);
    setCalcMode('direto');
    setResults({ Fc, Vc, Pc, Peixo, ...capacidade });
  };

  const calcularKienzle = () => {
    const kc = calc.calcularKc(kc1, h, m);
    const FcCalc = calc.calcularForcaCorte(kc, b, h);
    const Pc = calc.calcularPotenciaCorte(FcCalc, Vc);
    const Peixo = calc.calcularPotenciaEixo(Pc, rendimento);
    const capacidade = calc.verificarCapacidadeMaquina(Peixo, potenciaMaquina);
    setCalcMode('kienzle');
    setResults({ Fc: FcCalc, kc, Vc, Pc, Peixo, ...capacidade });
  };

  return (
    <Layout>
      <PageHeader 
        title="Potência de Corte" 
        description="Cálculo da potência mecânica necessária e verificação da capacidade da máquina." 
        icon={Battery} 
      />

      <TheorySection title="Fundamentação Teórica">
        <p className="mb-3">
          A <strong>potência de corte</strong> representa a energia por unidade de tempo necessária para remover material 
          durante o processo de usinagem. É calculada como o produto da força de corte pela velocidade de corte.
        </p>
        <p className="mb-3">
          A <strong>potência no eixo-árvore</strong> considera as perdas mecânicas do sistema de transmissão da máquina, 
          sendo obtida dividindo a potência de corte pelo rendimento (η) da máquina.
        </p>
        <p>
          É fundamental verificar se a potência calculada não excede a capacidade nominal da máquina-ferramenta para 
          garantir operação segura e estável.
        </p>
      </TheorySection>

      <Tabs defaultValue="direto" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="direto">Cálculo Direto</TabsTrigger>
          <TabsTrigger value="kienzle"><Database className="h-4 w-4 mr-2" />Via Kienzle</TabsTrigger>
          <TabsTrigger value="teoria"><BookOpen className="h-4 w-4 mr-2" />Fórmulas</TabsTrigger>
        </TabsList>

        {/* Cálculo Direto */}
        <TabsContent value="direto" className="space-y-6 mt-6">
          <FormulaDisplay
            formula="P_c = \\frac{F_c \\cdot V_c}{60000} \\quad \\text{[kW]}"
            title="Potência de Corte"
            description="Conversão de força e velocidade para potência em kilowatts"
            variant="primary"
            variables={[
              { symbol: 'P_c', name: 'Potência de corte', unit: 'kW' },
              { symbol: 'F_c', name: 'Força de corte', unit: 'N' },
              { symbol: 'V_c', name: 'Velocidade de corte', unit: 'm/min' },
            ]}
          />

          <CalculatorCard title="Calcular Potência (Entrada Direta)" onCalculate={calcularDireto}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumericInput 
                id="Fc" 
                label="Força de corte (Fc)" 
                value={Fc} 
                onChange={setFc} 
                unit="N" 
                tooltip="Força de corte principal medida ou calculada" 
              />
              <NumericInput 
                id="Vc" 
                label="Velocidade de corte (Vc)" 
                value={Vc} 
                onChange={setVc} 
                unit="m/min" 
                tooltip="Velocidade de corte no diâmetro de trabalho" 
              />
              <NumericInput 
                id="rend" 
                label="Rendimento (η)" 
                value={rendimento} 
                onChange={setRendimento} 
                unit="" 
                tooltip="Rendimento mecânico da máquina (0.75-0.90)" 
              />
              <NumericInput 
                id="pmaq" 
                label="Potência da máquina" 
                value={potenciaMaquina} 
                onChange={setPotenciaMaquina} 
                unit="kW" 
                tooltip="Potência nominal do motor da máquina-ferramenta" 
              />
            </div>
          </CalculatorCard>

          {results && calcMode === 'direto' && <ResultsDisplay results={results} potenciaMaquina={potenciaMaquina} />}
        </TabsContent>

        {/* Cálculo via Kienzle */}
        <TabsContent value="kienzle" className="space-y-6 mt-6">
          <FormulaDisplay
            formula="P_c = \\frac{k_{c1.1} \\cdot h^{1-m} \\cdot b \\cdot V_c}{60000}"
            title="Potência via Equação de Kienzle"
            description="Cálculo integrado de força e potência a partir dos parâmetros de corte"
            variant="primary"
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Material da Peça
                </h3>
                <MaterialSelector 
                  selectedMaterial={selectedMaterial}
                  onSelect={handleMaterialSelect}
                />
              </Card>
            </div>

            <div className="lg:col-span-2">
              <CalculatorCard title="Calcular Potência (Via Kienzle)" onCalculate={calcularKienzle}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <NumericInput id="h" label="Espessura h" value={h} onChange={setH} unit="mm" />
                  <NumericInput id="b" label="Largura b" value={b} onChange={setB} unit="mm" />
                  <NumericInput id="Vc2" label="Velocidade Vc" value={Vc} onChange={setVc} unit="m/min" />
                  <NumericInput id="kc1_2" label="kc1.1" value={kc1} onChange={setKc1} unit="N/mm²" />
                  <NumericInput id="m2" label="Expoente m" value={m} onChange={setM} unit="" />
                  <NumericInput id="rend2" label="Rendimento η" value={rendimento} onChange={setRendimento} unit="" />
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <NumericInput 
                    id="pmaq2" 
                    label="Potência nominal da máquina" 
                    value={potenciaMaquina} 
                    onChange={setPotenciaMaquina} 
                    unit="kW" 
                  />
                </div>
              </CalculatorCard>
            </div>
          </div>

          {results && calcMode === 'kienzle' && (
            <>
              <ResultsGrid 
                columns={2}
                results={[
                  { label: 'Força específica (kc)', value: results.kc, unit: 'N/mm²' },
                  { label: 'Força de corte (Fc)', value: results.Fc, unit: 'N' },
                ]} 
              />
              <ResultsDisplay results={results} potenciaMaquina={potenciaMaquina} />
            </>
          )}
        </TabsContent>

        {/* Teoria */}
        <TabsContent value="teoria" className="space-y-6 mt-6">
          <FormulaSteps
            title="Desenvolvimento do Cálculo de Potência"
            steps={[
              { label: 'Potência mecânica básica', formula: 'P = F \\cdot v' },
              { label: 'Substituindo com unidades de usinagem', formula: 'P_c = \\frac{F_c \\, [N] \\cdot V_c \\, [m/min]}{60 \\cdot 1000}' },
              { label: 'Potência de corte em kW', formula: 'P_c = \\frac{F_c \\cdot V_c}{60000} \\quad [kW]' },
              { label: 'Potência no eixo-árvore', formula: 'P_{eixo} = \\frac{P_c}{\\eta}' },
              { label: 'Verificação de capacidade', formula: 'P_{eixo} \\leq P_{máquina}' },
            ]}
          />

          <FormulaTable
            title="Fórmulas de Potência em Usinagem"
            formulas={[
              { name: 'Potência de corte', formula: 'P_c = \\frac{F_c \\cdot V_c}{60000}', description: 'kW' },
              { name: 'Potência no eixo', formula: 'P_{eixo} = \\frac{P_c}{\\eta}', description: 'Considera rendimento da transmissão' },
              { name: 'Potência via MRR', formula: 'P_c = \\frac{k_c \\cdot Q}{60000}', description: 'Q = taxa de remoção [mm³/min]' },
              { name: 'Taxa de remoção (MRR)', formula: 'Q = a_p \\cdot a_e \\cdot V_f', description: 'mm³/min' },
              { name: 'Energia específica', formula: 'e = \\frac{P_c}{Q}', description: 'kW·min/mm³' },
            ]}
          />

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-3">Valores Típicos de Rendimento</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                <p className="font-medium">Tornos Convencionais</p>
                <p className="text-2xl font-bold text-primary">η = 0.70-0.80</p>
              </div>
              <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                <p className="font-medium">Tornos CNC</p>
                <p className="text-2xl font-bold text-primary">η = 0.80-0.90</p>
              </div>
              <div className="bg-background/50 p-3 rounded-lg border border-border/50">
                <p className="font-medium">Centros de Usinagem</p>
                <p className="text-2xl font-bold text-primary">η = 0.85-0.95</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

// Componente para exibir resultados de potência
function ResultsDisplay({ results, potenciaMaquina }: { results: any; potenciaMaquina: number }) {
  const utilizacao = results.percentual;
  const excede = results.excede;

  return (
    <div className="space-y-4">
      <ResultsGrid
        columns={3}
        results={[
          { label: 'Potência de corte (Pc)', value: results.Pc, unit: 'kW' },
          { label: 'Potência no eixo', value: results.Peixo, unit: 'kW', highlight: true },
          { 
            label: 'Utilização da máquina', 
            value: results.percentual, 
            unit: '%', 
            warning: excede, 
            success: !excede && utilizacao > 50 
          },
        ]}
      />

      {/* Barra de utilização visual */}
      <Card className={cn(
        'p-4 border-2',
        excede ? 'border-destructive/50 bg-destructive/5' : 'border-success/30 bg-success/5'
      )}>
        <div className="flex items-center gap-3 mb-3">
          {excede ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
          <span className="font-semibold">
            {excede ? 'ATENÇÃO: Potência excede capacidade da máquina!' : 'Potência dentro da capacidade da máquina'}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Potência requerida: <strong>{results.Peixo.toFixed(2)} kW</strong></span>
            <span>Capacidade: <strong>{potenciaMaquina} kW</strong></span>
          </div>
          <Progress 
            value={Math.min(utilizacao, 100)} 
            className={cn(
              'h-3',
              excede ? '[&>div]:bg-destructive' : utilizacao > 80 ? '[&>div]:bg-warning' : '[&>div]:bg-success'
            )}
          />
          <p className="text-xs text-muted-foreground text-center">
            {utilizacao.toFixed(1)}% da capacidade nominal
          </p>
        </div>

        {excede && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg text-sm">
            <p className="font-medium text-destructive mb-1">Recomendações:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Reduza a velocidade de corte (Vc)</li>
              <li>Diminua a profundidade de corte (ap)</li>
              <li>Reduza o avanço por volta (f)</li>
              <li>Considere usar uma máquina de maior potência</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
