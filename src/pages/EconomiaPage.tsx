import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { DollarSign } from 'lucide-react';
import * as calc from '@/lib/calculations';

export default function EconomiaPage() {
  const [C, setC] = useState(400);
  const [n, setN] = useState(0.2);
  const [Cm, setCm] = useState(2);
  const [Ct, setCt] = useState(50);
  const [tt, setTt] = useState(5);
  const [results, setResults] = useState<any>(null);

  const calcular = () => {
    const Vmc = calc.calcularVelocidadeMinimoCusto(C, n, Cm, Ct, tt);
    const Vmp = calc.calcularVelocidadeMaximaProducao(C, n, tt);
    setResults({ Vmc, Vmp });
  };

  return (
    <Layout>
      <PageHeader title="Condições Econômicas de Usinagem" description="Velocidades de mínimo custo e máxima produção." icon={DollarSign} />

      <TheorySection title="Fundamentação Teórica">
        <p>Existem duas velocidades ótimas importantes:</p>
        <ul>
          <li><strong>Velocidade de mínimo custo (Vmc):</strong> minimiza o custo por peça</li>
          <li><strong>Velocidade de máxima produção (Vmp):</strong> maximiza a quantidade produzida</li>
        </ul>
        <p>Geralmente Vmc &lt; Vmp, e a velocidade de operação deve estar entre elas.</p>
      </TheorySection>

      <div className="mt-6 space-y-6">
        <FormulaBlock formula="V_{mc} = \\frac{C}{\\left[\\frac{1-n}{n}\\left(\\frac{C_t}{C_m}+t_t\\right)\\right]^n}" />

        <CalculatorCard title="Calcular Velocidades Econômicas" onCalculate={calcular}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumericInput id="C" label="Constante C (Taylor)" value={C} onChange={setC} unit="" />
            <NumericInput id="n" label="Expoente n" value={n} onChange={setN} unit="" />
            <NumericInput id="Cm" label="Custo por minuto (Cm)" value={Cm} onChange={setCm} unit="R$/min" />
            <NumericInput id="Ct" label="Custo por ferramenta (Ct)" value={Ct} onChange={setCt} unit="R$" />
            <NumericInput id="tt" label="Tempo de troca (tt)" value={tt} onChange={setTt} unit="min" />
          </div>
        </CalculatorCard>

        {results && (
          <ResultsGrid
            results={[
              { label: 'Velocidade de mínimo custo', value: results.Vmc, unit: 'm/min', highlight: true },
              { label: 'Velocidade de máxima produção', value: results.Vmp, unit: 'm/min', success: true },
            ]}
          />
        )}
      </div>
    </Layout>
  );
}
