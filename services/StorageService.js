import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    RESULTADOS: '@loto_ia_resultados',
    JOGOS_GERADOS: '@loto_ia_jogos_gerados',
    PREFERENCIAS: '@loto_ia_preferencias',
    ESTATISTICAS: '@loto_ia_estatisticas',
};

class StorageService {
    // ====================================
    // RESULTADOS
    // ====================================
    async salvarResultados(resultados) {
        try {
            await AsyncStorage.setItem(KEYS.RESULTADOS, JSON.stringify(resultados));
            return true;
        } catch (error) {
            console.error('Erro ao salvar resultados:', error);
            return false;
        }
    }

    async carregarResultados() {
        try {
            const data = await AsyncStorage.getItem(KEYS.RESULTADOS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao carregar resultados:', error);
            return [];
        }
    }

    // ====================================
    // JOGOS GERADOS
    // ====================================
    async salvarJogo(jogo) {
        try {
            const jogos = await this.carregarJogosGerados();
            jogos.unshift({ ...jogo, id: Date.now().toString() });

            // Manter apenas os últimos 50 jogos
            const jogosLimitados = jogos.slice(0, 50);

            await AsyncStorage.setItem(KEYS.JOGOS_GERADOS, JSON.stringify(jogosLimitados));
            return true;
        } catch (error) {
            console.error('Erro ao salvar jogo:', error);
            return false;
        }
    }

    async carregarJogosGerados() {
        try {
            const data = await AsyncStorage.getItem(KEYS.JOGOS_GERADOS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao carregar jogos gerados:', error);
            return [];
        }
    }

    async deletarJogo(jogoId) {
        try {
            const jogos = await this.carregarJogosGerados();
            const jogosFiltrados = jogos.filter(j => j.id !== jogoId);
            await AsyncStorage.setItem(KEYS.JOGOS_GERADOS, JSON.stringify(jogosFiltrados));
            return true;
        } catch (error) {
            console.error('Erro ao deletar jogo:', error);
            return false;
        }
    }

    // ====================================
    // PREFERÊNCIAS
    // ====================================
    async salvarPreferencias(preferencias) {
        try {
            await AsyncStorage.setItem(KEYS.PREFERENCIAS, JSON.stringify(preferencias));
            return true;
        } catch (error) {
            console.error('Erro ao salvar preferências:', error);
            return false;
        }
    }

    async carregarPreferencias() {
        try {
            const data = await AsyncStorage.getItem(KEYS.PREFERENCIAS);
            return data ? JSON.parse(data) : {
                modoAnalise: 'balanceado',
                tema: 'dark',
                notificacoes: true,
            };
        } catch (error) {
            console.error('Erro ao carregar preferências:', error);
            return {
                modoAnalise: 'balanceado',
                tema: 'dark',
                notificacoes: true,
            };
        }
    }

    // ====================================
    // ESTATÍSTICAS CACHE
    // ====================================
    async salvarEstatisticas(estatisticas) {
        try {
            await AsyncStorage.setItem(KEYS.ESTATISTICAS, JSON.stringify({
                data: estatisticas,
                timestamp: Date.now(),
            }));
            return true;
        } catch (error) {
            console.error('Erro ao salvar estatísticas:', error);
            return false;
        }
    }

    async carregarEstatisticas() {
        try {
            const data = await AsyncStorage.getItem(KEYS.ESTATISTICAS);
            if (!data) return null;

            const { data: estatisticas, timestamp } = JSON.parse(data);

            // Cache válido por 1 hora
            const umaHora = 60 * 60 * 1000;
            if (Date.now() - timestamp > umaHora) {
                return null; // Cache expirado
            }

            return estatisticas;
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            return null;
        }
    }

    // ====================================
    // LIMPAR TUDO
    // ====================================
    async limparTudo() {
        try {
            await AsyncStorage.multiRemove([
                KEYS.RESULTADOS,
                KEYS.JOGOS_GERADOS,
                KEYS.PREFERENCIAS,
                KEYS.ESTATISTICAS,
            ]);
            return true;
        } catch (error) {
            console.error('Erro ao limpar storage:', error);
            return false;
        }
    }
}

export default new StorageService();
