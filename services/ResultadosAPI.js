// Mock API - Em produção, substituir por API real da Lotofácil
// API real: https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil

class ResultadosAPI {
    constructor() {
        this.baseURL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil';
        this.useMock = false; // Alterar para false quando usar API real
    }

    // ====================================
    // BUSCAR ÚLTIMO RESULTADO
    // ====================================
    async buscarUltimo() {
        if (this.useMock) {
            return this.getMockUltimo();
        }

        try {
            const response = await fetch(`${this.baseURL}`);
            const data = await response.json();
            return this.formatarResultado(data);
        } catch (error) {
            console.error('Erro ao buscar último resultado:', error);
            return this.getMockUltimo();
        }
    }

    // ====================================
    // BUSCAR POR CONCURSO
    // ====================================
    async buscarPorConcurso(numeroConcurso) {
        if (this.useMock) {
            return this.getMockResultado(numeroConcurso);
        }

        try {
            const response = await fetch(`${this.baseURL}/${numeroConcurso}`);
            const data = await response.json();
            return this.formatarResultado(data);
        } catch (error) {
            console.error('Erro ao buscar concurso:', error);
            return null;
        }
    }

    // ====================================
    // BUSCAR MÚLTIPLOS RESULTADOS
    // ====================================
    async buscarUltimos(quantidade = 10) {
        if (this.useMock) {
            return this.getMockResultados(quantidade);
        }

        try {
            // API real não tem endpoint para múltiplos, então buscar um por um
            const ultimo = await this.buscarUltimo();
            if (!ultimo) return [];

            const resultados = [ultimo];
            const numeroConcurso = ultimo.concurso;

            for (let i = 1; i < quantidade; i++) {
                const resultado = await this.buscarPorConcurso(numeroConcurso - i);
                if (resultado) {
                    resultados.push(resultado);
                }
            }

            return resultados;
        } catch (error) {
            console.error('Erro ao buscar múltiplos resultados:', error);
            return this.getMockResultados(quantidade);
        }
    }

    // ====================================
    // FORMATAR RESULTADO DA API
    // ====================================
    formatarResultado(data) {
        return {
            concurso: data.numero,
            data: data.dataApuracao,
            numeros: data.listaDezenas?.map(n => parseInt(n)) || [],
            premiacoes: data.listaRateioPremio || [],
            acumulado: data.acumulado || false,
            valorAcumulado: data.valorAcumuladoProximoConcurso || 0,
        };
    }

    // ====================================
    // MOCK DATA (PARA DESENVOLVIMENTO)
    // ====================================
    getMockUltimo() {
        return {
            concurso: 3573,
            data: '28/12/2024',
            numeros: [1, 2, 4, 5, 7, 9, 11, 13, 15, 17, 18, 20, 22, 23, 25],
            premiacoes: [
                { acertos: 15, ganhadores: 2, valorPremio: 850000 },
                { acertos: 14, ganhadores: 458, valorPremio: 1250 },
                { acertos: 13, ganhadores: 12450, valorPremio: 30 },
                { acertos: 12, ganhadores: 98750, valorPremio: 12 },
                { acertos: 11, ganhadores: 325000, valorPremio: 6 },
            ],
            acumulado: false,
            valorAcumulado: 0,
        };
    }

    getMockResultado(numeroConcurso) {
        // Gerar resultado mock baseado no número do concurso
        const numeros = this.gerarNumerosAleatorios();

        return {
            concurso: numeroConcurso,
            data: this.gerarDataAleatoria(),
            numeros,
            premiacoes: [
                { acertos: 15, ganhadores: Math.floor(Math.random() * 5), valorPremio: 500000 + Math.random() * 500000 },
                { acertos: 14, ganhadores: 200 + Math.floor(Math.random() * 400), valorPremio: 800 + Math.random() * 800 },
                { acertos: 13, ganhadores: 8000 + Math.floor(Math.random() * 8000), valorPremio: 25 + Math.random() * 10 },
                { acertos: 12, ganhadores: 80000 + Math.floor(Math.random() * 40000), valorPremio: 10 + Math.random() * 5 },
                { acertos: 11, ganhadores: 300000 + Math.floor(Math.random() * 50000), valorPremio: 5 + Math.random() * 2 },
            ],
            acumulado: Math.random() > 0.9,
            valorAcumulado: Math.random() > 0.9 ? 2000000 + Math.random() * 3000000 : 0,
        };
    }

    getMockResultados(quantidade) {
        const resultados = [];
        const concursoAtual = 3573;

        for (let i = 0; i < quantidade; i++) {
            resultados.push(this.getMockResultado(concursoAtual - i));
        }

        return resultados;
    }

    gerarNumerosAleatorios() {
        const numeros = [];
        while (numeros.length < 15) {
            const num = Math.floor(Math.random() * 25) + 1;
            if (!numeros.includes(num)) {
                numeros.push(num);
            }
        }
        return numeros.sort((a, b) => a - b);
    }

    gerarDataAleatoria() {
        const hoje = new Date();
        const diasAtras = Math.floor(Math.random() * 30);
        const data = new Date(hoje.getTime() - diasAtras * 24 * 60 * 60 * 1000);
        return data.toLocaleDateString('pt-BR');
    }
}

export default new ResultadosAPI();
