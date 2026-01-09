class EstatisticasService {
    // ====================================
    // CALCULAR ESTATÍSTICAS COMPLETAS
    // ====================================
    calcularEstatisticas(resultados, ultimosN = 7) {
        if (!resultados || resultados.length === 0) {
            return this.getEstatisticasPadrao();
        }

        const frequencia = this.calcularFrequencia(resultados, ultimosN);
        const atrasos = this.calcularAtrasos(resultados);
        const quinas = this.analisarQuinas(resultados, ultimosN);
        const paresImpares = this.analisarParesImpares(resultados, ultimosN);
        const quartetos = this.analisarQuartetos(resultados, ultimosN);
        const distribuicao = this.analisarDistribuicao(resultados, ultimosN);
        const sequencias = this.analisarSequencias(resultados, ultimosN);
        const ciclos = this.detectarCiclos(resultados);

        return {
            frequencia,
            atrasos,
            quinas,
            paresImpares,
            quartetos,
            distribuicao,
            sequencias,
            ciclos,
            totalConcursos: ultimosN,
            ultimoConcurso: resultados[0]?.concurso || 0,
            primeiroConcursoAnalizado: resultados[Math.min(ultimosN, resultados.length) - 1]?.concurso || 0,
            ultimoConcursoAnalizado: resultados[0]?.concurso || 0,
        };
    }

    // ====================================
    // FREQUÊNCIA DE NÚMEROS
    // ====================================
    calcularFrequencia(resultados, ultimosN) {
        const frequencia = {};
        const frequenciaTotal = {};

        // Inicializar contadores
        for (let i = 1; i <= 25; i++) {
            frequencia[i] = 0;
            frequenciaTotal[i] = 0;
        }

        // Contar nos últimos N concursos
        const recentes = resultados.slice(0, ultimosN);
        recentes.forEach(resultado => {
            resultado.numeros.forEach(num => {
                frequencia[num]++;
            });
        });

        // Contar no histórico total
        resultados.forEach(resultado => {
            resultado.numeros.forEach(num => {
                frequenciaTotal[num]++;
            });
        });

        // Converter para array e ordenar
        return Object.entries(frequencia)
            .map(([numero, ocorrencias]) => ({
                numero: parseInt(numero),
                ocorrencias,
                ocorrenciasTotal: frequenciaTotal[numero],
                percentual: (ocorrencias / ultimosN) * 100,
                percentualTotal: (frequenciaTotal[numero] / resultados.length) * 100,
                status: this.getStatusFrequencia(ocorrencias, ultimosN),
            }))
            .sort((a, b) => b.ocorrencias - a.ocorrencias);
    }

    getStatusFrequencia(ocorrencias, total) {
        const percentual = (ocorrencias / total) * 100;
        if (percentual >= 70) return 'hot';      // 🔥 Muito quente
        if (percentual >= 50) return 'warm';     // 🟠 Quente
        if (percentual >= 30) return 'neutral';  // 🟣 Neutro
        if (percentual >= 15) return 'cool';     // 🔵 Frio
        return 'cold';                           // 🧊 Muito frio
    }

    // ====================================
    // ATRASOS
    // ====================================
    calcularAtrasos(resultados) {
        const atrasos = {};

        // Inicializar todos os números
        for (let i = 1; i <= 25; i++) {
            atrasos[i] = 0;
        }

        // Calcular atraso (quantos concursos desde última aparição)
        for (const resultado of resultados) {
            resultado.numeros.forEach(num => {
                if (atrasos[num] === 0 || atrasos[num] === undefined) {
                    // Primeira aparição encontrada
                    return;
                }
            });

            // Incrementar atraso para números que não apareceram
            for (let i = 1; i <= 25; i++) {
                if (!resultado.numeros.includes(i)) {
                    atrasos[i]++;
                } else {
                    atrasos[i] = 0; // Resetar atraso
                }
            }
        }

        return Object.entries(atrasos)
            .map(([numero, atraso]) => ({
                numero: parseInt(numero),
                atraso,
                status: this.getStatusAtraso(atraso),
            }))
            .sort((a, b) => b.atraso - a.atraso);
    }

    getStatusAtraso(atraso) {
        if (atraso >= 5) return 'muito_atrasado';
        if (atraso >= 3) return 'atrasado';
        if (atraso >= 1) return 'normal';
        return 'recente';
    }

    // ====================================
    // ====================================
    // ANÁLISE DE PARES VS ÍMPARES (EVEN/ODD)
    // ====================================
    analisarParesImpares(resultados, ultimosN) {
        const recentes = resultados.slice(0, ultimosN);
        let totalPares = 0;
        let totalImpares = 0;

        recentes.forEach(resultado => {
            const pares = resultado.numeros.filter(n => n % 2 === 0).length;
            totalPares += pares;
            totalImpares += (resultado.numeros.length - pares);
        });

        const total = totalPares + totalImpares;

        return {
            pares: {
                total: totalPares,
                media: (totalPares / ultimosN).toFixed(1),
                percentual: ((totalPares / total) * 100).toFixed(1),
            },
            impares: {
                total: totalImpares,
                media: (totalImpares / ultimosN).toFixed(1),
                percentual: ((totalImpares / total) * 100).toFixed(1),
            },
        };
    }

    // ====================================
    // ANÁLISE DE QUINAS (5 NÚMEROS)
    // ====================================
    analisarQuinas(resultados, ultimosN) {
        const quinas = {};
        const recentes = resultados.slice(0, ultimosN);

        recentes.forEach(resultado => {
            const numeros = resultado.numeros.sort((a, b) => a - b);

            for (let i = 0; i < numeros.length - 4; i++) {
                for (let j = i + 1; j < numeros.length - 3; j++) {
                    for (let k = j + 1; k < numeros.length - 2; k++) {
                        for (let l = k + 1; l < numeros.length - 1; l++) {
                            for (let m = l + 1; m < numeros.length; m++) {
                                const quinaKey = `${numeros[i]}-${numeros[j]}-${numeros[k]}-${numeros[l]}-${numeros[m]}`;
                                quinas[quinaKey] = (quinas[quinaKey] || 0) + 1;
                            }
                        }
                    }
                }
            }
        });

        return Object.entries(quinas)
            .map(([quina, ocorrencias]) => {
                const nums = quina.split('-').map(n => parseInt(n));
                return {
                    numeros: nums,
                    ocorrencias,
                    percentual: (ocorrencias / ultimosN) * 100,
                };
            })
            .sort((a, b) => b.ocorrencias - a.ocorrencias)
            .slice(0, 20); // Top 20 quinas
    }

    // ====================================
    // ANÁLISE DE DUPLAS (MANTIDA PARA USO INTERNO SE NECESSÁRIO)
    // ====================================
    analisarDuplas(resultados, ultimosN) {
        const duplas = {};
        const recentes = resultados.slice(0, ultimosN);

        recentes.forEach(resultado => {
            const numeros = resultado.numeros.sort((a, b) => a - b);

            for (let i = 0; i < numeros.length; i++) {
                for (let j = i + 1; j < numeros.length; j++) {
                    const par = `${numeros[i]}-${numeros[j]}`;
                    duplas[par] = (duplas[par] || 0) + 1;
                }
            }
        });

        return Object.entries(duplas)
            .map(([par, ocorrencias]) => {
                const [num1, num2] = par.split('-').map(n => parseInt(n));
                return {
                    numeros: [num1, num2],
                    ocorrencias,
                    percentual: (ocorrencias / ultimosN) * 100,
                };
            })
            .sort((a, b) => b.ocorrencias - a.ocorrencias)
            .slice(0, 30);
    }

    // ====================================
    // ANÁLISE DE QUARTETOS (4 NÚMEROS)
    // ====================================
    analisarQuartetos(resultados, ultimosN) {
        const quartetos = {};
        const recentes = resultados.slice(0, ultimosN);

        recentes.forEach(resultado => {
            const numeros = resultado.numeros.sort((a, b) => a - b);

            // Gerar todas as combinações de 4 números
            for (let i = 0; i < numeros.length - 3; i++) {
                for (let j = i + 1; j < numeros.length - 2; j++) {
                    for (let k = j + 1; k < numeros.length - 1; k++) {
                        for (let l = k + 1; l < numeros.length; l++) {
                            const quarteto = `${numeros[i]}-${numeros[j]}-${numeros[k]}-${numeros[l]}`;
                            quartetos[quarteto] = (quartetos[quarteto] || 0) + 1;
                        }
                    }
                }
            }
        });

        return Object.entries(quartetos)
            .map(([quarteto, ocorrencias]) => {
                const nums = quarteto.split('-').map(n => parseInt(n));
                return {
                    numeros: nums,
                    ocorrencias,
                    percentual: (ocorrencias / ultimosN) * 100,
                };
            })
            .sort((a, b) => b.ocorrencias - a.ocorrencias)
            .slice(0, 20); // Top 20 quartetos
    }

    // ====================================
    // DISTRIBUIÇÃO (BAIXOS/MÉDIOS/ALTOS)
    // ====================================
    analisarDistribuicao(resultados, ultimosN) {
        const recentes = resultados.slice(0, ultimosN);
        let totalBaixos = 0;
        let totalMedios = 0;
        let totalAltos = 0;

        recentes.forEach(resultado => {
            const baixos = resultado.numeros.filter(n => n <= 8).length;
            const medios = resultado.numeros.filter(n => n > 8 && n <= 17).length;
            const altos = resultado.numeros.filter(n => n > 17).length;

            totalBaixos += baixos;
            totalMedios += medios;
            totalAltos += altos;
        });

        const total = totalBaixos + totalMedios + totalAltos;

        return {
            baixos: {
                total: totalBaixos,
                media: (totalBaixos / ultimosN).toFixed(1),
                percentual: ((totalBaixos / total) * 100).toFixed(1),
            },
            medios: {
                total: totalMedios,
                media: (totalMedios / ultimosN).toFixed(1),
                percentual: ((totalMedios / total) * 100).toFixed(1),
            },
            altos: {
                total: totalAltos,
                media: (totalAltos / ultimosN).toFixed(1),
                percentual: ((totalAltos / total) * 100).toFixed(1),
            },
        };
    }

    // ====================================
    // ANÁLISE DE SEQUÊNCIAS
    // ====================================
    analisarSequencias(resultados, ultimosN) {
        const recentes = resultados.slice(0, ultimosN);
        let totalSequencias = 0;
        const sequenciasEncontradas = [];

        recentes.forEach(resultado => {
            const numeros = resultado.numeros.sort((a, b) => a - b);
            const sequencias = [];
            let seqAtual = [numeros[0]];

            for (let i = 1; i < numeros.length; i++) {
                if (numeros[i] === numeros[i - 1] + 1) {
                    seqAtual.push(numeros[i]);
                } else {
                    if (seqAtual.length >= 3) {
                        sequencias.push([...seqAtual]);
                        totalSequencias++;
                    }
                    seqAtual = [numeros[i]];
                }
            }

            if (seqAtual.length >= 3) {
                sequencias.push(seqAtual);
                totalSequencias++;
            }

            if (sequencias.length > 0) {
                sequenciasEncontradas.push({
                    concurso: resultado.concurso,
                    sequencias,
                });
            }
        });

        return {
            total: totalSequencias,
            media: (totalSequencias / ultimosN).toFixed(1),
            exemplos: sequenciasEncontradas.slice(0, 5),
        };
    }

    // ====================================
    // DETECTAR CICLOS
    // ====================================
    detectarCiclos(resultados) {
        // Análise simplificada de ciclos
        // Um ciclo é quando um padrão se repete

        if (resultados.length < 2) {
            return {
                cicloAtual: 1,
                isNovo: true,
            };
        }

        const ultimo = resultados[0];
        const penultimo = resultados[1];

        // Verificar se há números repetidos
        const repeticoes = ultimo.numeros.filter(n => penultimo.numeros.includes(n)).length;

        return {
            cicloAtual: resultados.length,
            repeticoes,
            percentualRepeticao: ((repeticoes / 15) * 100).toFixed(1),
            isNovo: repeticoes < 8, // Menos de 8 repetições = ciclo novo
        };
    }

    // ====================================
    // ESTATÍSTICAS PADRÃO (FALLBACK)
    // ====================================
    getEstatisticasPadrao() {
        const frequencia = [];
        for (let i = 1; i <= 25; i++) {
            frequencia.push({
                numero: i,
                ocorrencias: 0,
                ocorrenciasTotal: 0,
                percentual: 0,
                percentualTotal: 0,
                status: 'neutral',
            });
        }

        return {
            frequencia,
            atrasos: [],
            quinas: [],
            paresImpares: {
                pares: { total: 0, media: '0', percentual: '0' },
                impares: { total: 0, media: '0', percentual: '0' },
            },
            quartetos: [],
            distribuicao: {
                baixos: { total: 0, media: '0', percentual: '0' },
                medios: { total: 0, media: '0', percentual: '0' },
                altos: { total: 0, media: '0', percentual: '0' },
            },
            sequencias: { total: 0, media: '0', exemplos: [] },
            ciclos: { cicloAtual: 1, isNovo: true },
            totalConcursos: 0,
            ultimoConcurso: 0,
        };
    }
}

export default new EstatisticasService();
