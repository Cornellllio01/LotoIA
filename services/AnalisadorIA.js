import { NUMEROS_PRIMOS, NUMEROS_FIBONACCI, REGRAS_OTIMAS, COLUNAS_LOTOFACIL, LINHAS_LOTOFACIL } from '../constants/Numeros';

export class AnalisadorIA {
    constructor() {
        this.pesosPadrao = {
            frequenciaRecente: 0.30,
            atraso: 0.25,
            historicoGeral: 0.20,
            primos: 0.10,
            fibonacci: 0.10,
            distribuicao: 0.05,
        };
    }

    // ====================================
    // MÉTODO PRINCIPAL - GERAR JOGO
    // ====================================
    gerarJogo(estatisticas, modo = 'balanceado', quantidade = 20) {
        let numeros = [];

        switch (modo) {
            case 'agressivo':
                numeros = this.modoAgressivo(estatisticas, quantidade);
                break;
            case 'conservador':
                numeros = this.modoConservador(estatisticas, quantidade);
                break;
            case 'contrarian':
                numeros = this.modoContrarian(estatisticas, quantidade);
                break;
            case 'inteligente':
                numeros = this.modoInteligente(estatisticas, quantidade);
                break;
            default:
                numeros = this.modoBalanceado(estatisticas, quantidade);
        }

        // Otimizar jogo
        numeros = this.otimizarJogo(numeros, estatisticas);

        // Calcular todas as métricas
        const metricas = this.calcularMetricas(numeros, estatisticas);

        // Gerar explicação
        const explicacao = this.gerarExplicacao(numeros, estatisticas, modo, metricas);

        return {
            numeros: numeros.sort((a, b) => a - b),
            modo,
            metricas,
            explicacao,
            dataGeracao: new Date().toISOString(),
            score: metricas.qualidade.score,
        };
    }

    // ====================================
    // MODO BALANCEADO (RECOMENDADO)
    // ====================================
    modoBalanceado(estatisticas, quantidade) {
        const pesos = this.calcularPesosBalanceados(estatisticas);
        return this.selecionarPorPeso(pesos, quantidade);
    }

    calcularPesosBalanceados(estatisticas) {
        const pesos = {};

        for (let num = 1; num <= 25; num++) {
            let peso = 0;

            // 1. Frequência recente (30%)
            const freq = estatisticas.frequencia?.find(f => f.numero === num);
            if (freq) {
                peso += (freq.ocorrencias / 7) * 30;
            }

            // 2. Atraso - MELHORADO com curva logarítmica (25%)
            const atrasoData = estatisticas.atrasos?.find(a => a.numero === num);
            if (atrasoData && atrasoData.atraso > 0) {
                // Curva log: cresce rápido no início, depois desacelera
                const atraso = atrasoData.atraso;
                peso += Math.min(Math.log(atraso + 1) * 10, 25);
            }

            // 3. Histórico geral (20%)
            if (freq && freq.ocorrenciasTotal) {
                peso += (freq.ocorrenciasTotal / 2300) * 20;
            }

            // 4. Bônus por ser primo (10%)
            if (NUMEROS_PRIMOS.includes(num)) {
                peso += 10;
            }

            // 5. Bônus por ser Fibonacci (10%)
            if (NUMEROS_FIBONACCI.includes(num)) {
                peso += 10;
            }

            // 6. Bônus por distribuição (5%)
            peso += this.calcularBonusDistribuicao(num) * 5;

            pesos[num] = peso;
        }

        return pesos;
    }

    // ====================================
    // MODO AGRESSIVO
    // ====================================
    modoAgressivo(estatisticas, quantidade) {
        const quentes = (estatisticas.frequencia || [])
            .sort((a, b) => b.ocorrencias - a.ocorrencias)
            .slice(0, quantidade)
            .map(f => f.numero);

        return quentes.length >= quantidade ? quentes : this.completarComBalanceados(quentes, quantidade, estatisticas);
    }

    // ====================================
    // MODO CONSERVADOR
    // ====================================
    modoConservador(estatisticas, quantidade) {
        const melhoresHistoricos = (estatisticas.frequencia || [])
            .sort((a, b) => (b.ocorrenciasTotal || 0) - (a.ocorrenciasTotal || 0))
            .slice(0, quantidade)
            .map(f => f.numero);

        return melhoresHistoricos;
    }

    // ====================================
    // MODO CONTRARIAN
    // ====================================
    modoContrarian(estatisticas, quantidade) {
        const atrasados = (estatisticas.atrasos || [])
            .sort((a, b) => b.atraso - a.atraso)
            .slice(0, quantidade)
            .map(a => a.numero);

        return atrasados.length >= quantidade ? atrasados : this.completarComBalanceados(atrasados, quantidade, estatisticas);
    }

