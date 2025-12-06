import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { Waves } from 'lucide-react';
import * as calc from '@/lib/calculations';

export default function RugosidadePage() {
  const [f, setF] = useState(0.2);
  const [R, setR] = useState(0.8);
  const [results, setResults] = useState<any>(null);

  const calcular = () => {
    const Ra = calc.calcularRaTorneamento(f, R);
    const Rt = calc.calcularRtTorneamento(f, R);
    const altura = calc.calcularAlturaCrista(f, R);
    setResults({ Ra, Rt, altura });
  };

  return (
    <Layout>
      <PageHeader title="Rugosidade Superficial" description="Cálculo teórico de Ra e Rt para torneamento." icon={Waves} />

      <TheorySection title="Fundamentação Teórica">
        <p>A rugosidade teórica depende do avanço e do raio de ponta da ferramenta:</p>
        <ul>
          <li><strong>Ra (rugosidade média):</strong> Ra ≈ f² / (32R)</li>
          <li><strong>Rt (altura máxima):</strong> Rt ≈ f² / (8R)</li>
        </ul>
        <p>Valores menores de avanço e maiores raios de ponta resultam em melhor acabamento.</p>
      </TheorySection>

      <div className="mt-6 space-y-6">
        <FormulaBlock formula="R_a \\approx \\frac{f^2}{32R} \\quad ; \\quad R_t \\approx \\frac{f^2}{8R}" />

        <CalculatorCard title="Calcular Rugosidade" onCalculate={calcular}>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumericInput id="f" label="Avanço (f)" value={f} onChange={setF} unit="mm/rot" />
            <NumericInput id="R" label="Raio de ponta (R)" value={R} onChange={setR} unit="mm" tooltip="Raio de ponta da ferramenta" />
          </div>
        </CalculatorCard>

        {results && (
          <ResultsGrid
            columns={3}
            results={[
              { label: 'Ra teórico', value: results.Ra, unit: 'µm', highlight: true },
              { label: 'Rt teórico', value: results.Rt, unit: 'µm' },
              { label: 'Altura da crista', value: results.altura * 1000, unit: 'µm' },
            ]}
          />
        )}
      </div>
    </Layout>
  );
}
