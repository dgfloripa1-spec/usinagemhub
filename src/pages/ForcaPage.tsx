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
import { Zap, FlaskConical, Database, BookOpen } from 'lucide-react';
import * as calc from '@/lib/calculations';
import { type MaterialData, fatoresCorrecao } from '@/lib/materialData';
import { useToast } from '@/hooks/use-toast';

export default function ForcaPage() {
  const { toast } = useToast();
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialData | undefined>();
  const [h, setH] = useState(0.2);
  const [b, setB] = useState(2);
  const [kc1, setKc1] = useState(1800);
  const [m, setM] = useState(0.25);
  const [results, setResults] = useState<any>(null);

  const [expData, setExpData] = useState([
    { h: 0.1, Fc: 500, b: 2 },
    { h: 0.2, Fc: 850, b: 2 },
    { h: 0.3, Fc: 1100, b: 2 },
  ]);
  const [expResults, setExpResults] = useState<any>(null);

  // Quando seleciona um material, atualiza os coeficientes
  const handleMaterialSelect = (material: MaterialData) => {
    setSelectedMaterial(material);
    setKc1(material.kc1_1);
    setM(material.m);
    toast({
      title: 'Material selecionado',
      description: `${material.nome}: kc1.1=${material.kc1_1} N/mm², m=${material.m}`,
    });
  };

  const calcular = () => {
    const kc = calc.calcularKc(kc1, h, m);
    const Fc = calc.calcularForcaCorte(kc, b, h);
    const Pc = calc.calcularPotenciaCorte(Fc, 200); // Estimativa com Vc=200
    setResults({ kc, Fc, Pc });
  };

  const calcularCoeficientes = () => {
    try {
      const res = calc.calcularCoeficientesKienzle(expData);
      setExpResults(res);
      toast({ 
        title: 'Coeficientes calculados', 
        description: `kc1.1 = ${res.kc1.toFixed(0)} N/mm², m = ${res.m.toFixed(3)}, R² = ${res.rSquared.toFixed(4)}` 
      });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Força de Corte — Equação de Kienzle" 
        description="Cálculo da força de corte usando o modelo empírico de Kienzle com banco de dados de materiais." 
        icon={Zap} 
      />

      <TheorySection title="Fundamentação Teórica">
        <p className="mb-3">
          A <strong>equação de Kienzle</strong> é um modelo empírico amplamente utilizado para calcular a força de corte 
          em processos de usinagem. O modelo considera que a força específica de corte (kc) varia com a espessura do cavaco (h) 
          segundo uma lei de potência.
        </p>
        <p className="mb-3">
          Os coeficientes <strong>kc1.1</strong> (força específica para h=1mm e b=1mm) e <strong>m</strong> (expoente de Kienzle) 
          são determinados experimentalmente e tabelados para diversos materiais.
        </p>
        <p>
          A força de corte principal (Fc) é obtida multiplicando a pressão específica pela área da seção transversal do cavaco.
        </p>
      </TheorySection>

      <Tabs defaultValue="calculadora" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
          <TabsTrigger value="materiais"><Database className="h-4 w-4 mr-2" />Materiais</TabsTrigger>
          <TabsTrigger value="experimental"><FlaskConical className="h-4 w-4 mr-2" />Experimental</TabsTrigger>
          <TabsTrigger value="teoria"><BookOpen className="h-4 w-4 mr-2" />Fórmulas</TabsTrigger>
        </TabsList>

        {/* Aba Calculadora */}
        <TabsContent value="calculadora" className="space-y-6 mt-6">
          <FormulaDisplay
            formula="F_c = k_{c1.1} \\cdot h^{1-m_c} \\cdot b"
            title="Equação de Kienzle para Força de Corte"
            description="Força de corte principal em função da geometria do cavaco"
            variant="primary"
            variables={[
              { symbol: 'F_c', name: 'Força de corte', unit: 'N' },
              { symbol: 'k_{c1.1}', name: 'Força específica de corte (h=b=1mm)', unit: 'N/mm²' },
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
              <CalculatorCard title="Calcular Força de Corte" onCalculate={calcular}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <NumericInput 
                    id="h" 
                    label="Espessura do cavaco (h)" 
                    value={h} 
                    onChange={setH} 
                    unit="mm" 
                    tooltip="Espessura do cavaco indeformado: h = f · sin(χr)" 
                  />
                  <NumericInput 
                    id="b" 
                    label="Largura de corte (b)" 
                    value={b} 
                    onChange={setB} 
                    unit="mm" 
                    tooltip="Largura de usinagem: b = ap / sin(χr)" 
                  />
                  <NumericInput 
                    id="kc1" 
                    label="kc1.1" 
                    value={kc1} 
                    onChange={setKc1} 
                    unit="N/mm²" 
                    tooltip="Força específica para h=1mm (do banco de dados ou experimental)" 
                  />
                  <NumericInput 
                    id="m" 
                    label="Expoente (1-mc)" 
                    value={m} 
                    onChange={setM} 
                    unit="" 
                    tooltip="Expoente de Kienzle, tipicamente entre 0.17 e 0.40" 
                  />
                </div>
              </CalculatorCard>
            </div>
          </div>

          {results && (
            <ResultsGrid 
              columns={3}
              results={[
                { label: 'Força específica (kc)', value: results.kc, unit: 'N/mm²', formula: 'k_{c1.1} \\cdot h^{-m}' },
                { label: 'Força de corte (Fc)', value: results.Fc, unit: 'N', highlight: true },
                { label: 'Potência estimada (Vc=200)', value: results.Pc, unit: 'kW' },
              ]} 
            />
          )}
        </TabsContent>

        {/* Aba Banco de Dados */}
        <TabsContent value="materiais" className="mt-6">
          <MaterialsTable onSelect={handleMaterialSelect} />
        </TabsContent>

        {/* Aba Experimental */}
        <TabsContent value="experimental" className="space-y-6 mt-6">
          <Card className="p-4 bg-muted/50 border-dashed">
            <p className="text-sm text-muted-foreground">
              <strong>Ajuste Experimental:</strong> Insira dados experimentais de força de corte para calcular os coeficientes 
              kc1.1 e m da equação de Kienzle. É necessário um mínimo de 3 pontos com diferentes espessuras de cavaco.
            </p>
          </Card>

          <FormulaDisplay
            formula="\\ln(k_c) = \\ln(k_{c1.1}) - m_c \\cdot \\ln(h)"
            title="Linearização para Regressão"
            description="Transformação log-log para ajuste linear"
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
                { label: 'Expoente m', value: expResults.m, unit: '' },
                { label: 'Coef. Determinação R²', value: expResults.rSquared, unit: '', success: expResults.rSquared > 0.95, warning: expResults.rSquared < 0.90 },
              ]}
            />
          )}
        </TabsContent>

        {/* Aba Teoria/Fórmulas */}
        <TabsContent value="teoria" className="space-y-6 mt-6">
          <FormulaSteps
            title="Desenvolvimento da Equação de Kienzle"
            steps={[
              { label: 'Força específica de corte em função de h', formula: 'k_c = k_{c1.1} \\cdot h^{-m_c}' },
              { label: 'Força de corte principal', formula: 'F_c = k_c \\cdot A = k_c \\cdot b \\cdot h' },
              { label: 'Substituindo kc na equação', formula: 'F_c = k_{c1.1} \\cdot h^{-m_c} \\cdot b \\cdot h' },
              { label: 'Simplificando os expoentes', formula: 'F_c = k_{c1.1} \\cdot h^{1-m_c} \\cdot b' },
            ]}
          />

          <FormulaTable
            title="Relações Geométricas do Cavaco"
            formulas={[
              { name: 'Espessura do cavaco', formula: 'h = f \\cdot \\sin(\\chi_r)', description: 'f = avanço, χr = ângulo de posição' },
              { name: 'Largura de corte', formula: 'b = \\frac{a_p}{\\sin(\\chi_r)}', description: 'ap = profundidade de corte' },
              { name: 'Área da seção do cavaco', formula: 'A = b \\cdot h = a_p \\cdot f', description: 'Área transversal do cavaco' },
              { name: 'Força de avanço', formula: 'F_f = F_c \\cdot \\tan(\\beta - \\gamma)', description: 'β = ângulo de atrito, γ = ângulo de saída' },
              { name: 'Força passiva', formula: 'F_p \\approx 0.3 \\cdot F_c', description: 'Estimativa para torneamento' },
            ]}
          />

          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="font-semibold mb-3">Fatores de Correção</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground mb-2">Ângulo de Saída (γ)</p>
                <div className="space-y-1">
                  {fatoresCorrecao.anguloDeSaida.map(f => (
                    <div key={f.valor} className="flex justify-between">
                      <span>γ = {f.valor}°</span>
                      <span className="font-mono">× {f.fator.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-muted-foreground mb-2">Fluido de Corte</p>
                <div className="space-y-1">
                  {fatoresCorrecao.fluido.map(f => (
                    <div key={f.tipo} className="flex justify-between">
                      <span>{f.tipo}</span>
                      <span className="font-mono">× {f.fator.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