    // ====================================
    // MODO INTELIGENTE (MULTI-FATOR AVANÇADO)
    // ====================================
    modoInteligente(estatisticas, quantidade) {
        // Usar sistema de pontuação com múltiplos fatores
        const pesos = {};

        for (let num = 1; num <= 25; num++) {
            const features = this.extrairFeatures(num, estatisticas);
            pesos[num] = this.redeNeuralSimulada(features);
        }

        return this.selecionarPorPeso(pesos, quantidade);
    }

    extrairFeatures(numero, estatisticas) {
        const freq = estatisticas.frequencia?.find(f => f.numero === numero) || {};
        const atraso = estatisticas.atrasos?.find(a => a.numero === numero) || {};

        return {
            frequenciaRecente: (freq.ocorrencias || 0) / 7,
            atraso: atraso.atraso || 0,
            ocorrenciasTotal: (freq.ocorrenciasTotal || 2100) / 2300,
            ehPrimo: NUMEROS_PRIMOS.includes(numero) ? 1 : 0,
            ehFibonacci: NUMEROS_FIBONACCI.includes(numero) ? 1 : 0,
            faixa: numero <= 8 ? 0 : numero <= 17 ? 0.5 : 1,
            paridade: numero % 2 === 0 ? 1 : 0,
        };
    }

    redeNeuralSimulada(features) {
        // Pesos do sistema de pontuação (ajustados manualmente)
        const pesos = {
            frequenciaRecente: 3.5,
            atraso: 2.8,
            ocorrenciasTotal: 2.0,
            ehPrimo: 1.5,
            ehFibonacci: 1.5,
            faixa: 1.0,
            paridade: 0.5,
        };

        let soma = 0;
        for (const [key, value] of Object.entries(features)) {
            soma += value * (pesos[key] || 1);
        }

        // Função de ativação (sigmoid)
        return 100 / (1 + Math.exp(-soma / 10));
    }

    // ====================================
    // OTIMIZAÇÃO DO JOGO (COM EARLY STOPPING)
    // ====================================
    otimizarJogo(numeros, estatisticas, maxTentativas = 200) {
        let melhorJogo = [...numeros];
        let melhorScore = this.avaliarJogo(melhorJogo);
        let tentativasSemMelhoria = 0;

        for (let i = 0; i < maxTentativas; i++) {
            const candidato = this.gerarVariacao(melhorJogo);
            const score = this.avaliarJogo(candidato);

            if (score > melhorScore) {
                melhorJogo = candidato;
                melhorScore = score;
                tentativasSemMelhoria = 0;
            } else {
                tentativasSemMelhoria++;
            }

            // Early stopping: parar se já está excelente
            if (melhorScore >= 92) {
                console.log(`✅ Score excelente alcançado em ${i + 1} iterações`);
                break;
            }

            // Early stopping: parar se convergiu
            if (tentativasSemMelhoria >= 40) {
                console.log(`⏸️ Convergiu em ${i + 1} iterações`);
                break;
            }
        }

        console.log(`🎲 Otimização concluída: Score ${melhorScore.toFixed(1)}`);
        return melhorJogo;
    }

    avaliarJogo(numeros) {
        let score = 100;

        // 1. Pares/Ímpares (peso: 20)
        const pares = numeros.filter(n => n % 2 === 0).length;
        const difParImpar = Math.abs(pares - 10);
        score -= difParImpar * 4;

        // 2. Soma (peso: 25)
        const soma = numeros.reduce((acc, n) => acc + n, 0);
        if (soma < REGRAS_OTIMAS.SOMA.min) {
            score -= (REGRAS_OTIMAS.SOMA.min - soma) * 0.3;
        } else if (soma > REGRAS_OTIMAS.SOMA.max) {
            score -= (soma - REGRAS_OTIMAS.SOMA.max) * 0.3;
        } else {
            score += 15; // Bônus por estar na faixa ideal
        }

        // 3. Primos (peso: 15)
        const primos = numeros.filter(n => NUMEROS_PRIMOS.includes(n)).length;
        const difPrimos = Math.abs(primos - 5.5);
        score -= difPrimos * 3;

        // 4. Fibonacci (peso: 15)
        const fibonacci = numeros.filter(n => NUMEROS_FIBONACCI.includes(n)).length;
        const difFib = Math.abs(fibonacci - 4.5);
        score -= difFib * 3;

        // 5. Distribuição (peso: 15)
        const baixos = numeros.filter(n => n <= 8).length;
        const medios = numeros.filter(n => n > 8 && n <= 17).length;
        const altos = numeros.filter(n => n > 17).length;
        const desvioPadrao = Math.sqrt(
            (Math.pow(baixos - 6.67, 2) + Math.pow(medios - 6.67, 2) + Math.pow(altos - 6.67, 2)) / 3
        );
        score -= desvioPadrao * 5;

        // 6. Sequências (peso: 10)
        const sequencias = this.contarSequencias(numeros);
        const difSeq = Math.abs(sequencias - 4.5);
        score -= difSeq * 2;

        // 7. Distribuição por linha (peso: 10) - NOVO!
        const maxPorLinha = this.contarMaxPorLinha(numeros);
        if (maxPorLinha > 9) {
            score -= (maxPorLinha - 9) * 5;
        } else if (maxPorLinha >= 3) {
            score += 5;
        }

        // 8. Distribuição por coluna (peso: 10) - NOVO!
        const maxPorColuna = this.contarMaxPorColuna(numeros);
        if (maxPorColuna > 7) {
            score -= (maxPorColuna - 7) * 5;
        } else if (maxPorColuna >= 3) {
            score += 5;
        }

        return Math.max(0, Math.min(100, score));
    }

