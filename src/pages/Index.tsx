import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Timer, 
  Gauge, 
  Zap, 
  Battery, 
  Clock, 
  DollarSign, 
  Waves, 
  Settings,
  Cog,
  ArrowRight
} from 'lucide-react';

const sections = [
  {
    title: 'Tempos de Corte',
    description: 'Cálculo de tempos para fresamento, torneamento e furação. Inclui avanços e MRR.',
    icon: Timer,
    href: '/tempos',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Velocidade de Corte',
    description: 'Relação entre velocidade de corte e rotação. Conversões de unidades.',
    icon: Gauge,
    href: '/velocidade',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Força de Corte',
    description: 'Equação de Kienzle para cálculo de forças. Módulo experimental incluído.',
    icon: Zap,
    href: '/forca',
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Potência de Corte',
    description: 'Potência mecânica e no eixo. Verificação de capacidade da máquina.',
    icon: Battery,
    href: '/potencia',
    color: 'bg-red-500/10 text-red-600',
  },
  {
    title: 'Vida de Ferramenta',
    description: 'Equação de Taylor. Ajuste experimental para calcular C e n.',
    icon: Clock,
    href: '/vida-ferramenta',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Condições Econômicas',
    description: 'Velocidade de mínimo custo e máxima produção. Análise econômica.',
    icon: DollarSign,
    href: '/economia',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'Rugosidade',
    description: 'Cálculo de Ra e Rt teóricos. Visualização da altura da crista.',
    icon: Waves,
    href: '/rugosidade',
    color: 'bg-cyan-500/10 text-cyan-600',
  },
  {
    title: 'Otimização',
    description: 'Otimização de parâmetros considerando restrições de potência e rugosidade.',
    icon: Settings,
    href: '/otimizacao',
    color: 'bg-orange-500/10 text-orange-600',
  },
];

export default function Index() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 px-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Cog className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Engenharia de Usinagem
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Portal completo com teoria, fórmulas e calculadoras para processos de usinagem.
            Inclui módulos experimentais para determinação de coeficientes.
          </p>
        </div>

        {/* Section Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sections.map((section) => (
            <Link key={section.href} to={section.href}>
              <Card className="h-full engineering-card group cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-2`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {section.title}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {section.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Sobre este Portal</h2>
            <p className="text-muted-foreground">
              Este portal foi desenvolvido para engenheiros, técnicos e estudantes de usinagem.
              Todas as fórmulas são apresentadas com explicação teórica, campos de entrada com
              unidades e validação, e resultados detalhados. Os módulos experimentais permitem
              calcular coeficientes como kc1, m (Kienzle) e C, n (Taylor) a partir de dados medidos.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
