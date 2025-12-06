// Machining calculations library

// ============================================
// A) Cálculo de Tempos de Corte
// ============================================

// Avanço por minuto (mm/min)
export function calcularAvancoPorMinuto(f: number, n: number): number {
  return f * n;
}

// Avanço por minuto em fresamento (mm/min)
export function calcularVfFresamento(fz: number, z: number, n: number): number {
  return fz * z * n;
}

// Taxa de remoção de material - MRR (mm³/min)
export function calcularMRR(ap: number, ae: number, Vf: number): number {
  return ap * ae * Vf;
}

// Tempo de corte torneamento (min)
export function calcularTempoTorneamento(L: number, f: number, n: number): number {
  const Vf = f * n;
  return L / Vf;
}

// Tempo de corte fresamento (min)
export function calcularTempoFresamento(L: number, Vf: number): number {
  return L / Vf;
}

// Tempo de furação (min)
export function calcularTempoFuracao(profundidade: number, f: number, n: number): number {
  const Vf = f * n;
  return profundidade / Vf;
}

// ============================================
// B) Velocidade de Corte
// ============================================

// Velocidade de corte a partir da rotação (m/min)
export function calcularVc(d: number, n: number): number {
  return (Math.PI * d * n) / 1000;
}

// Rotação a partir da velocidade de corte (rpm)
export function calcularRotacao(Vc: number, d: number): number {
  return (Vc * 1000) / (Math.PI * d);
}

// Converter m/min para ft/min
export function mMinParaFtMin(mMin: number): number {
  return mMin * 3.28084;
}

// Converter ft/min para m/min
export function ftMinParaMMin(ftMin: number): number {
  return ftMin / 3.28084;
}

// ============================================
// C) Força de Corte - Kienzle
// ============================================

// Força de corte específica (N/mm²)
export function calcularKc(kc1: number, h: number, m: number): number {
  return kc1 * Math.pow(h, -m);
}

// Força de corte (N)
export function calcularForcaCorte(kc: number, b: number, h: number): number {
  return kc * b * h;
}

// Força de corte com Kienzle direto (N)
export function calcularForcaCorteKienzle(kc1: number, m: number, h: number, b: number): number {
  const kc = kc1 * Math.pow(h, -m);
  return kc * b * h;
}

// Regressão para calcular kc1 e m a partir de dados experimentais
export function calcularCoeficientesKienzle(dados: Array<{ h: number; Fc: number; b: number }>): {
  kc1: number;
  m: number;
  rSquared: number;
} {
  if (dados.length < 3) {
    throw new Error('São necessários pelo menos 3 pontos de dados');
  }

  // Calcular kc para cada ponto: kc = Fc / (b * h)
  // log(kc) = log(kc1) - m * log(h)
  // y = a + b*x onde y = log(kc), x = log(h), a = log(kc1), b = -m

  const points = dados.map(d => ({
    x: Math.log(d.h),
    y: Math.log(d.Fc / (d.b * d.h))
  }));

  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
  const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const m = -slope;
  const kc1 = Math.exp(intercept);

  // Calcular R²
  const yMean = sumY / n;
  const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = points.reduce((sum, p) => {
    const yPred = intercept + slope * p.x;
    return sum + Math.pow(p.y - yPred, 2);
  }, 0);
  const rSquared = 1 - ssResidual / ssTotal;

  return { kc1, m, rSquared };
}

// ============================================
// D) Potência de Corte
// ============================================

// Potência de corte (kW)
export function calcularPotenciaCorte(Fc: number, Vc: number): number {
  return (Fc * Vc) / 60000;
}

// Potência no eixo considerando rendimento (kW)
export function calcularPotenciaEixo(Pc: number, rendimento: number): number {
  return Pc / rendimento;
}

// Verificar se excede capacidade da máquina
export function verificarCapacidadeMaquina(potenciaCalculada: number, potenciaMaquina: number): {
  excede: boolean;
  percentual: number;
} {
  const percentual = (potenciaCalculada / potenciaMaquina) * 100;
  return {
    excede: percentual > 100,
    percentual
  };
}

// ============================================
// E) Vida de Ferramenta - Taylor
// ============================================

// Vida da ferramenta (min)
export function calcularVidaFerramenta(V: number, C: number, n: number): number {
  return Math.pow(C / V, 1 / n);
}

// Velocidade de corte para vida desejada (m/min)
export function calcularVelocidadeParaVida(T: number, C: number, n: number): number {
  return C / Math.pow(T, n);
}

