import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

// Helper function to render KaTeX safely
function renderKaTeX(element: HTMLElement, formula: string, displayMode: boolean = true) {
  if (!element) return;
  try {
    katex.render(formula, element, {
      displayMode,
      throwOnError: false,
      trust: true,
      strict: false,
      output: 'html',
    });
  } catch (error) {
    console.error('KaTeX render error:', error);
    element.innerHTML = `<span class="text-destructive">${formula}</span>`;
  }
}

interface FormulaDisplayProps {
  formula: string;
  title?: string;
  description?: string;
  variables?: { symbol: string; name: string; unit?: string }[];
  className?: string;
  variant?: 'default' | 'primary' | 'highlight' | 'compact';
}

export function FormulaDisplay({ 
  formula, 
  title, 
  description, 
  variables, 
  className,
  variant = 'default' 
}: FormulaDisplayProps) {
  const formulaRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (formulaRef.current && formula) {
      renderKaTeX(formulaRef.current, formula, true);
      setRendered(true);
    }
  }, [formula]);

  const variantStyles = {
    default: 'bg-gradient-to-br from-muted/50 to-muted border-border',
    primary: 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20',
    highlight: 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30',
    compact: 'bg-muted/30 border-border/50 py-2',
  };

  return (
    <Card className={cn(
      'overflow-hidden border',
      variantStyles[variant],
      className
    )}>
      {title && (
        <div className="px-4 pt-4 pb-2 border-b border-border/50">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}
      
      <div 
        ref={formulaRef} 
        className={cn(
          'text-center overflow-x-auto',
          variant === 'compact' ? 'py-3 px-4' : 'py-6 px-4',
          'formula-display'
        )} 
      />
      
      {variables && variables.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-muted/30">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {variables.map((v, i) => (
              <VariableItem key={i} symbol={v.symbol} name={v.name} unit={v.unit} />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function VariableItem({ symbol, name, unit }: { symbol: string; name: string; unit?: string }) {
  const symbolRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (symbolRef.current && symbol) {
      renderKaTeX(symbolRef.current, symbol, false);
    }
  }, [symbol]);

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <span ref={symbolRef} className="font-medium text-foreground" />
      <span>= {name}</span>
      {unit && <span className="text-muted-foreground/70">[{unit}]</span>}
    </span>
  );
}

// Componente para equação com múltiplas linhas/etapas
interface FormulaStepsProps {
  title?: string;
  steps: { formula: string; label?: string }[];
  className?: string;
}

export function FormulaSteps({ title, steps, className }: FormulaStepsProps) {
  return (
    <Card className={cn('overflow-hidden border border-border bg-muted/30', className)}>
      {title && (
        <div className="px-4 pt-4 pb-2 border-b border-border/50">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        </div>
      )}
      <div className="p-4 space-y-3">
        {steps.map((step, i) => (
          <FormulaStep key={i} formula={step.formula} label={step.label} number={i + 1} />
        ))}
      </div>
    </Card>
  );
}

function FormulaStep({ formula, label, number }: { formula: string; label?: string; number: number }) {
  const formulaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (formulaRef.current && formula) {
      renderKaTeX(formulaRef.current, formula, true);
    }
  }, [formula]);

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
        <div ref={formulaRef} className="overflow-x-auto py-1" />
      </div>
    </div>
  );
}

// Componente para tabela de fórmulas
interface FormulaTableProps {
  title?: string;
  formulas: { name: string; formula: string; description?: string }[];
  className?: string;
}

export function FormulaTable({ title, formulas, className }: FormulaTableProps) {
  return (
    <Card className={cn('overflow-hidden border border-border', className)}>
      {title && (
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        </div>
      )}
      <div className="divide-y divide-border">
        {formulas.map((item, i) => (
          <FormulaRow key={i} name={item.name} formula={item.formula} description={item.description} />
        ))}
      </div>
    </Card>
  );
}

function FormulaRow({ name, formula, description }: { name: string; formula: string; description?: string }) {
  const formulaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (formulaRef.current && formula) {
      renderKaTeX(formulaRef.current, formula, false);
    }
  }, [formula]);

  return (
    <div className="px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{name}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div ref={formulaRef} className="flex-shrink-0 text-right" />
    </div>
  );
}
