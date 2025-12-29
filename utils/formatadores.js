// ====================================
// FORMATAR DATA
// ====================================
export const formatarData = (data) => {
    if (!data) return '';

    if (typeof data === 'string') {
        // Se já está no formato DD/MM/YYYY, retornar
        if (data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            return data;
        }

        // Tentar converter de ISO
        const date = new Date(data);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('pt-BR');
        }
    }

    if (data instanceof Date) {
        return data.toLocaleDateString('pt-BR');
    }

    return '';
};

// ====================================
// FORMATAR DATA RELATIVA
// ====================================
export const formatarDataRelativa = (data) => {
    const date = typeof data === 'string' ? new Date(data) : data;
    const agora = new Date();
    const diff = agora - date;

    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 7) {
        return formatarData(date);
    }

    if (dias > 0) {
        return `há ${dias} dia${dias > 1 ? 's' : ''}`;
    }

    if (horas > 0) {
        return `há ${horas} hora${horas > 1 ? 's' : ''}`;
    }

    if (minutos > 0) {
        return `há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }

    return 'agora mesmo';
};

// ====================================
// FORMATAR NÚMERO COM ZEROS À ESQUERDA
// ====================================
export const formatarNumero = (numero, digitos = 2) => {
    return numero.toString().padStart(digitos, '0');
};

// ====================================
// FORMATAR MOEDA (BRL)
// ====================================
export const formatarMoeda = (valor) => {
    if (typeof valor !== 'number') {
        valor = parseFloat(valor) || 0;
    }

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valor);
};

// ====================================
// FORMATAR MOEDA COMPACTA
// ====================================
export const formatarMoedaCompacta = (valor) => {
    if (typeof valor !== 'number') {
        valor = parseFloat(valor) || 0;
    }

    if (valor >= 1000000) {
        return `R$ ${(valor / 1000000).toFixed(1)}M`;
    }

    if (valor >= 1000) {
        return `R$ ${(valor / 1000).toFixed(1)}K`;
    }

    return formatarMoeda(valor);
};

// ====================================
// FORMATAR PERCENTUAL
// ====================================
export const formatarPercentual = (valor, casasDecimais = 1) => {
    if (typeof valor !== 'number') {
        valor = parseFloat(valor) || 0;
    }

    return `${valor.toFixed(casasDecimais)}%`;
};

// ====================================
// FORMATAR LISTA DE NÚMEROS
// ====================================
export const formatarListaNumeros = (numeros) => {
    if (!Array.isArray(numeros)) return '';

    return numeros
        .map(n => formatarNumero(n, 2))
        .join(' - ');
};

// ====================================
// FORMATAR CONCURSO
// ====================================
export const formatarConcurso = (numero) => {
    return `#${formatarNumero(numero, 4)}`;
};

// ====================================
// FORMATAR SCORE
// ====================================
export const formatarScore = (score) => {
    if (typeof score !== 'number') {
        score = parseFloat(score) || 0;
    }

    return `${Math.round(score)}/100`;
};

// ====================================
// ABREVIAR TEXTO
// ====================================
export const abreviarTexto = (texto, maxCaracteres = 50) => {
    if (!texto || texto.length <= maxCaracteres) {
        return texto;
    }

    return texto.substring(0, maxCaracteres) + '...';
};

// ====================================
// PLURALIZAR
// ====================================
export const pluralizar = (quantidade, singular, plural) => {
    return quantidade === 1 ? singular : plural;
};

// ====================================
// FORMATAR TEMPO DECORRIDO
// ====================================
export const formatarTempoDecorrido = (dataInicio, dataFim = new Date()) => {
    const inicio = typeof dataInicio === 'string' ? new Date(dataInicio) : dataInicio;
    const fim = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;

    const diff = fim - inicio;
    const segundos = Math.floor(diff / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
        return `${dias}d ${horas % 24}h`;
    }

    if (horas > 0) {
        return `${horas}h ${minutos % 60}m`;
    }

    if (minutos > 0) {
        return `${minutos}m ${segundos % 60}s`;
    }

    return `${segundos}s`;
};
