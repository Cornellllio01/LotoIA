import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/Colors';
import EstatisticasCard from '../../components/EstatisticasCard';
import NumerosBola from '../../components/NumerosBola';
import ResultadosAPI from '../../services/ResultadosAPI';
import EstatisticasService from '../../services/EstatisticasService';
import { formatarConcurso, formatarData } from '../../utils/formatadores';

export default function HomeScreen() {
    const router = useRouter();
    const colors = Colors.dark;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [ultimoResultado, setUltimoResultado] = useState(null);
    const [estatisticas, setEstatisticas] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            // Buscar último resultado
            const resultado = await ResultadosAPI.buscarUltimo();
            setUltimoResultado(resultado);

            // Buscar últimos 10 resultados para estatísticas
            const resultados = await ResultadosAPI.buscarUltimos(10);
            const stats = EstatisticasService.calcularEstatisticas(resultados, 7);
            setEstatisticas(stats);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        carregarDados();
    };

    const getMaisQuente = () => {
        if (!estatisticas?.frequencia || estatisticas.frequencia.length === 0) return null;
        return estatisticas.frequencia[0];
    };

    const getMaisAtrasado = () => {
        if (!estatisticas?.atrasos || estatisticas.atrasos.length === 0) return null;
        return estatisticas.atrasos[0];
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    const maisQuente = getMaisQuente();
    const maisAtrasado = getMaisAtrasado();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
        >
            {/* Hero Section */}
            <LinearGradient
                colors={Gradients.purple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                <Text style={styles.heroTitle}>🎰 LotoIA</Text>
                <Text style={styles.heroSubtitle}>Análise Inteligente de Lotofácil</Text>
            </LinearGradient>

            {/* Resumo Estatístico */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Resumo Estatístico</Text>

                <View style={styles.statsGrid}>
                    <EstatisticasCard
                        icon="🎯"
                        titulo="Próximo Concurso"
                        valor={formatarConcurso(ultimoResultado?.concurso + 1 || 3574)}
                        cor="primary"
                    />
                    <EstatisticasCard
                        icon={estatisticas?.ciclos?.isNovo ? '🆕' : '🔄'}
                        titulo="Ciclo"
                        valor={estatisticas?.ciclos?.cicloAtual || 759}
                        subtitulo={estatisticas?.ciclos?.isNovo ? 'NOVO' : 'Continuação'}
                        cor="info"
                    />
                </View>

                <View style={styles.statsGrid}>
                    <EstatisticasCard
                        icon="🔥"
                        titulo="Mais Quente"
                        valor={maisQuente ? `#${maisQuente.numero}` : '-'}
                        subtitulo={maisQuente ? `${maisQuente.ocorrencias}x em 7 jogos` : ''}
                        cor="error"
                    />
                    <EstatisticasCard
                        icon="⏰"
                        titulo="Mais Atrasado"
                        valor={maisAtrasado ? `#${maisAtrasado.numero}` : '-'}
                        subtitulo={maisAtrasado ? `${maisAtrasado.atraso} jogos` : ''}
                        cor="warning"
                    />
                </View>
            </View>

            {/* Ação Rápida */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Ação Rápida</Text>
                <TouchableOpacity
                    style={styles.quickAction}
                    onPress={() => router.push('/gerador')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={Gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quickActionGradient}
                    >
                        <Text style={styles.quickActionIcon}>🤖</Text>
                        <Text style={styles.quickActionText}>GERAR JOGO AGORA</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Último Resultado */}
            {ultimoResultado && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📈 Último Resultado</Text>
                    <View style={styles.resultadoCard}>
                        <View style={styles.resultadoHeader}>
                            <Text style={styles.resultadoConcurso}>
                                {formatarConcurso(ultimoResultado.concurso)}
                            </Text>
                            <Text style={styles.resultadoData}>
                                {formatarData(ultimoResultado.data)}
                            </Text>
                        </View>
                        <View style={styles.numerosContainer}>
                            {ultimoResultado.numeros.map((numero, index) => (
                                <NumerosBola
                                    key={`${numero}-${index}`}
                                    numero={numero}
                                    size="small"
                                    status="neutral"
                                />
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* Navegação Rápida */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🧭 Navegação Rápida</Text>
                <View style={styles.navGrid}>
                    <TouchableOpacity
                        style={styles.navCard}
                        onPress={() => router.push('/estatisticas')}
                    >
                        <Text style={styles.navIcon}>📊</Text>
                        <Text style={styles.navText}>Estatísticas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navCard}
                        onPress={() => router.push('/historico')}
                    >
                        <Text style={styles.navIcon}>📈</Text>
                        <Text style={styles.navText}>Histórico</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    loadingText: {
        color: Colors.dark.textSecondary,
        marginTop: 12,
        fontSize: 14,
    },
    hero: {
        padding: 32,
        borderRadius: 20,
        marginBottom: 24,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    quickAction: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    quickActionGradient: {
        padding: 20,
        alignItems: 'center',
        gap: 8,
    },
    quickActionIcon: {
        fontSize: 32,
    },
    quickActionText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultadoCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    resultadoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    resultadoConcurso: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultadoData: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    numerosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    navGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    navCard: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    navIcon: {
        fontSize: 32,
    },
    navText: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
    },
});
