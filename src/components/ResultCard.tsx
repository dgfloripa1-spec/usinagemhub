import { cn } from '@/lib/utils';
import { InlineFormula } from './FormulaBlock';

interface ResultCardProps {
  label: string;
  value: number | string;
  unit?: string;
  formula?: string;
  highlight?: boolean;
  warning?: boolean;
  success?: boolean;
  className?: string;
}

export function ResultCard({
  label,
  value,
  unit,
  formula,
  highlight = false,
  warning = false,
  success = false,
  className,
}: ResultCardProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('pt-BR', { maximumFractionDigits: 4 })
    : value;

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-colors',
        highlight && 'bg-primary/10 border-primary',
        warning && 'bg-warning/10 border-warning',
        success && 'bg-success/10 border-success',
        !highlight && !warning && !success && 'bg-card border-border',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          {formula && (
            <InlineFormula formula={formula} className="text-xs text-muted-foreground" />
          )}
        </div>
        <div className="text-right">
          <p className={cn(
            'text-2xl font-bold tabular-nums',
            highlight && 'text-primary',
            warning && 'text-warning',
            success && 'text-success'
          )}>
            {formattedValue}
          </p>
          {unit && <p className="text-sm text-muted-foreground">{unit}</p>}
        </div>
      </div>
    </div>
  );
}

// Multiple results in a grid
interface ResultsGridProps {
  results: Array<{
    label: string;
    value: number | string;
    unit?: string;
    formula?: string;
    highlight?: boolean;
    warning?: boolean;
    success?: boolean;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ResultsGrid({ results, columns = 2, className }: ResultsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {results.map((result, index) => (
        <ResultCard key={index} {...result} />
      ))}
    </div>
  );
}
