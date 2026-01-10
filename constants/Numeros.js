export const NUMEROS_PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23];

export const NUMEROS_FIBONACCI = [1, 2, 3, 5, 8, 13, 21];

export const FAIXAS_NUMEROS = {
  BAIXOS: { min: 1, max: 8, label: 'Baixos' },
  MEDIOS: { min: 9, max: 17, label: 'Médios' },
  ALTOS: { min: 18, max: 25, label: 'Altos' },
};

export const REGRAS_OTIMAS = {
  PARES: { min: 7, max: 8 },
  IMPARES: { min: 7, max: 8 },
  PRIMOS: { min: 5, max: 6 },
  FIBONACCI: { min: 4, max: 5 },
  SOMA: { min: 180, max: 210 },
  SEQUENCIAS: { min: 4, max: 5 },
  REPETICOES: { min: 8, max: 10 },
};

export const MODOS_ANALISE = {
  BALANCEADO: {
    id: 'balanceado',
    nome: 'Balanceado',
    icon: '⚖️',
    descricao: 'Equilíbrio entre números quentes, frios e estatísticas',
  },
  AGRESSIVO: {
    id: 'agressivo',
    nome: 'Agressivo',
    icon: '🔥',
    descricao: 'Foca nos números mais quentes dos últimos sorteios',
  },
  CONSERVADOR: {
    id: 'conservador',
    nome: 'Conservador',
    icon: '🛡️',
    descricao: 'Baseado no histórico completo de todos os concursos',
  },
  CONTRARIAN: {
    id: 'contrarian',
    nome: 'Contrarian',
    icon: '🔄',
    descricao: 'Aposta nos números mais atrasados',
    warning: '⚠️ ESTRATÉGIA EXPERIMENTAL',
    disclaimer: 'Alto risco! Baseado em compensação estatística (não comprovada).',
  },
  INTELIGENTE: {
    id: 'inteligente',
    nome: 'Multi-Fator Avançado',
    icon: '🧮',
    descricao: 'Sistema de pontuação com 7 critérios ponderados',
  },
};

export const COLUNAS_LOTOFACIL = [
  [1, 6, 11, 16, 21],   // Coluna 1
  [2, 7, 12, 17, 22],   // Coluna 2
  [3, 8, 13, 18, 23],   // Coluna 3
  [4, 9, 14, 19, 24],   // Coluna 4
  [5, 10, 15, 20, 25],  // Coluna 5
];

export const LINHAS_LOTOFACIL = [
  [1, 2, 3, 4, 5],      // Linha 1
  [6, 7, 8, 9, 10],     // Linha 2
  [11, 12, 13, 14, 15], // Linha 3
  [16, 17, 18, 19, 20], // Linha 4
  [21, 22, 23, 24, 25], // Linha 5
];