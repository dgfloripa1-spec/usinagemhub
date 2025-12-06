import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { TheorySection } from '@/components/TheorySection';
import { NumericInput } from '@/components/NumericInput';
import { CalculatorCard } from '@/components/CalculatorCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle, XCircle } from 'lucide-react';
import * as calc from '@/lib/calculations';

export default function OtimizacaoPage() {
  const [params, setParams] = useState({
    VcMin: 100, VcMax: 300,
    fMin: 0.1, fMax: 0.4,
    apMin: 1, apMax: 4,
    potenciaMaxima: 10, forcaMaxima: 2000, rugosidadeMaxima: 3.2,
    raioFerramenta: 0.8, diametro: 50, kc1: 1800, m: 0.25,
  });
  const [results, setResults] = useState<any[]>([]);

  const otimizar = () => {
    const res = calc.otimizarParametros(params);
    setResults(res.slice(0, 20));
  };

  const updateParam = (key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <PageHeader title="Otimização de Parâmetros" description="Encontre a melhor combinação de parâmetros de usinagem." icon={Settings} />

      <TheorySection title="Fundamentação Teórica">
        <p>A otimização busca maximizar a taxa de remoção de material (MRR) respeitando restrições de potência, força e rugosidade.</p>
      </TheorySection>

      <div className="mt-6 space-y-6">
        <CalculatorCard title="Definir Restrições" onCalculate={otimizar}>
          <div className="space-y-4">
            <h4 className="font-medium">Faixas de Parâmetros</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <NumericInput id="VcMin" label="Vc mínima" value={params.VcMin} onChange={v => updateParam('VcMin', v)} unit="m/min" />
              <NumericInput id="VcMax" label="Vc máxima" value={params.VcMax} onChange={v => updateParam('VcMax', v)} unit="m/min" />
              <NumericInput id="fMin" label="Avanço mínimo" value={params.fMin} onChange={v => updateParam('fMin', v)} unit="mm/rot" />
              <NumericInput id="fMax" label="Avanço máximo" value={params.fMax} onChange={v => updateParam('fMax', v)} unit="mm/rot" />
              <NumericInput id="apMin" label="ap mínimo" value={params.apMin} onChange={v => updateParam('apMin', v)} unit="mm" />
              <NumericInput id="apMax" label="ap máximo" value={params.apMax} onChange={v => updateParam('apMax', v)} unit="mm" />
            </div>
            <h4 className="font-medium pt-4">Restrições</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumericInput id="potMax" label="Potência máxima" value={params.potenciaMaxima} onChange={v => updateParam('potenciaMaxima', v)} unit="kW" />
              <NumericInput id="forMax" label="Força máxima" value={params.forcaMaxima} onChange={v => updateParam('forcaMaxima', v)} unit="N" />
              <NumericInput id="rugMax" label="Ra máximo" value={params.rugosidadeMaxima} onChange={v => updateParam('rugosidadeMaxima', v)} unit="µm" />
            </div>
            <h4 className="font-medium pt-4">Parâmetros Fixos</h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <NumericInput id="diam" label="Diâmetro" value={params.diametro} onChange={v => updateParam('diametro', v)} unit="mm" />
              <NumericInput id="raio" label="Raio de ponta" value={params.raioFerramenta} onChange={v => updateParam('raioFerramenta', v)} unit="mm" />
              <NumericInput id="kc1o" label="kc1" value={params.kc1} onChange={v => updateParam('kc1', v)} unit="N/mm²" />
              <NumericInput id="mo" label="m" value={params.m} onChange={v => updateParam('m', v)} unit="" />
            </div>
          </div>
        </CalculatorCard>

        {results.length > 0 && (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Vc (m/min)</TableHead>
                  <TableHead>f (mm/rot)</TableHead>
                  <TableHead>ap (mm)</TableHead>
                  <TableHead>MRR (mm³/min)</TableHead>
                  <TableHead>Potência (kW)</TableHead>
                  <TableHead>Ra (µm)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={i} className={r.valido ? '' : 'opacity-50'}>
                    <TableCell>{r.Vc.toFixed(0)}</TableCell>
                    <TableCell>{r.f.toFixed(2)}</TableCell>
                    <TableCell>{r.ap.toFixed(1)}</TableCell>
                    <TableCell className="font-medium">{r.MRR.toFixed(0)}</TableCell>
                    <TableCell>{r.potencia.toFixed(2)}</TableCell>
                    <TableCell>{r.rugosidade.toFixed(2)}</TableCell>
                    <TableCell>
                      {r.valido ? (
                        <Badge variant="outline" className="text-success border-success"><CheckCircle className="h-3 w-3 mr-1" />OK</Badge>
                      ) : (
                        <Badge variant="outline" className="text-destructive border-destructive"><XCircle className="h-3 w-3 mr-1" />Excede</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
}
