import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import NumerosBola from '../../components/NumerosBola';
import ResultadosAPI from '../../services/ResultadosAPI';
import { formatarConcurso, formatarData, formatarMoedaCompacta } from '../../utils/formatadores';

export default function HistoricoScreen() {
    const router = useRouter();
    const colors = Colors.dark;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        carregarResultados();
    }, []);

    const carregarResultados = async () => {
        try {
            const data = await ResultadosAPI.buscarUltimos(20);
            setResultados(data);
        } catch (error) {
            console.error('Erro ao carregar resultados:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        carregarResultados();
    };

    const verDetalhes = (resultado) => {
        router.push(`/resultados/${resultado.concurso}`);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando histórico...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📈 Últimos Resultados</Text>
                <Text style={styles.headerSubtitle}>
                    {resultados.length} concursos carregados
                </Text>
            </View>

            {/* Lista de Resultados */}
            {resultados.map((resultado) => {
                const premio15 = resultado.premiacoes?.find(p => p.acertos === 15);

                return (
                    <TouchableOpacity
                        key={resultado.concurso}
                        style={styles.resultadoCard}
                        onPress={() => verDetalhes(resultado)}
                        activeOpacity={0.7}
                    >
                        {/* Header do Card */}
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.concurso}>
                                    {formatarConcurso(resultado.concurso)}
                                </Text>
                                <Text style={styles.data}>
                                    {formatarData(resultado.data)}
                                </Text>
                            </View>

                            {resultado.acumulado && (
                                <View style={styles.acumuladoBadge}>
                                    <Text style={styles.acumuladoText}>ACUMULOU</Text>
                                </View>
                            )}
                        </View>

                        {/* Números */}
                        <View style={styles.numerosContainer}>
                            {resultado.numeros.map((numero, index) => (
                                <NumerosBola
                                    key={`${numero}-${index}`}
                                    numero={numero}
                                    size="small"
                                    status="neutral"
                                />
                            ))}
                        </View>

                        {/* Prêmio */}
                        {premio15 && (
                            <View style={styles.premioContainer}>
                                <View style={styles.premioInfo}>
                                    <Text style={styles.premioLabel}>15 acertos</Text>
                                    <Text style={styles.premioGanhadores}>
                                        {premio15.ganhadores} {premio15.ganhadores === 1 ? 'ganhador' : 'ganhadores'}
                                    </Text>
                                </View>
                                <Text style={styles.premioValor}>
                                    {formatarMoedaCompacta(premio15.valorPremio)}
                                </Text>
                            </View>
                        )}

                        {/* Ver Detalhes */}
                        <View style={styles.cardFooter}>
                            <Text style={styles.verDetalhes}>Ver detalhes →</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}

            {/* Empty State */}
            {resultados.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
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
    header: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    resultadoCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    concurso: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 2,
    },
    data: {
        fontSize: 13,
        color: Colors.dark.textSecondary,
    },
    acumuladoBadge: {
        backgroundColor: Colors.dark.error,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    acumuladoText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    numerosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    premioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        marginBottom: 8,
    },
    premioInfo: {
        gap: 2,
    },
    premioLabel: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
        textTransform: 'uppercase',
    },
    premioGanhadores: {
        fontSize: 13,
        color: Colors.dark.text,
    },
    premioValor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.success,
    },
    cardFooter: {
        alignItems: 'flex-end',
    },
    verDetalhes: {
        fontSize: 13,
        color: Colors.dark.primary,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
});
