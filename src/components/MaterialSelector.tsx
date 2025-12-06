import { useState, useMemo } from 'react';
import { materiaisDatabase, getGruposMateriais, type MaterialData } from '@/lib/materialData';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialSelectorProps {
  selectedMaterial?: MaterialData;
  onSelect: (material: MaterialData) => void;
  className?: string;
}

export function MaterialSelector({ selectedMaterial, onSelect, className }: MaterialSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const grupos = getGruposMateriais();

  const filteredMaterials = useMemo(() => {
    if (!searchTerm) return materiaisDatabase;
    const term = searchTerm.toLowerCase();
    return materiaisDatabase.filter(m => 
      m.nome.toLowerCase().includes(term) || 
      m.grupo.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const groupedMaterials = useMemo(() => {
    const grouped: Record<string, MaterialData[]> = {};
    filteredMaterials.forEach(m => {
      if (!grouped[m.grupo]) grouped[m.grupo] = [];
      grouped[m.grupo].push(m);
    });
    return grouped;
  }, [filteredMaterials]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select 
        value={selectedMaterial?.id} 
        onValueChange={(id) => {
          const material = materiaisDatabase.find(m => m.id === id);
          if (material) onSelect(material);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um material">
            {selectedMaterial && (
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                {selectedMaterial.nome}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {Object.entries(groupedMaterials).map(([grupo, materiais]) => (
            <SelectGroup key={grupo}>
              <SelectLabel className="text-xs font-semibold text-primary">{grupo}</SelectLabel>
              {materiais.map(m => (
                <SelectItem key={m.id} value={m.id} className="py-2">
                  <div className="flex items-center justify-between w-full gap-4">
                    <span>{m.nome}</span>
                    <span className="text-xs text-muted-foreground">
                      kc1.1={m.kc1_1}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {selectedMaterial && (
        <MaterialInfoCard material={selectedMaterial} />
      )}
    </div>
  );
}

function MaterialInfoCard({ material }: { material: MaterialData }) {
  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{material.nome}</h4>
          <p className="text-xs text-muted-foreground">{material.grupo}</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {material.id.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
          <p className="text-xs text-muted-foreground mb-0.5">kc1.1</p>
          <p className="font-semibold text-lg text-primary">{material.kc1_1}</p>
          <p className="text-xs text-muted-foreground">N/mm²</p>
        </div>
        <div className="bg-background/50 rounded-lg p-2.5 border border-border/50">
          <p className="text-xs text-muted-foreground mb-0.5">Expoente m</p>
          <p className="font-semibold text-lg text-primary">{material.m}</p>
          <p className="text-xs text-muted-foreground">1 - mc</p>
        </div>
      </div>

      {(material.dureza || material.resistencia) && (
        <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2 text-xs">
          {material.dureza && (
            <span className="text-muted-foreground">
              <strong>Dureza:</strong> {material.dureza}
            </span>
          )}
          {material.resistencia && (
            <span className="text-muted-foreground">
              <strong>σ:</strong> {material.resistencia} MPa
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

// Componente de tabela completa de materiais
interface MaterialsTableProps {
  onSelect?: (material: MaterialData) => void;
  className?: string;
}

export function MaterialsTable({ onSelect, className }: MaterialsTableProps) {
  const [filter, setFilter] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('all');
  const grupos = getGruposMateriais();

  const filteredMaterials = useMemo(() => {
    return materiaisDatabase.filter(m => {
      const matchesSearch = !filter || 
        m.nome.toLowerCase().includes(filter.toLowerCase()) ||
        m.id.toLowerCase().includes(filter.toLowerCase());
      const matchesGrupo = selectedGrupo === 'all' || m.grupo === selectedGrupo;
      return matchesSearch && matchesGrupo;
    });
  }, [filter, selectedGrupo]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4 border-b border-border bg-muted/30 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          Banco de Dados de Materiais
        </h3>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Todos os grupos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {grupos.map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
            <tr className="border-b border-border">
              <th className="text-left p-3 font-medium">Material</th>
              <th className="text-center p-3 font-medium">kc1.1 [N/mm²]</th>
              <th className="text-center p-3 font-medium">m</th>
              <th className="text-center p-3 font-medium">Dureza</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredMaterials.map(m => (
              <tr 
                key={m.id} 
                className={cn(
                  'hover:bg-muted/50 transition-colors',
                  onSelect && 'cursor-pointer'
                )}
                onClick={() => onSelect?.(m)}
              >
                <td className="p-3">
                  <div>
                    <p className="font-medium">{m.nome}</p>
                    <p className="text-xs text-muted-foreground">{m.grupo}</p>
                  </div>
                </td>
                <td className="text-center p-3 font-mono text-primary font-semibold">{m.kc1_1}</td>
                <td className="text-center p-3 font-mono">{m.m}</td>
                <td className="text-center p-3 text-muted-foreground text-xs">{m.dureza || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        {filteredMaterials.length} materiais encontrados
      </div>
    </Card>
  );
}
