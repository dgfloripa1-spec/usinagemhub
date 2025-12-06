// Banco de dados de materiais para cálculos de usinagem
// Baseado em tabelas de Kienzle e dados experimentais de usinagem

export interface MaterialData {
  id: string;
  nome: string;
  grupo: string;
  kc1_1: number; // Força específica de corte para h=1mm [N/mm²]
  m: number; // Expoente de Kienzle (1-mc)
  dureza?: string;
  resistencia?: string; // Resistência à tração [MPa]
}

export const materiaisDatabase: MaterialData[] = [
  // AÇOS CARBONO
  { id: 'aco-1020', nome: 'Aço AISI 1020', grupo: 'Aços Carbono', kc1_1: 1500, m: 0.26, dureza: '130-160 HB', resistencia: '380-450' },
  { id: 'aco-1045', nome: 'Aço AISI 1045', grupo: 'Aços Carbono', kc1_1: 1700, m: 0.25, dureza: '160-200 HB', resistencia: '570-700' },
  { id: 'aco-1060', nome: 'Aço AISI 1060', grupo: 'Aços Carbono', kc1_1: 1900, m: 0.24, dureza: '180-220 HB', resistencia: '620-750' },
  { id: 'aco-1080', nome: 'Aço AISI 1080', grupo: 'Aços Carbono', kc1_1: 2100, m: 0.23, dureza: '200-250 HB', resistencia: '700-850' },
  
  // AÇOS LIGA
  { id: 'aco-4140', nome: 'Aço AISI 4140', grupo: 'Aços Liga', kc1_1: 2000, m: 0.22, dureza: '200-280 HB', resistencia: '650-900' },
  { id: 'aco-4340', nome: 'Aço AISI 4340', grupo: 'Aços Liga', kc1_1: 2200, m: 0.21, dureza: '250-320 HB', resistencia: '800-1100' },
  { id: 'aco-8620', nome: 'Aço AISI 8620', grupo: 'Aços Liga', kc1_1: 1850, m: 0.24, dureza: '170-220 HB', resistencia: '550-750' },
  { id: 'aco-52100', nome: 'Aço AISI 52100', grupo: 'Aços Liga', kc1_1: 2400, m: 0.20, dureza: '200-280 HB', resistencia: '700-950' },
  
  // AÇOS INOXIDÁVEIS
  { id: 'inox-304', nome: 'Aço Inox AISI 304', grupo: 'Aços Inoxidáveis', kc1_1: 2100, m: 0.21, dureza: '150-200 HB', resistencia: '520-720' },
  { id: 'inox-316', nome: 'Aço Inox AISI 316', grupo: 'Aços Inoxidáveis', kc1_1: 2200, m: 0.20, dureza: '150-200 HB', resistencia: '530-680' },
  { id: 'inox-420', nome: 'Aço Inox AISI 420', grupo: 'Aços Inoxidáveis', kc1_1: 2000, m: 0.22, dureza: '180-240 HB', resistencia: '600-800' },
  { id: 'inox-17-4ph', nome: 'Aço Inox 17-4 PH', grupo: 'Aços Inoxidáveis', kc1_1: 2500, m: 0.19, dureza: '280-350 HB', resistencia: '900-1200' },
  
  // FERROS FUNDIDOS
  { id: 'fc-150', nome: 'Ferro Fundido Cinzento FC 150', grupo: 'Ferros Fundidos', kc1_1: 1000, m: 0.28, dureza: '150-200 HB', resistencia: '150-200' },
  { id: 'fc-250', nome: 'Ferro Fundido Cinzento FC 250', grupo: 'Ferros Fundidos', kc1_1: 1200, m: 0.26, dureza: '180-230 HB', resistencia: '200-280' },
  { id: 'fc-350', nome: 'Ferro Fundido Cinzento FC 350', grupo: 'Ferros Fundidos', kc1_1: 1400, m: 0.24, dureza: '200-260 HB', resistencia: '280-380' },
  { id: 'fn-40', nome: 'Ferro Fundido Nodular FE 40018', grupo: 'Ferros Fundidos', kc1_1: 1300, m: 0.25, dureza: '140-200 HB', resistencia: '400-500' },
  { id: 'fn-60', nome: 'Ferro Fundido Nodular FE 60003', grupo: 'Ferros Fundidos', kc1_1: 1500, m: 0.23, dureza: '200-270 HB', resistencia: '600-750' },
  
  // ALUMÍNIO E LIGAS
  { id: 'al-1050', nome: 'Alumínio 1050', grupo: 'Alumínio e Ligas', kc1_1: 350, m: 0.30, dureza: '20-35 HB', resistencia: '65-95' },
  { id: 'al-6061', nome: 'Alumínio 6061-T6', grupo: 'Alumínio e Ligas', kc1_1: 550, m: 0.28, dureza: '95-110 HB', resistencia: '270-310' },
  { id: 'al-7075', nome: 'Alumínio 7075-T6', grupo: 'Alumínio e Ligas', kc1_1: 700, m: 0.26, dureza: '150-175 HB', resistencia: '540-580' },
  { id: 'al-2024', nome: 'Alumínio 2024-T4', grupo: 'Alumínio e Ligas', kc1_1: 600, m: 0.27, dureza: '120-140 HB', resistencia: '420-480' },
  { id: 'al-silicio', nome: 'Liga Al-Si (fundido)', grupo: 'Alumínio e Ligas', kc1_1: 650, m: 0.27, dureza: '80-120 HB', resistencia: '200-280' },
  
  // COBRE E LIGAS
  { id: 'cu-eletro', nome: 'Cobre Eletrolítico', grupo: 'Cobre e Ligas', kc1_1: 850, m: 0.25, dureza: '40-80 HB', resistencia: '220-300' },
  { id: 'latao-360', nome: 'Latão C36000', grupo: 'Cobre e Ligas', kc1_1: 700, m: 0.28, dureza: '60-100 HB', resistencia: '280-380' },
  { id: 'bronze-fosf', nome: 'Bronze Fosforoso', grupo: 'Cobre e Ligas', kc1_1: 900, m: 0.24, dureza: '70-120 HB', resistencia: '320-450' },
  { id: 'bronze-al', nome: 'Bronze Alumínio', grupo: 'Cobre e Ligas', kc1_1: 1100, m: 0.22, dureza: '150-200 HB', resistencia: '500-700' },
  
  // TITÂNIO E LIGAS
  { id: 'ti-cp', nome: 'Titânio CP Grau 2', grupo: 'Titânio e Ligas', kc1_1: 1400, m: 0.22, dureza: '200-250 HB', resistencia: '350-450' },
  { id: 'ti-6al4v', nome: 'Ti-6Al-4V', grupo: 'Titânio e Ligas', kc1_1: 1600, m: 0.20, dureza: '320-380 HB', resistencia: '900-1100' },
  
  // SUPERLIGAS
  { id: 'inconel-625', nome: 'Inconel 625', grupo: 'Superligas', kc1_1: 2800, m: 0.18, dureza: '200-280 HB', resistencia: '850-1000' },
  { id: 'inconel-718', nome: 'Inconel 718', grupo: 'Superligas', kc1_1: 3200, m: 0.17, dureza: '300-400 HB', resistencia: '1200-1400' },
  { id: 'hastelloy-c', nome: 'Hastelloy C-276', grupo: 'Superligas', kc1_1: 3000, m: 0.18, dureza: '180-240 HB', resistencia: '750-900' },
  
  // PLÁSTICOS DE ENGENHARIA
  { id: 'nylon-66', nome: 'Nylon 6/6', grupo: 'Plásticos de Engenharia', kc1_1: 200, m: 0.35, dureza: '85-95 Shore D', resistencia: '70-85' },
  { id: 'pom', nome: 'Poliacetal (POM)', grupo: 'Plásticos de Engenharia', kc1_1: 180, m: 0.36, dureza: '80-90 Shore D', resistencia: '60-70' },
  { id: 'peek', nome: 'PEEK', grupo: 'Plásticos de Engenharia', kc1_1: 280, m: 0.32, dureza: '85-95 Shore D', resistencia: '90-100' },
  { id: 'ptfe', nome: 'PTFE (Teflon)', grupo: 'Plásticos de Engenharia', kc1_1: 120, m: 0.40, dureza: '50-60 Shore D', resistencia: '20-35' },
];

