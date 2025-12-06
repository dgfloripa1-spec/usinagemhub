import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { FormulaBlock } from '@/components/FormulaBlock';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { ResultsGrid } from '@/components/ResultCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer } from 'lucide-react';
import * as calc from '@/lib/calculations';
import { saveCalculation } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function TemposPage() {
  const { toast } = useToast();
  
  // Torneamento
  const [tornL, setTornL] = useState(100);
  const [tornF, setTornF] = useState(0.2);
  const [tornN, setTornN] = useState(1000);
  const [tornResults, setTornResults] = useState<any>(null);

  // Fresamento
  const [fresL, setFresL] = useState(200);
  const [fresFz, setFresFz] = useState(0.1);
  const [fresZ, setFresZ] = useState(4);
  const [fresN, setFresN] = useState(2000);
  const [fresAp, setFresAp] = useState(2);
  const [fresAe, setFresAe] = useState(10);
  const [fresResults, setFresResults] = useState<any>(null);

  // Furação
  const [furProf, setFurProf] = useState(30);
  const [furF, setFurF] = useState(0.15);
  const [furN, setFurN] = useState(1500);
  const [furResults, setFurResults] = useState<any>(null);

  const calcularTorneamento = () => {
    const Vf = calc.calcularAvancoPorMinuto(tornF, tornN);
    const tempo = calc.calcularTempoTorneamento(tornL, tornF, tornN);
    setTornResults({ Vf, tempo });
    saveCalculation({ type: 'torneamento', inputs: { L: tornL, f: tornF, n: tornN }, results: { Vf, tempo } });
    toast({ title: 'Cálculo salvo', description: 'Tempo de torneamento calculado com sucesso.' });
  };

  const calcularFresamento = () => {
    const Vf = calc.calcularVfFresamento(fresFz, fresZ, fresN);
    const tempo = calc.calcularTempoFresamento(fresL, Vf);
    const MRR = calc.calcularMRR(fresAp, fresAe, Vf);
    setFresResults({ Vf, tempo, MRR });
    saveCalculation({ type: 'fresamento', inputs: { L: fresL, fz: fresFz, z: fresZ, n: fresN }, results: { Vf, tempo, MRR } });
    toast({ title: 'Cálculo salvo', description: 'Tempo de fresamento calculado.' });
  };

  const calcularFuracao = () => {
    const Vf = calc.calcularAvancoPorMinuto(furF, furN);
    const tempo = calc.calcularTempoFuracao(furProf, furF, furN);
    setFurResults({ Vf, tempo });
    saveCalculation({ type: 'furacao', inputs: { prof: furProf, f: furF, n: furN }, results: { Vf, tempo } });
    toast({ title: 'Cálculo salvo', description: 'Tempo de furação calculado.' });
  };

  return (
    <Layout>
      <PageHeader
        title="Cálculo de Tempos de Corte"
        description="Calcule tempos de usinagem para torneamento, fresamento e furação."
        icon={Timer}
      />

      <TheorySection title="Fundamentação Teórica">
        <p>O tempo de corte é fundamental para o planejamento da produção. Ele depende do comprimento a ser usinado e da velocidade de avanço.</p>
        <p><strong>Avanço por minuto (Vf):</strong> É a velocidade com que a ferramenta avança na peça.</p>
        <ul>
          <li>Torneamento: Vf = f × n</li>
          <li>Fresamento: Vf = fz × z × n</li>
        </ul>
        <p><strong>Taxa de Remoção de Material (MRR):</strong> Volume de material removido por unidade de tempo.</p>
      </TheorySection>

      <Tabs defaultValue="torneamento" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="torneamento">Torneamento</TabsTrigger>
          <TabsTrigger value="fresamento">Fresamento</TabsTrigger>
          <TabsTrigger value="furacao">Furação</TabsTrigger>
        </TabsList>

        <TabsContent value="torneamento" className="mt-4 space-y-6">
          <FormulaBlock formula="t_c = \\frac{L}{f \\times n}" />
          <CalculatorCard title="Calculadora de Torneamento" onCalculate={calcularTorneamento}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumericInput id="tornL" label="Comprimento (L)" value={tornL} onChange={setTornL} unit="mm" tooltip="Comprimento total a ser usinado" />
              <NumericInput id="tornF" label="Avanço (f)" value={tornF} onChange={setTornF} unit="mm/rot" tooltip="Avanço por rotação" />
              <NumericInput id="tornN" label="Rotação (n)" value={tornN} onChange={setTornN} unit="rpm" tooltip="Rotação do fuso" />
            </div>
          </CalculatorCard>
          {tornResults && (
            <ResultsGrid results={[
              { label: 'Avanço por minuto (Vf)', value: tornResults.Vf, unit: 'mm/min' },
              { label: 'Tempo de corte', value: tornResults.tempo, unit: 'min', highlight: true },
            ]} />
          )}
        </TabsContent>

        <TabsContent value="fresamento" className="mt-4 space-y-6">
          <FormulaBlock formula="V_f = f_z \\times z \\times n \\quad ; \\quad MRR = a_p \\times a_e \\times V_f" />
          <CalculatorCard title="Calculadora de Fresamento" onCalculate={calcularFresamento}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumericInput id="fresL" label="Comprimento (L)" value={fresL} onChange={setFresL} unit="mm" />
              <NumericInput id="fresFz" label="Avanço por dente (fz)" value={fresFz} onChange={setFresFz} unit="mm" />
              <NumericInput id="fresZ" label="Número de dentes (z)" value={fresZ} onChange={setFresZ} unit="" />
              <NumericInput id="fresN" label="Rotação (n)" value={fresN} onChange={setFresN} unit="rpm" />
              <NumericInput id="fresAp" label="Prof. de corte (ap)" value={fresAp} onChange={setFresAp} unit="mm" />
              <NumericInput id="fresAe" label="Largura de corte (ae)" value={fresAe} onChange={setFresAe} unit="mm" />
            </div>
          </CalculatorCard>
          {fresResults && (
            <ResultsGrid results={[
              { label: 'Avanço por minuto (Vf)', value: fresResults.Vf, unit: 'mm/min' },
              { label: 'Tempo de corte', value: fresResults.tempo, unit: 'min', highlight: true },
              { label: 'MRR', value: fresResults.MRR, unit: 'mm³/min', success: true },
            ]} columns={3} />
          )}
        </TabsContent>

        <TabsContent value="furacao" className="mt-4 space-y-6">
          <FormulaBlock formula="t_c = \\frac{profundidade}{f \\times n}" />
          <CalculatorCard title="Calculadora de Furação" onCalculate={calcularFuracao}>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumericInput id="furProf" label="Profundidade" value={furProf} onChange={setFurProf} unit="mm" />
              <NumericInput id="furF" label="Avanço (f)" value={furF} onChange={setFurF} unit="mm/rot" />
              <NumericInput id="furN" label="Rotação (n)" value={furN} onChange={setFurN} unit="rpm" />
            </div>
          </CalculatorCard>
          {furResults && (
            <ResultsGrid results={[
              { label: 'Avanço por minuto', value: furResults.Vf, unit: 'mm/min' },
              { label: 'Tempo de furação', value: furResults.tempo, unit: 'min', highlight: true },
            ]} />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
