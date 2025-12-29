import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Colors, Gradients } from '../constants/Colors';
import { formatarDataRelativa, formatarScore } from '../utils/formatadores';
import NumerosBola from './NumerosBola';

export default function JogoCard({ jogo, onPress, onDelete }) {
    const colors = Colors.dark;

    const handleCopy = async () => {
        const texto = jogo.numeros.join(' - ');
        await Clipboard.setStringAsync(texto);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Aqui você pode adicionar um Toast/Snackbar
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `LotoIA 🎰\n\nJogo gerado: ${jogo.numeros.join(' - ')}\nModo: ${jogo.modo}\nQualidade: ${jogo.metricas.qualidade.nivel} (${jogo.score}/100)\n\nGerado em ${formatarDataRelativa(jogo.dataGeracao)}`,
            });
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
        }
    };

    const getModoIcon = () => {
        const icons = {
            balanceado: '⚖️',
            agressivo: '🔥',
            conservador: '🛡️',
            contrarian: '🔄',
            inteligente: '🤖',
        };
        return icons[jogo.modo] || '🎯';
    };

    const getQualidadeColor = () => {
        const score = jogo.metricas.qualidade.score;
        if (score >= 80) return colors.success;
        if (score >= 65) return colors.info;
        if (score >= 50) return colors.warning;
        return colors.error;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={[colors.card, colors.surface]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.modoContainer}>
                        <Text style={styles.modoIcon}>{getModoIcon()}</Text>
                        <Text style={styles.modoText}>{jogo.modo}</Text>
                    </View>
                    <View style={[styles.scoreContainer, { backgroundColor: getQualidadeColor() }]}>
                        <Text style={styles.scoreText}>{formatarScore(jogo.score)}</Text>
                    </View>
                </View>

                {/* Números */}
                <View style={styles.numerosContainer}>
                    {jogo.numeros.map((numero, index) => (
                        <NumerosBola
                            key={`${numero}-${index}`}
                            numero={numero}
                            size="small"
                            status="neutral"
                        />
                    ))}
                </View>

                {/* Métricas */}
                <View style={styles.metricas}>
                    <View style={styles.metricaItem}>
                        <Text style={styles.metricaLabel}>Par/Ímpar</Text>
                        <Text style={styles.metricaValue}>
                            {jogo.metricas.pares}/{jogo.metricas.impares}
                        </Text>
                    </View>
                    <View style={styles.metricaItem}>
                        <Text style={styles.metricaLabel}>Primos</Text>
                        <Text style={styles.metricaValue}>{jogo.metricas.primos}</Text>
                    </View>
                    <View style={styles.metricaItem}>
                        <Text style={styles.metricaLabel}>Soma</Text>
                        <Text style={styles.metricaValue}>{jogo.metricas.soma}</Text>
                    </View>
                    <View style={styles.metricaItem}>
                        <Text style={styles.metricaLabel}>Sequências</Text>
                        <Text style={styles.metricaValue}>{jogo.metricas.sequencias}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.dataText}>
                        {formatarDataRelativa(jogo.dataGeracao)}
                    </Text>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
                            <Text style={styles.actionText}>📋 Copiar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                            <Text style={styles.actionText}>📤 Compartilhar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        borderRadius: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modoIcon: {
        fontSize: 20,
    },
    modoText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    scoreContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    scoreText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    numerosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    metricas: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.dark.border,
        marginBottom: 12,
    },
    metricaItem: {
        alignItems: 'center',
    },
    metricaLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
        marginBottom: 4,
    },
    metricaValue: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dataText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.dark.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    actionText: {
        color: Colors.dark.text,
        fontSize: 12,
    },
});
