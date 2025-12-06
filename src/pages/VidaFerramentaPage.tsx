import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FlaskConical } from 'lucide-react';
import * as calc from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';

export default function VidaFerramentaPage() {
  const { toast } = useToast();
  const [V, setV] = useState(200);
  const [C, setC] = useState(400);
  const [n, setN] = useState(0.2);
  const [results, setResults] = useState<any>(null);

  const [expData, setExpData] = useState([
    { V: 150, T: 60 },
    { V: 200, T: 20 },
    { V: 250, T: 8 },
  ]);
  const [expResults, setExpResults] = useState<any>(null);

  const calcularVida = () => {
    const T = calc.calcularVidaFerramenta(V, C, n);
    setResults({ T, mode: 'vida' });
  };

  const calcularCoeficientes = () => {
    try {
      const res = calc.calcularCoeficientesTaylor(expData);
      setExpResults(res);
      toast({ title: 'Sucesso', description: `C=${res.C.toFixed(1)}, n=${res.n.toFixed(3)}` });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <PageHeader title="Vida de Ferramenta — Equação de Taylor" description="Relação entre velocidade de corte e vida da ferramenta." icon={Clock} />

      <TheorySection title="Fundamentação Teórica">
        <p>A equação de Taylor relaciona a velocidade de corte com a vida da ferramenta:</p>
        <p><strong>V × T^n = C</strong></p>
        <p>Onde V é a velocidade de corte, T é a vida em minutos, n é o expoente de Taylor e C é uma constante.</p>
      </TheorySection>

      <Tabs defaultValue="calculadora" className="mt-6">
        <TabsList>
          <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
          <TabsTrigger value="experimental"><FlaskConical className="h-4 w-4 mr-2" />Ajuste Experimental</TabsTrigger>
        </TabsList>

        <TabsContent value="calculadora" className="space-y-6 mt-4">
          <FormulaBlock formula="V \\times T^n = C \\quad \\Rightarrow \\quad T = \\left(\\frac{C}{V}\\right)^{\\frac{1}{n}}" />
          <CalculatorCard title="Calcular Vida da Ferramenta" onCalculate={calcularVida}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumericInput id="V" label="Velocidade (V)" value={V} onChange={setV} unit="m/min" />
              <NumericInput id="C" label="Constante C" value={C} onChange={setC} unit="" />
              <NumericInput id="n" label="Expoente n" value={n} onChange={setN} unit="" tooltip="Típico: 0.1-0.3" />
            </div>
          </CalculatorCard>
          {results && (
            <ResultsGrid results={[{ label: 'Vida da Ferramenta (T)', value: results.T, unit: 'min', highlight: true }]} />
          )}
        </TabsContent>

        <TabsContent value="experimental" className="space-y-6 mt-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Insira pares de velocidade e vida medidos experimentalmente.</p>
          </div>
          <DataTable
            columns={[
              { key: 'V', label: 'Velocidade V', unit: 'm/min' },
              { key: 'T', label: 'Vida T', unit: 'min' },
            ]}
            data={expData}
            onChange={setExpData}
          />
          <Button onClick={calcularCoeficientes} className="w-full">Calcular Coeficientes</Button>
          {expResults && (
            <ResultsGrid
              columns={3}
              results={[
                { label: 'Constante C', value: expResults.C, unit: '', highlight: true },
                { label: 'Expoente n', value: expResults.n, unit: '' },
                { label: 'R²', value: expResults.rSquared, unit: '', success: expResults.rSquared > 0.9 },
              ]}
            />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
