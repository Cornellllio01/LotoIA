import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import NumerosBola from '../../components/NumerosBola';
import ResultadosAPI from '../../services/ResultadosAPI';
import { formatarConcurso, formatarData, formatarMoeda } from '../../utils/formatadores';

export default function ResultadoDetalhesScreen() {
    const { id } = useLocalSearchParams();
    const colors = Colors.dark;

    const [loading, setLoading] = useState(true);
    const [resultado, setResultado] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (id) {
            carregarDetalhes();
        }
    }, [id]);

    const carregarDetalhes = async () => {
        try {
            setLoading(true);
            const data = await ResultadosAPI.buscarPorConcurso(parseInt(id));
            if (data) {
                setResultado(data);
            } else {
                setErro('Resultado não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes do concurso:', error);
            setErro('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </View>
        );
    }

    if (erro || !resultado) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>{erro || 'Algo deu errado'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: formatarConcurso(resultado.concurso),
                headerTitleStyle: { color: colors.text },
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.primary
            }} />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.concurso}>{formatarConcurso(resultado.concurso)}</Text>
                    <Text style={styles.data}>{formatarData(resultado.data)}</Text>

                    {resultado.acumulado && (
                        <View style={styles.acumuladoBadge}>
                            <Text style={styles.acumuladoText}>ACUMULOU!</Text>
                            {resultado.valorAcumulado > 0 && (
                                <Text style={styles.acumuladoValor}>
                                    {formatarMoeda(resultado.valorAcumulado)}
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Números Sorteados */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎯 Números Sorteados</Text>
                    <View style={styles.numerosContainer}>
                        {resultado.numeros.map((numero, index) => (
                            <NumerosBola
                                key={`${numero}-${index}`}
                                numero={numero}
                                size="medium"
                                status="neutral"
                            />
                        ))}
                    </View>
                </View>

                {/* Premiações */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 Premiações</Text>
                    {resultado.premiacoes.map((premiacao) => (
                        <View key={premiacao.acertos} style={styles.premiacaoCard}>
                            <View style={styles.premiacaoHeader}>
                                <Text style={styles.premiacaoAcertos}>
                                    {premiacao.acertos} acertos
                                </Text>
                                <Text style={styles.premiacaoValor}>
                                    {formatarMoeda(premiacao.valorPremio)}
                                </Text>
                            </View>
                            <Text style={styles.premiacaoGanhadores}>
                                {premiacao.ganhadores.toLocaleString('pt-BR')} {premiacao.ganhadores === 1 ? 'ganhador' : 'ganhadores'}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Info Adicional */}
                {resultado.localSorteio && (
                    <View style={styles.infoAdicional}>
                        <Text style={styles.infoLabel}>Local do Sorteio:</Text>
                        <Text style={styles.infoValue}>{resultado.localSorteio}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
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
        padding: 20,
    },
    loadingText: {
        color: Colors.dark.textSecondary,
        marginTop: 12,
        fontSize: 16,
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 16,
        textAlign: 'center',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        paddingVertical: 24,
        backgroundColor: Colors.dark.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    concurso: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    data: {
        fontSize: 18,
        color: Colors.dark.textSecondary,
    },
    acumuladoBadge: {
        marginTop: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.error,
        alignItems: 'center',
    },
    acumuladoText: {
        color: Colors.dark.error,
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    acumuladoValor: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 4,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 16,
        paddingLeft: 4,
    },
    numerosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
        backgroundColor: Colors.dark.card,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    premiacaoCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    premiacaoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    premiacaoAcertos: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    premiacaoValor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.success,
    },
    premiacaoGanhadores: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
    },
    infoAdicional: {
        marginTop: 8,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    infoLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
    },
    infoValue: {
        color: Colors.dark.text,
        fontSize: 13,
        fontWeight: '500',
    },
});

