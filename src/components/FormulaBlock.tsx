import { useEffect, useRef } from 'react';
import katex from 'katex';
import { cn } from '@/lib/utils';

interface FormulaBlockProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export function FormulaBlock({ formula, displayMode = true, className }: FormulaBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch (error) {
        console.error('KaTeX error:', error);
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'formula-block text-center',
        displayMode && 'py-6',
        className
      )}
    />
  );
}

// Inline formula component
interface InlineFormulaProps {
  formula: string;
  className?: string;
}

export function InlineFormula({ formula, className }: InlineFormulaProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(formula, containerRef.current, {
          displayMode: false,
          throwOnError: false,
        });
      } catch (error) {
        console.error('KaTeX error:', error);
        containerRef.current.textContent = formula;
      }
    }
  }, [formula]);

  return <span ref={containerRef} className={cn('inline-block', className)} />;
}
