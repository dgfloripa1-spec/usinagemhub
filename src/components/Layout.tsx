import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Timer, 
  Gauge, 
  Zap, 
  Battery, 
  Clock, 
  DollarSign, 
  Waves, 
  Settings,
  Menu,
  X,
  Cog,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Tempos de Corte', href: '/tempos', icon: Timer },
  { name: 'Velocidade de Corte', href: '/velocidade', icon: Gauge },
  { name: 'Força de Corte', href: '/forca', icon: Zap },
  { name: 'Potência de Corte', href: '/potencia', icon: Battery },
  { name: 'Vida de Ferramenta', href: '/vida-ferramenta', icon: Clock },
  { name: 'Condições Econômicas', href: '/economia', icon: DollarSign },
  { name: 'Rugosidade', href: '/rugosidade', icon: Waves },
  { name: 'Otimização', href: '/otimizacao', icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-sidebar-foreground">Usinagem Hub</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center gap-2 p-6 border-b border-sidebar-border">
          <Cog className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">Usinagem Hub</h1>
            <p className="text-xs text-sidebar-foreground/70">Engenharia de Usinagem</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 mt-16 lg:mt-0">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            Todas as fórmulas e cálculos são para fins educacionais
          </p>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
