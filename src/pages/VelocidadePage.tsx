import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { Gauge } from 'lucide-react';
import * as calc from '@/lib/calculations';

export default function VelocidadePage() {
  const [diametro, setDiametro] = useState(50);
  const [rotacao, setRotacao] = useState(1000);
  const [velocidade, setVelocidade] = useState(157);
  const [results, setResults] = useState<any>(null);

  const calcularDeRotacao = () => {
    const Vc = calc.calcularVc(diametro, rotacao);
    const VcFt = calc.mMinParaFtMin(Vc);
    setResults({ Vc, VcFt, source: 'rotacao' });
  };

  const calcularDeVelocidade = () => {
    const n = calc.calcularRotacao(velocidade, diametro);
    const VcFt = calc.mMinParaFtMin(velocidade);
    setResults({ n, VcFt, source: 'velocidade' });
  };

  return (
    <Layout>
      <PageHeader title="Velocidade de Corte" description="Relação entre velocidade de corte e rotação do fuso." icon={Gauge} />
      
      <TheorySection title="Fundamentação Teórica">
        <p>A velocidade de corte (Vc) é a velocidade tangencial na superfície da peça ou ferramenta. É um dos parâmetros mais importantes na usinagem.</p>
        <p>A relação entre velocidade de corte e rotação depende do diâmetro da peça ou ferramenta.</p>
      </TheorySection>

      <div className="mt-6 space-y-6">
        <FormulaBlock formula="V_c = \\frac{\\pi \\times d \\times n}{1000} \\quad \\Leftrightarrow \\quad n = \\frac{V_c \\times 1000}{\\pi \\times d}" />

        <div className="grid gap-6 lg:grid-cols-2">
          <CalculatorCard title="Calcular Vc a partir de n" onCalculate={calcularDeRotacao}>
            <div className="grid gap-4">
              <NumericInput id="diam1" label="Diâmetro (d)" value={diametro} onChange={setDiametro} unit="mm" />
              <NumericInput id="rot1" label="Rotação (n)" value={rotacao} onChange={setRotacao} unit="rpm" />
            </div>
          </CalculatorCard>

          <CalculatorCard title="Calcular n a partir de Vc" onCalculate={calcularDeVelocidade}>
            <div className="grid gap-4">
              <NumericInput id="diam2" label="Diâmetro (d)" value={diametro} onChange={setDiametro} unit="mm" />
              <NumericInput id="vel1" label="Velocidade (Vc)" value={velocidade} onChange={setVelocidade} unit="m/min" />
            </div>
          </CalculatorCard>
        </div>

        {results && (
          <ResultsGrid
            results={
              results.source === 'rotacao'
                ? [
                    { label: 'Velocidade de Corte', value: results.Vc, unit: 'm/min', highlight: true },
                    { label: 'Velocidade de Corte', value: results.VcFt, unit: 'ft/min' },
                  ]
                : [
                    { label: 'Rotação', value: results.n, unit: 'rpm', highlight: true },
                    { label: 'Velocidade em ft/min', value: results.VcFt, unit: 'ft/min' },
                  ]
            }
          />
        )}
      </div>
    </Layout>
  );
}