// Fatores de correção
export interface FatoresCorrecao {
  anguloDeSaida: { valor: number; fator: number }[];
  anguloDeInclinacao: { valor: number; fator: number }[];
  velocidadeDeCorte: { faixa: string; fator: number }[];
  desgaste: { nivel: string; fator: number }[];
  fluido: { tipo: string; fator: number }[];
}

export const fatoresCorrecao: FatoresCorrecao = {
  anguloDeSaida: [
    { valor: -6, fator: 1.15 },
    { valor: 0, fator: 1.08 },
    { valor: 6, fator: 1.00 },
    { valor: 10, fator: 0.95 },
    { valor: 15, fator: 0.90 },
    { valor: 20, fator: 0.85 },
  ],
  anguloDeInclinacao: [
    { valor: -6, fator: 0.96 },
    { valor: 0, fator: 1.00 },
    { valor: 6, fator: 1.04 },
    { valor: 10, fator: 1.08 },
  ],
  velocidadeDeCorte: [
    { faixa: '< 50 m/min', fator: 1.10 },
    { faixa: '50-100 m/min', fator: 1.00 },
    { faixa: '100-200 m/min', fator: 0.95 },
    { faixa: '> 200 m/min', fator: 0.90 },
  ],
  desgaste: [
    { nivel: 'Ferramenta nova', fator: 1.00 },
    { nivel: 'Desgaste leve (VB=0.1mm)', fator: 1.10 },
    { nivel: 'Desgaste médio (VB=0.2mm)', fator: 1.25 },
    { nivel: 'Desgaste elevado (VB=0.3mm)', fator: 1.40 },
  ],
  fluido: [
    { tipo: 'A seco', fator: 1.00 },
    { tipo: 'Emulsão', fator: 0.95 },
    { tipo: 'Óleo integral', fator: 0.90 },
    { tipo: 'MQL', fator: 0.92 },
  ],
};

