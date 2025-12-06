import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, RotateCcw, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onCalculate?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  showActions?: boolean;
  className?: string;
}

export function CalculatorCard({
  title,
  description,
  children,
  onCalculate,
  onReset,
  onSave,
  showActions = true,
  className,
}: CalculatorCardProps) {
  return (
    <Card className={cn('engineering-card', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            {onCalculate && (
              <Button onClick={onCalculate} className="flex-1 min-w-[120px]">
                <Calculator className="h-4 w-4 mr-2" />
                Calcular
              </Button>
            )}
            {onReset && (
              <Button variant="outline" onClick={onReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
            {onSave && (
              <Button variant="secondary" onClick={onSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
