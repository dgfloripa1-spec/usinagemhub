import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid, ResultCard } from '@/components/ResultCard';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, FlaskConical } from 'lucide-react';
import * as calc from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';

export default function ForcaPage() {
  const { toast } = useToast();
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

  const calcular = () => {
    const kc = calc.calcularKc(kc1, h, m);
    const Fc = calc.calcularForcaCorte(kc, b, h);
    setResults({ kc, Fc });
  };

  const calcularCoeficientes = () => {
    try {
      const res = calc.calcularCoeficientesKienzle(expData);
      setExpResults(res);
      toast({ title: 'Sucesso', description: `Coeficientes calculados: kc1=${res.kc1.toFixed(0)}, m=${res.m.toFixed(3)}` });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <PageHeader title="Força de Corte — Equação de Kienzle" description="Cálculo da força de corte usando o modelo de Kienzle." icon={Zap} />

      <TheorySection title="Fundamentação Teórica">
        <p>A equação de Kienzle permite calcular a força de corte específica (kc) em função da espessura do cavaco (h):</p>
        <p><strong>kc = kc1 × h^(-m)</strong>, onde kc1 é a força específica para h=1mm e m é o expoente de Kienzle.</p>
        <p>A força de corte total é: <strong>Fc = kc × b × h</strong></p>
      </TheorySection>

      <Tabs defaultValue="calculadora" className="mt-6">
        <TabsList>
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
          <TabsTrigger value="experimental"><FlaskConical className="h-4 w-4 mr-2" />Ajuste Experimental</TabsTrigger>
        </TabsList>

        <TabsContent value="calculadora" className="space-y-6 mt-4">
          <FormulaBlock formula="F_c = k_{c1} \\times h^{1-m} \\times b" />
          <CalculatorCard title="Calcular Força de Corte" onCalculate={calcular}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumericInput id="h" label="Espessura do cavaco (h)" value={h} onChange={setH} unit="mm" tooltip="Espessura do cavaco indeformado" />
              <NumericInput id="b" label="Largura de corte (b)" value={b} onChange={setB} unit="mm" tooltip="Largura de usinagem" />
              <NumericInput id="kc1" label="kc1.1" value={kc1} onChange={setKc1} unit="N/mm²" tooltip="Força específica para h=1mm" />
              <NumericInput id="m" label="Expoente m" value={m} onChange={setM} unit="" tooltip="Expoente de Kienzle (0.2-0.4)" />
            </div>
          </CalculatorCard>
          {results && (
            <ResultsGrid results={[
              { label: 'Força específica (kc)', value: results.kc, unit: 'N/mm²' },
              { label: 'Força de corte (Fc)', value: results.Fc, unit: 'N', highlight: true },
            ]} />
          )}
        </TabsContent>

        <TabsContent value="experimental" className="space-y-6 mt-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Insira dados experimentais de força de corte para calcular os coeficientes kc1 e m. Mínimo de 3 pontos.</p>
          </div>
          <DataTable
            columns={[
              { key: 'h', label: 'Espessura h', unit: 'mm' },
              { key: 'Fc', label: 'Força Fc', unit: 'N' },
              { key: 'b', label: 'Largura b', unit: 'mm' },
            ]}
            data={expData}
            onChange={setExpData}
          />
          <Button onClick={calcularCoeficientes} className="w-full">Calcular Coeficientes</Button>
          {expResults && (
            <ResultsGrid
              columns={3}
              results={[
                { label: 'kc1.1', value: expResults.kc1, unit: 'N/mm²', highlight: true },
                { label: 'Expoente m', value: expResults.m, unit: '' },
                { label: 'R²', value: expResults.rSquared, unit: '', success: expResults.rSquared > 0.9 },
              ]}
            />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