// Regressão para calcular C e n a partir de dados experimentais
export function calcularCoeficientesTaylor(dados: Array<{ V: number; T: number }>): {
  C: number;
  n: number;
  rSquared: number;
} {
  if (dados.length < 3) {
    throw new Error('São necessários pelo menos 3 pontos de dados');
  }

  // V * T^n = C
  // log(V) + n*log(T) = log(C)
  // log(V) = log(C) - n*log(T)
  // y = a + b*x onde y = log(V), x = log(T), a = log(C), b = -n

  const points = dados.map(d => ({
    x: Math.log(d.T),
    y: Math.log(d.V)
  }));

  const numPoints = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
  const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

  const slope = (numPoints * sumXY - sumX * sumY) / (numPoints * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / numPoints;

  const n = -slope;
  const C = Math.exp(intercept);

  // Calcular R²
  const yMean = sumY / numPoints;
  const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
  const ssResidual = points.reduce((sum, p) => {
    const yPred = intercept + slope * p.x;
    return sum + Math.pow(p.y - yPred, 2);
  }, 0);
  const rSquared = 1 - ssResidual / ssTotal;

  return { C, n, rSquared };
}

// ============================================
// F) Condições Econômicas
// ============================================

// Velocidade de mínimo custo (m/min)
export function calcularVelocidadeMinimoCusto(
  C: number,
  n: number,
  Cm: number, // custo por minuto de máquina
  Ct: number, // custo por ferramenta
  tt: number  // tempo de troca de ferramenta
): number {
  const expoente = 1 / n;
  const termo = ((1 - n) / n) * (Ct / Cm + tt);
  return C / Math.pow(termo, n);
}

// Velocidade de máxima produção (m/min)
export function calcularVelocidadeMaximaProducao(
  C: number,
  n: number,
  tt: number // tempo de troca de ferramenta
): number {
  const termo = ((1 - n) / n) * tt;
  return C / Math.pow(termo, n);
}

// Custo por peça
export function calcularCustoPorPeca(
  tc: number, // tempo de corte
  Cm: number, // custo por minuto
  T: number,  // vida da ferramenta
  Ct: number, // custo por ferramenta
  tt: number  // tempo de troca
): number {
  const custoMaquina = tc * Cm;
  const custoFerramenta = (tc / T) * (Ct + tt * Cm);
  return custoMaquina + custoFerramenta;
}

// ============================================
// G) Rugosidade
// ============================================

// Ra teórico para torneamento (µm)
export function calcularRaTorneamento(f: number, R: number): number {
  return (f * f) / (32 * R) * 1000; // converter para µm
}

// Rt teórico para torneamento (µm)
export function calcularRtTorneamento(f: number, R: number): number {
  return (f * f) / (8 * R) * 1000; // converter para µm
}

// Altura da crista (mm)
export function calcularAlturaCrista(f: number, R: number): number {
  return (f * f) / (8 * R);
}

// Ra para fresamento frontal (µm)
export function calcularRaFresamento(fz: number, D: number): number {
  return (fz * fz) / (32 * (D / 2)) * 1000;
}

// ============================================
// H) Otimização
// ============================================

interface ParametrosOtimizacao {
  VcMin: number;
  VcMax: number;
  fMin: number;
  fMax: number;
  apMin: number;
  apMax: number;
  potenciaMaxima: number;
  forcaMaxima: number;
  rugosidadeMaxima: number;
  raioFerramenta: number;
  diametro: number;
  kc1: number;
  m: number;
}

interface ResultadoOtimizacao {
  Vc: number;
  f: number;
  ap: number;
  MRR: number;
  potencia: number;
  forca: number;
  rugosidade: number;
  valido: boolean;
}

export function otimizarParametros(params: ParametrosOtimizacao): ResultadoOtimizacao[] {
  const resultados: ResultadoOtimizacao[] = [];
  
  const passoVc = (params.VcMax - params.VcMin) / 5;
  const passoF = (params.fMax - params.fMin) / 5;
  const passoAp = (params.apMax - params.apMin) / 3;
  
  for (let Vc = params.VcMin; Vc <= params.VcMax; Vc += passoVc) {
    for (let f = params.fMin; f <= params.fMax; f += passoF) {
      for (let ap = params.apMin; ap <= params.apMax; ap += passoAp) {
        const n = calcularRotacao(Vc, params.diametro);
        const Vf = f * n;
        const MRR = ap * f * Vf;
        
        const h = f; // aproximação para torneamento
        const b = ap;
        const Fc = calcularForcaCorteKienzle(params.kc1, params.m, h, b);
        const Pc = calcularPotenciaCorte(Fc, Vc);
        const Ra = calcularRaTorneamento(f, params.raioFerramenta);
        
        const valido = 
          Pc <= params.potenciaMaxima &&
          Fc <= params.forcaMaxima &&
          Ra <= params.rugosidadeMaxima;
        
        resultados.push({
          Vc,
          f,
          ap,
          MRR,
          potencia: Pc,
          forca: Fc,
          rugosidade: Ra,
          valido
        });
      }
    }
  }
  
  // Ordenar por MRR (maior primeiro) e filtrar válidos
  return resultados.sort((a, b) => b.MRR - a.MRR);
}
