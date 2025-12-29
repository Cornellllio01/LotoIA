import { NUMEROS_PRIMOS, NUMEROS_FIBONACCI, FAIXAS_NUMEROS } from '../constants/Numeros';

// ====================================
// CALCULAR SOMA
// ====================================
export const calcularSoma = (numeros) => {
    return numeros.reduce((acc, num) => acc + num, 0);
};

// ====================================
// CONTAR PARES E ÍMPARES
// ====================================
export const contarParidade = (numeros) => {
    const pares = numeros.filter(n => n % 2 === 0).length;
    const impares = numeros.length - pares;

    return { pares, impares };
};

// ====================================
// CONTAR PRIMOS
// ====================================
export const contarPrimos = (numeros) => {
    return numeros.filter(n => NUMEROS_PRIMOS.includes(n)).length;
};

// ====================================
// CONTAR FIBONACCI
// ====================================
export const contarFibonacci = (numeros) => {
    return numeros.filter(n => NUMEROS_FIBONACCI.includes(n)).length;
};

// ====================================
// CALCULAR DISTRIBUIÇÃO (BAIXOS/MÉDIOS/ALTOS)
// ====================================
export const calcularDistribuicao = (numeros) => {
    const baixos = numeros.filter(n => n >= FAIXAS_NUMEROS.BAIXOS.min && n <= FAIXAS_NUMEROS.BAIXOS.max).length;
    const medios = numeros.filter(n => n >= FAIXAS_NUMEROS.MEDIOS.min && n <= FAIXAS_NUMEROS.MEDIOS.max).length;
    const altos = numeros.filter(n => n >= FAIXAS_NUMEROS.ALTOS.min && n <= FAIXAS_NUMEROS.ALTOS.max).length;

    return { baixos, medios, altos };
};

// ====================================
// CONTAR SEQUÊNCIAS
// ====================================
export const contarSequencias = (numeros) => {
    const sorted = [...numeros].sort((a, b) => a - b);
    const sequencias = [];
    let seqAtual = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1] + 1) {
            seqAtual.push(sorted[i]);
        } else {
            if (seqAtual.length >= 3) {
                sequencias.push([...seqAtual]);
            }
            seqAtual = [sorted[i]];
        }
    }

    if (seqAtual.length >= 3) {
        sequencias.push(seqAtual);
    }

    return {
        total: sequencias.length,
        sequencias,
    };
};

// ====================================
// ENCONTRAR PARES MAIS FREQUENTES
// ====================================
export const encontrarParesFrequentes = (resultados, top = 10) => {
    const pares = {};

    resultados.forEach(resultado => {
        const numeros = resultado.numeros.sort((a, b) => a - b);

        for (let i = 0; i < numeros.length; i++) {
            for (let j = i + 1; j < numeros.length; j++) {
                const par = `${numeros[i]}-${numeros[j]}`;
                pares[par] = (pares[par] || 0) + 1;
            }
        }
    });

    return Object.entries(pares)
        .map(([par, freq]) => {
            const [num1, num2] = par.split('-').map(n => parseInt(n));
            return { numeros: [num1, num2], frequencia: freq };
        })
        .sort((a, b) => b.frequencia - a.frequencia)
        .slice(0, top);
};

// ====================================
// CALCULAR MÉDIA
// ====================================
export const calcularMedia = (numeros) => {
    if (numeros.length === 0) return 0;
    const soma = numeros.reduce((acc, num) => acc + num, 0);
    return soma / numeros.length;
};

// ====================================
// CALCULAR MEDIANA
// ====================================
export const calcularMediana = (numeros) => {
    if (numeros.length === 0) return 0;

    const sorted = [...numeros].sort((a, b) => a - b);
    const meio = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[meio - 1] + sorted[meio]) / 2;
    }

    return sorted[meio];
};

