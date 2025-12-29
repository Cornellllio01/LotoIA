import { NUMEROS_PRIMOS, NUMEROS_FIBONACCI } from '../constants/Numeros';

// ====================================
// VALIDAR JOGO
// ====================================
export const validarJogo = (numeros) => {
    const erros = [];

    // Verificar quantidade
    if (!numeros || numeros.length !== 15 && numeros.length !== 20) {
        erros.push('O jogo deve ter 15 ou 20 números');
    }

    // Verificar duplicatas
    const unicos = new Set(numeros);
    if (unicos.size !== numeros.length) {
        erros.push('Há números duplicados no jogo');
    }

    // Verificar range
    const foraDoRange = numeros.filter(n => n < 1 || n > 25);
    if (foraDoRange.length > 0) {
        erros.push('Todos os números devem estar entre 1 e 25');
    }

    return {
        valido: erros.length === 0,
        erros,
    };
};

// ====================================
// VALIDAR NÚMERO
// ====================================
export const validarNumero = (numero) => {
    const num = parseInt(numero);

    if (isNaN(num)) {
        return { valido: false, erro: 'Não é um número válido' };
    }

    if (num < 1 || num > 25) {
        return { valido: false, erro: 'Número deve estar entre 1 e 25' };
    }

    return { valido: true };
};

// ====================================
// VALIDAR CONCURSO
// ====================================
export const validarConcurso = (numeroConcurso) => {
    const num = parseInt(numeroConcurso);

    if (isNaN(num)) {
        return { valido: false, erro: 'Não é um número de concurso válido' };
    }

    if (num < 1 || num > 9999) {
        return { valido: false, erro: 'Número de concurso inválido' };
    }

    return { valido: true, numero: num };
};

// ====================================
// VERIFICAR SE É PRIMO
// ====================================
export const ehPrimo = (numero) => {
    return NUMEROS_PRIMOS.includes(numero);
};

// ====================================
// VERIFICAR SE É FIBONACCI
// ====================================
export const ehFibonacci = (numero) => {
    return NUMEROS_FIBONACCI.includes(numero);
};

// ====================================
// VERIFICAR PARIDADE
// ====================================
export const ehPar = (numero) => {
    return numero % 2 === 0;
};

// ====================================
// VALIDAR FILTROS
// ====================================
export const validarFiltros = (filtros) => {
    const erros = [];

    if (filtros.minPares !== undefined && filtros.maxPares !== undefined) {
        if (filtros.minPares > filtros.maxPares) {
            erros.push('Mínimo de pares não pode ser maior que o máximo');
        }
    }

    if (filtros.minPrimos !== undefined && filtros.maxPrimos !== undefined) {
        if (filtros.minPrimos > filtros.maxPrimos) {
            erros.push('Mínimo de primos não pode ser maior que o máximo');
        }
    }

    if (filtros.minSoma !== undefined && filtros.maxSoma !== undefined) {
        if (filtros.minSoma > filtros.maxSoma) {
            erros.push('Soma mínima não pode ser maior que a máxima');
        }
    }

    return {
        valido: erros.length === 0,
        erros,
    };
};