// Função auxiliar para obter grupos únicos
export function getGruposMateriais(): string[] {
  return [...new Set(materiaisDatabase.map(m => m.grupo))];
}

// Função para buscar material por ID
export function getMaterialById(id: string): MaterialData | undefined {
  return materiaisDatabase.find(m => m.id === id);
}

// Função para filtrar materiais por grupo
export function getMateriaisByGrupo(grupo: string): MaterialData[] {
  return materiaisDatabase.filter(m => m.grupo === grupo);
}

// Calcular kc com correções
export function calcularKcCorrigido(
  kc1_1: number, 
  h: number, 
  m: number,
  fatores: { gamma?: number; lambda?: number; desgaste?: number; fluido?: number } = {}
): number {
  let kc = kc1_1 * Math.pow(h, -m);
  
  // Aplicar correção do ângulo de saída (gamma)
  if (fatores.gamma !== undefined) {
    const correcaoGamma = fatoresCorrecao.anguloDeSaida.find(f => f.valor === fatores.gamma);
    if (correcaoGamma) kc *= correcaoGamma.fator;
  }
  
  // Aplicar correção do ângulo de inclinação (lambda)
  if (fatores.lambda !== undefined) {
    const correcaoLambda = fatoresCorrecao.anguloDeInclinacao.find(f => f.valor === fatores.lambda);
    if (correcaoLambda) kc *= correcaoLambda.fator;
  }
  
  // Aplicar outras correções diretamente
  if (fatores.desgaste) kc *= fatores.desgaste;
  if (fatores.fluido) kc *= fatores.fluido;
  
  return kc;
}