// ====================================
// CALCULAR DESVIO PADRÃO
// ====================================
export const calcularDesvioPadrao = (numeros) => {
    if (numeros.length === 0) return 0;

    const media = calcularMedia(numeros);
    const variancia = numeros.reduce((acc, num) => {
        return acc + Math.pow(num - media, 2);
    }, 0) / numeros.length;

    return Math.sqrt(variancia);
};

// ====================================
// COMPARAR JOGOS (QUANTOS ACERTOS)
// ====================================
export const compararJogos = (jogo1, jogo2) => {
    const acertos = jogo1.filter(n => jogo2.includes(n));
    return {
        acertos: acertos.length,
        numeros: acertos,
        percentual: (acertos.length / jogo1.length) * 100,
    };
};

// ====================================
// GERAR NÚMEROS ALEATÓRIOS
// ====================================
export const gerarNumerosAleatorios = (quantidade = 15) => {
    const numeros = [];

    while (numeros.length < quantidade) {
        const num = Math.floor(Math.random() * 25) + 1;
        if (!numeros.includes(num)) {
            numeros.push(num);
        }
    }

    return numeros.sort((a, b) => a - b);
};

// ====================================
// CALCULAR PROBABILIDADE TEÓRICA
// ====================================
export const calcularProbabilidade = (acertos, totalNumeros = 25, tamanhoJogo = 15) => {
    // Fórmula de combinação: C(n,k) = n! / (k! * (n-k)!)
    const combinacao = (n, k) => {
        if (k > n) return 0;
        if (k === 0 || k === n) return 1;

        let resultado = 1;
        for (let i = 1; i <= k; i++) {
            resultado *= (n - k + i) / i;
        }
        return resultado;
    };

    const totalCombinacoes = combinacao(totalNumeros, tamanhoJogo);
    const combinacoesAcertos = combinacao(tamanhoJogo, acertos) * combinacao(totalNumeros - tamanhoJogo, tamanhoJogo - acertos);

    const probabilidade = combinacoesAcertos / totalCombinacoes;

    return {
        probabilidade,
        percentual: (probabilidade * 100).toFixed(8),
        razao: `1 em ${Math.round(1 / probabilidade).toLocaleString('pt-BR')}`,
    };
};

// ====================================
// DETECTAR PADRÕES
// ====================================
export const detectarPadroes = (numeros) => {
    const padroes = [];

    // Verificar se todos são pares ou ímpares
    const { pares, impares } = contarParidade(numeros);
    if (pares === numeros.length) {
        padroes.push({ tipo: 'todos_pares', descricao: 'Todos os números são pares' });
    }
    if (impares === numeros.length) {
        padroes.push({ tipo: 'todos_impares', descricao: 'Todos os números são ímpares' });
    }

    // Verificar sequências longas
    const { sequencias } = contarSequencias(numeros);
    const sequenciasLongas = sequencias.filter(seq => seq.length >= 5);
    if (sequenciasLongas.length > 0) {
        padroes.push({
            tipo: 'sequencia_longa',
            descricao: `Sequência de ${sequenciasLongas[0].length} números consecutivos`,
            numeros: sequenciasLongas[0],
        });
    }

    // Verificar concentração em uma faixa
    const { baixos, medios, altos } = calcularDistribuicao(numeros);
    if (baixos >= numeros.length * 0.7) {
        padroes.push({ tipo: 'concentracao_baixos', descricao: 'Concentração em números baixos' });
    }
    if (medios >= numeros.length * 0.7) {
        padroes.push({ tipo: 'concentracao_medios', descricao: 'Concentração em números médios' });
    }
    if (altos >= numeros.length * 0.7) {
        padroes.push({ tipo: 'concentracao_altos', descricao: 'Concentração em números altos' });
    }

    // Verificar muitos primos
    const primos = contarPrimos(numeros);
    if (primos >= numeros.length * 0.6) {
        padroes.push({ tipo: 'muitos_primos', descricao: 'Alta concentração de números primos' });
    }

    return padroes;
};
