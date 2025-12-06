import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  unit?: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, number>[];
  onChange: (data: Record<string, number>[]) => void;
  minRows?: number;
  className?: string;
}

export function DataTable({ 
  columns, 
  data, 
  onChange, 
  minRows = 3,
  className 
}: DataTableProps) {
  const addRow = () => {
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: 0 }), {});
    onChange([...data, newRow]);
  };

  const removeRow = (index: number) => {
    if (data.length > minRows) {
      onChange(data.filter((_, i) => i !== index));
    }
  };

  const updateCell = (rowIndex: number, key: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { 
      ...newData[rowIndex], 
      [key]: parseFloat(value) || 0 
    };
    onChange(newData);
  };

  // Initialize with minimum rows if needed
  if (data.length < minRows) {
    const emptyRow = columns.reduce((acc, col) => ({ ...acc, [col.key]: 0 }), {});
    const newData = [...data];
    while (newData.length < minRows) {
      newData.push({ ...emptyRow });
    }
    onChange(newData);
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className="text-center">
                  {col.label}
                  {col.unit && (
                    <span className="text-muted-foreground font-normal ml-1">
                      ({col.unit})
                    </span>
                  )}
                </TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {rowIndex + 1}
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key} className="p-1">
                    <Input
                      type="number"
                      value={row[col.key] || ''}
                      onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
                      className="text-center h-9"
                      step="any"
                    />
                  </TableCell>
                ))}
                <TableCell className="p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(rowIndex)}
                    disabled={data.length <= minRows}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        variant="outline"
        onClick={addRow}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Linha
      </Button>
    </div>
  );
}