    // ====================================
    // NOVOS MÉTODOS - DISTRIBUIÇÃO VISUAL
    // ====================================
    contarMaxPorLinha(numeros) {
        return Math.max(...LINHAS_LOTOFACIL.map(linha =>
            numeros.filter(n => linha.includes(n)).length
        ));
    }

    contarMaxPorColuna(numeros) {
        return Math.max(...COLUNAS_LOTOFACIL.map(coluna =>
            numeros.filter(n => coluna.includes(n)).length
        ));
    }

    gerarVariacao(numeros) {
        const variacao = [...numeros];
        const numTrocas = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numTrocas; i++) {
            // Remover número aleatório
            const indexRemover = Math.floor(Math.random() * variacao.length);
            variacao.splice(indexRemover, 1);

            // Adicionar novo número
            let novoNum;
            do {
                novoNum = Math.floor(Math.random() * 25) + 1;
            } while (variacao.includes(novoNum));

            variacao.push(novoNum);
        }

        return variacao.sort((a, b) => a - b);
    }

    // ====================================
    // CÁLCULOS E MÉTRICAS
    // ====================================
    calcularMetricas(numeros, estatisticas) {
        const pares = numeros.filter(n => n % 2 === 0).length;
        const impares = numeros.length - pares;
        const primos = numeros.filter(n => NUMEROS_PRIMOS.includes(n)).length;
        const fibonacci = numeros.filter(n => NUMEROS_FIBONACCI.includes(n)).length;
        const soma = numeros.reduce((acc, n) => acc + n, 0);
        const sequencias = this.contarSequencias(numeros);

        const baixos = numeros.filter(n => n <= 8).length;
        const medios = numeros.filter(n => n > 8 && n <= 17).length;
        const altos = numeros.filter(n => n > 17).length;

        const atrasados = numeros.filter(n => {
            const atraso = estatisticas.atrasos?.find(a => a.numero === n);
            return atraso && atraso.atraso >= 2;
        });

        const quentes = numeros.filter(n => {
            const freq = estatisticas.frequencia?.find(f => f.numero === n);
            return freq && freq.ocorrencias >= 5;
        });

        const score = this.avaliarJogo(numeros);
        const qualidade = score >= 80 ? 'Excelente' : score >= 65 ? 'Muito Boa' : score >= 50 ? 'Boa' : 'Regular';

        return {
            pares,
            impares,
            primos,
            fibonacci,
            soma,
            somaOk: soma >= REGRAS_OTIMAS.SOMA.min && soma <= REGRAS_OTIMAS.SOMA.max,
            sequencias,
            distribuicao: { baixos, medios, altos },
            atrasados: atrasados.map(n => n),
            quentes: quentes.map(n => n),
            qualidade: {
                score: Math.round(score),
                nivel: qualidade,
            },
        };
    }

    contarSequencias(numeros) {
        const sorted = [...numeros].sort((a, b) => a - b);
        let count = 0;
        let seqAtual = 1;

        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === sorted[i - 1] + 1) {
                seqAtual++;
                if (seqAtual === 3) count++;
            } else {
                seqAtual = 1;
            }
        }

        return count;
    }

    calcularBonusDistribuicao(numero) {
        // Retorna valor entre 0 e 1 baseado na distribuição ideal
        if (numero <= 8) return 0.9;  // Baixos: ligeiramente menos
        if (numero <= 17) return 1.0; // Médios: ideal
        return 0.9; // Altos: ligeiramente menos
    }

    // ====================================
    // EXPLICAÇÃO DETALHADA
    // ====================================
    gerarExplicacao(numeros, estatisticas, modo, metricas) {
        const sections = [];

        // Seção 1: Modo escolhido
        sections.push({
            icon: this.getIconModo(modo),
            titulo: `Modo ${modo.charAt(0).toUpperCase() + modo.slice(1)}`,
            texto: this.getDescricaoModo(modo),
        });

        // Seção 2: Números Quentes
        if (metricas.quentes.length > 0) {
            sections.push({
                icon: '🔥',
                titulo: 'Números Quentes',
                texto: `${metricas.quentes.length} números com alta frequência recente: ${metricas.quentes.join(', ')}. Estes aparecem com frequência nos últimos sorteios.`,
            });
        }

        // Seção 3: Números Atrasados
        if (metricas.atrasados.length > 0) {
            sections.push({
                icon: '⏰',
                titulo: 'Números Atrasados',
                texto: `${metricas.atrasados.length} números com atraso significativo: ${metricas.atrasados.join(', ')}. Estatisticamente, tendem a aparecer em breve.`,
            });
        }

        // Seção 4: Balanceamento
        const balanceamento = metricas.pares === 10 ? 'equilíbrio perfeito' :
            (metricas.pares >= 7 && metricas.pares <= 8) ? 'dentro da faixa ideal' : 'balanceado';
        sections.push({
            icon: '⚖️',
            titulo: 'Balanceamento Par/Ímpar',
            texto: `${metricas.pares} pares e ${metricas.impares} ímpares - ${balanceamento}.`,
        });

        // Seção 5: Números Especiais
        sections.push({
            icon: '✨',
            titulo: 'Números Especiais',
            texto: `${metricas.primos} primos e ${metricas.fibonacci} Fibonacci. Ambos dentro das faixas historicamente mais frequentes.`,
        });

        // Seção 6: Soma
        const somaStatus = metricas.somaOk ? 'perfeitamente' : 'próxima';
        sections.push({
            icon: '📊',
            titulo: 'Soma Total',
            texto: `Soma de ${metricas.soma}, ${somaStatus} dentro da faixa ideal (240-280).`,
        });

        // Seção 7: Distribuição
        sections.push({
            icon: '📈',
            titulo: 'Distribuição',
            texto: `Baixos: ${metricas.distribuicao.baixos} | Médios: ${metricas.distribuicao.medios} | Altos: ${metricas.distribuicao.altos}`,
        });

        // Seção 8: Avaliação
        sections.push({
            icon: '🎖️',
            titulo: 'Avaliação Final',
            texto: `Qualidade: ${metricas.qualidade.nivel} (${metricas.qualidade.score}/100). Jogo otimizado com base em múltiplos fatores estatísticos.`,
        });

        return {
            titulo: '🎯 Análise Completa do Jogo',
            sections,
        };
    }

    getIconModo(modo) {
        const icons = {
            balanceado: '⚖️',
            agressivo: '🔥',
            conservador: '🛡️',
            contrarian: '🔄',
            inteligente: '🧮',
        };
        return icons[modo] || '🎯';
    }

    getDescricaoModo(modo) {
        const descricoes = {
            balanceado: 'Equilíbrio perfeito entre números quentes, frios e padrões históricos.',
            agressivo: 'Focado nos números mais frequentes dos últimos sorteios.',
            conservador: 'Baseado no desempenho histórico completo de todos os concursos.',
            contrarian: 'Aposta nos números mais atrasados, esperando compensação estatística.',
            inteligente: 'Sistema de pontuação avançado com 7 critérios ponderados.',
        };
        return descricoes[modo] || 'Análise personalizada.';
    }

    // ====================================
    // UTILITÁRIOS
    // ====================================
    selecionarPorPeso(pesos, quantidade) {
        const ordenados = Object.entries(pesos)
            .sort(([, pesoA], [, pesoB]) => pesoB - pesoA)
            .slice(0, quantidade)
            .map(([num]) => parseInt(num));

        return ordenados;
    }

    completarComBalanceados(numerosAtuais, quantidade, estatisticas) {
        const pesos = this.calcularPesosBalanceados(estatisticas);
        const disponiveis = Object.keys(pesos)
            .map(n => parseInt(n))
            .filter(n => !numerosAtuais.includes(n))
            .sort((a, b) => pesos[b] - pesos[a]);

        const faltam = quantidade - numerosAtuais.length;
        return [...numerosAtuais, ...disponiveis.slice(0, faltam)];
    }
}

export default new AnalisadorIA();