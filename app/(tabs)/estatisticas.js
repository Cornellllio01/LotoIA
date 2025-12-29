import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import EstatisticasCard from '../../components/EstatisticasCard';
import GraficoFrequencia from '../../components/GraficoFrequencia';
import NumerosBola from '../../components/NumerosBola';
import ResultadosAPI from '../../services/ResultadosAPI';
import EstatisticasService from '../../services/EstatisticasService';

export default function EstatisticasScreen() {
    const colors = Colors.dark;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [estatisticas, setEstatisticas] = useState(null);

    useEffect(() => {
        carregarEstatisticas();
    }, []);

    const carregarEstatisticas = async () => {
        try {
            const resultados = await ResultadosAPI.buscarUltimos(10);
            const stats = EstatisticasService.calcularEstatisticas(resultados, 7);
            setEstatisticas(stats);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        carregarEstatisticas();
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando estatísticas...</Text>
            </View>
        );
    }

    if (!estatisticas) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Erro ao carregar estatísticas</Text>
            </View>
        );
    }

    const maxOcorrencias = Math.max(...estatisticas.frequencia.map(f => f.ocorrencias));
    const top5Quentes = estatisticas.frequencia.slice(0, 5);
    const top5Frios = [...estatisticas.frequencia].reverse().slice(0, 5);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
        >
            {/* Resumo Geral */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Resumo Geral</Text>
                <View style={styles.statsGrid}>
                    <EstatisticasCard
                        icon="🎯"
                        titulo="Total Concursos"
                        valor={estatisticas.totalConcursos.toString()}
                        cor="primary"
                    />
                    <EstatisticasCard
                        icon="📈"
                        titulo="Último Concurso"
                        valor={`#${estatisticas.ultimoConcurso}`}
                        cor="info"
                    />
                </View>
            </View>

            {/* Gráfico de Frequência */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Frequência (Últimos 7 Jogos)</Text>
                <GraficoFrequencia
                    frequencia={estatisticas.frequencia}
                    maxOcorrencias={maxOcorrencias}
                />
            </View>

            {/* Top 5 Quentes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔥 Top 5 Números Quentes</Text>
                <View style={styles.topCard}>
                    {top5Quentes.map((item, index) => (
                        <View key={item.numero} style={styles.topItem}>
                            <Text style={styles.topRank}>#{index + 1}</Text>
                            <NumerosBola numero={item.numero} size="small" status={item.status} />
                            <View style={styles.topInfo}>
                                <Text style={styles.topOcorrencias}>{item.ocorrencias}x</Text>
                                <Text style={styles.topPercentual}>{item.percentual.toFixed(0)}%</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Top 5 Frios */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🧊 Top 5 Números Frios</Text>
                <View style={styles.topCard}>
                    {top5Frios.map((item, index) => (
                        <View key={item.numero} style={styles.topItem}>
                            <Text style={styles.topRank}>#{index + 1}</Text>
                            <NumerosBola numero={item.numero} size="small" status={item.status} />
                            <View style={styles.topInfo}>
                                <Text style={styles.topOcorrencias}>{item.ocorrencias}x</Text>
                                <Text style={styles.topPercentual}>{item.percentual.toFixed(0)}%</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Distribuição */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📈 Distribuição</Text>
                <View style={styles.statsGrid}>
                    <EstatisticasCard
                        icon="⬇️"
                        titulo="Baixos (1-8)"
                        valor={estatisticas.distribuicao.baixos.media}
                        subtitulo={`${estatisticas.distribuicao.baixos.percentual}%`}
                        cor="info"
                    />
                    <EstatisticasCard
                        icon="➡️"
                        titulo="Médios (9-17)"
                        valor={estatisticas.distribuicao.medios.media}
                        subtitulo={`${estatisticas.distribuicao.medios.percentual}%`}
                        cor="warning"
                    />
                </View>
                <View style={styles.statsGrid}>
                    <EstatisticasCard
                        icon="⬆️"
                        titulo="Altos (18-25)"
                        valor={estatisticas.distribuicao.altos.media}
                        subtitulo={`${estatisticas.distribuicao.altos.percentual}%`}
                        cor="error"
                    />
                    <EstatisticasCard
                        icon="🔢"
                        titulo="Sequências"
                        valor={estatisticas.sequencias.media}
                        subtitulo="Média por jogo"
                        cor="success"
                    />
                </View>
            </View>

            {/* Pares Frequentes */}
            {estatisticas.pares && estatisticas.pares.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👥 Pares Mais Frequentes</Text>
                    <View style={styles.paresCard}>
                        {estatisticas.pares.slice(0, 5).map((par, index) => (
                            <View key={index} style={styles.parItem}>
                                <View style={styles.parNumeros}>
                                    <NumerosBola numero={par.numeros[0]} size="small" />
                                    <Text style={styles.parSeparador}>+</Text>
                                    <NumerosBola numero={par.numeros[1]} size="small" />
                                </View>
                                <Text style={styles.parOcorrencias}>{par.ocorrencias}x</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
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
    errorText: {
        color: Colors.dark.error,
        fontSize: 16,
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
    topCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        gap: 12,
    },
    topItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topRank: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontWeight: 'bold',
        width: 32,
    },
    topInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topOcorrencias: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
    topPercentual: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    paresCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        gap: 12,
    },
    parItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    parNumeros: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    parSeparador: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    parOcorrencias: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
