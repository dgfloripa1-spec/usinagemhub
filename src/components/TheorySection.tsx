import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TheorySectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function TheorySection({ 
  title, 
  children, 
  defaultExpanded = true,
  className 
}: TheorySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <Button
        variant="ghost"
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-between p-4 h-auto hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="prose prose-slate max-w-none text-foreground">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
