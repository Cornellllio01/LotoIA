import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');
const BAR_WIDTH = (width - 80) / 25; // Espaço para 25 números

export default function GraficoFrequencia({ frequencia, maxOcorrencias }) {
    const colors = Colors.dark;

    const getBarColor = (status) => {
        switch (status) {
            case 'hot':
                return [colors.hot, '#DC2626'];
            case 'warm':
                return [colors.warning, '#F97316'];
            case 'cool':
                return [colors.info, '#2563EB'];
            case 'cold':
                return [colors.cold, '#4338CA'];
            default:
                return [colors.primary, colors.secondary];
        }
    };

    const getBarHeight = (ocorrencias) => {
        if (maxOcorrencias === 0) return 0;
        const percentage = (ocorrencias / maxOcorrencias) * 100;
        return Math.max(percentage, 5); // Mínimo 5% para visibilidade
    };

    return (
        <View style={styles.container}>
            <View style={styles.chart}>
                {frequencia.map((item) => {
                    const barHeight = getBarHeight(item.ocorrencias);

                    return (
                        <View key={item.numero} style={styles.barContainer}>
                            <View style={[styles.barWrapper, { height: 120 }]}>
                                <LinearGradient
                                    colors={getBarColor(item.status)}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 0, y: 0 }}
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${barHeight}%`,
                                            width: BAR_WIDTH - 2,
                                        },
                                    ]}
                                >
                                    {item.ocorrencias > 0 && (
                                        <Text style={styles.barValue}>{item.ocorrencias}</Text>
                                    )}
                                </LinearGradient>
                            </View>
                            <Text style={styles.barLabel}>{item.numero}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    barContainer: {
        alignItems: 'center',
    },
    barWrapper: {
        justifyContent: 'flex-end',
        marginBottom: 4,
    },
    bar: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 4,
    },
    barValue: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    barLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 10,
        fontWeight: '600',
    },
});
