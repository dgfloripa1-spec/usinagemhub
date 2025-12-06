import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { Battery } from 'lucide-react';
import * as calc from '@/lib/calculations';

export default function PotenciaPage() {
  const [Fc, setFc] = useState(1000);
  const [Vc, setVc] = useState(200);
  const [rendimento, setRendimento] = useState(0.85);
  const [potenciaMaquina, setPotenciaMaquina] = useState(15);
  const [results, setResults] = useState<any>(null);

  const calcular = () => {
    const Pc = calc.calcularPotenciaCorte(Fc, Vc);
    const Peixo = calc.calcularPotenciaEixo(Pc, rendimento);
    const capacidade = calc.verificarCapacidadeMaquina(Peixo, potenciaMaquina);
    setResults({ Pc, Peixo, ...capacidade });
  };

  return (
    <Layout>
      <PageHeader title="Potência de Corte" description="Cálculo da potência mecânica e verificação de capacidade." icon={Battery} />

      <TheorySection title="Fundamentação Teórica">
        <p>A potência de corte é o produto da força de corte pela velocidade de corte:</p>
        <p><strong>Pc = (Fc × Vc) / 60000</strong> [kW]</p>
        <p>A potência no eixo considera o rendimento da máquina: <strong>Peixo = Pc / η</strong></p>
      </TheorySection>

      <div className="mt-6 space-y-6">
        <FormulaBlock formula="P_c = \\frac{F_c \\times V_c}{60000} \\quad ; \\quad P_{eixo} = \\frac{P_c}{\\eta}" />

        <CalculatorCard title="Calcular Potência" onCalculate={calcular}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NumericInput id="Fc" label="Força de corte (Fc)" value={Fc} onChange={setFc} unit="N" />
            <NumericInput id="Vc" label="Velocidade de corte (Vc)" value={Vc} onChange={setVc} unit="m/min" />
            <NumericInput id="rend" label="Rendimento (η)" value={rendimento} onChange={setRendimento} unit="" tooltip="Rendimento típico: 0.75-0.90" />
            <NumericInput id="pmaq" label="Potência da máquina" value={potenciaMaquina} onChange={setPotenciaMaquina} unit="kW" />
          </div>
        </CalculatorCard>

        {results && (
          <ResultsGrid
            columns={3}
            results={[
              { label: 'Potência de corte (Pc)', value: results.Pc, unit: 'kW' },
              { label: 'Potência no eixo', value: results.Peixo, unit: 'kW', highlight: true },
              { label: 'Utilização', value: results.percentual, unit: '%', warning: results.excede, success: !results.excede },
            ]}
          />
        )}
      </div>
    </Layout>
  );
}
