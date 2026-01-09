import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Gradients } from '../../constants/Colors';
import { MODOS_ANALISE } from '../../constants/Numeros';
import AnalisadorIA from '../../services/AnalisadorIA';
import EstatisticasService from '../../services/EstatisticasService';
import ResultadosAPI from '../../services/ResultadosAPI';
import StorageService from '../../services/StorageService';
import JogoCard from '../../components/JogoCard';
import AnaliseDetalhada from '../../components/AnaliseDetalhada';

export default function GeradorScreen() {
    const colors = Colors.dark;

    const [loading, setLoading] = useState(false);
    const [modoSelecionado, setModoSelecionado] = useState('balanceado');
    const [jogoGerado, setJogoGerado] = useState(null);
    const [estatisticas, setEstatisticas] = useState(null);

    useEffect(() => {
        carregarEstatisticas();
    }, []);

    const carregarEstatisticas = async () => {
        try {
            const resultados = await ResultadosAPI.buscarUltimos(10);
            const stats = EstatisticasService.calcularEstatisticas(resultados, 10);
            setEstatisticas(stats);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const gerarJogo = async () => {
        if (!estatisticas) {
            Alert.alert('Erro', 'Aguarde o carregamento das estatísticas');
            return;
        }

        setLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        try {
            // Simular processamento (para dar sensação de IA trabalhando)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const jogo = AnalisadorIA.gerarJogo(estatisticas, modoSelecionado, 15);
            setJogoGerado(jogo);

            // Salvar jogo gerado
            await StorageService.salvarJogo(jogo);

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Erro ao gerar jogo:', error);
            Alert.alert('Erro', 'Não foi possível gerar o jogo');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setLoading(false);
        }
    };

    const selecionarModo = (modo) => {
        setModoSelecionado(modo);
        Haptics.selectionAsync();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Seleção de Modo */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Modo de Análise</Text>
                <Text style={styles.sectionSubtitle}>
                    Escolha a estratégia de geração do jogo
                </Text>

                <View style={styles.modosContainer}>
                    {Object.values(MODOS_ANALISE).map((modo) => {
                        const isSelected = modoSelecionado === modo.id;

                        return (
                            <TouchableOpacity
                                key={modo.id}
                                style={[
                                    styles.modoCard,
                                    isSelected && styles.modoCardSelected,
                                ]}
                                onPress={() => selecionarModo(modo.id)}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={isSelected ? Gradients.primary : [colors.card, colors.card]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.modoGradient}
                                >
                                    <Text style={styles.modoIcon}>{modo.icon}</Text>
                                    <Text style={[
                                        styles.modoNome,
                                        isSelected && styles.modoNomeSelected
                                    ]}>
                                        {modo.nome}
                                    </Text>
                                    <Text style={[
                                        styles.modoDescricao,
                                        isSelected && styles.modoDescricaoSelected
                                    ]}>
                                        {modo.descricao}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Botão Gerar */}
            <TouchableOpacity
                style={styles.gerarButton}
                onPress={gerarJogo}
                disabled={loading || !estatisticas}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={loading ? [colors.border, colors.border] : Gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gerarGradient}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator color="#FFFFFF" size="small" />
                            <Text style={styles.gerarText}>Gerando...</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.gerarIcon}>🤖</Text>
                            <Text style={styles.gerarText}>GERAR JOGO INTELIGENTE</Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>

            {/* Jogo Gerado */}
            {jogoGerado && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ Jogo Gerado</Text>
                    <JogoCard jogo={jogoGerado} />
                </View>
            )}

            {/* Análise Detalhada */}
            {jogoGerado && jogoGerado.explicacao && (
                <View style={styles.section}>
                    <AnaliseDetalhada explicacao={jogoGerado.explicacao} />
                </View>
            )}

            {/* Dicas */}
            {!jogoGerado && (
                <View style={styles.section}>
                    <View style={styles.dicasCard}>
                        <Text style={styles.dicasIcon}>💡</Text>
                        <Text style={styles.dicasTitle}>Dicas de Uso</Text>
                        <View style={styles.dicasList}>
                            <Text style={styles.dicaItem}>
                                • <Text style={styles.dicaBold}>Balanceado</Text>: Melhor opção para iniciantes
                            </Text>
                            <Text style={styles.dicaItem}>
                                • <Text style={styles.dicaBold}>Agressivo</Text>: Foca em números quentes recentes
                            </Text>
                            <Text style={styles.dicaItem}>
                                • <Text style={styles.dicaBold}>Conservador</Text>: Baseado em histórico completo
                            </Text>
                            <Text style={styles.dicaItem}>
                                • <Text style={styles.dicaBold}>Contrarian</Text>: Aposta em números atrasados
                            </Text>
                            <Text style={styles.dicaItem}>
                                • <Text style={styles.dicaBold}>IA Avançada</Text>: Algoritmo mais sofisticado
                            </Text>
                        </View>
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
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 16,
    },
    modosContainer: {
        gap: 12,
    },
    modoCard: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: Colors.dark.border,
    },
    modoCardSelected: {
        borderColor: Colors.dark.primary,
    },
    modoGradient: {
        padding: 16,
    },
    modoIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    modoNome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    modoNomeSelected: {
        color: '#FFFFFF',
    },
    modoDescricao: {
        fontSize: 13,
        color: Colors.dark.textSecondary,
        lineHeight: 18,
    },
    modoDescricaoSelected: {
        color: 'rgba(255, 255, 255, 0.9)',
    },
    gerarButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    gerarGradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    gerarIcon: {
        fontSize: 28,
    },
    gerarText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dicasCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    dicasIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    dicasTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 12,
    },
    dicasList: {
        gap: 8,
    },
    dicaItem: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        lineHeight: 20,
    },
    dicaBold: {
        fontWeight: '600',
        color: Colors.dark.text,
    },
});
