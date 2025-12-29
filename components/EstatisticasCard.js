import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

export default function EstatisticasCard({ icon, titulo, valor, subtitulo, cor = 'primary' }) {
    const colors = Colors.dark;

    const getGradient = () => {
        switch (cor) {
            case 'success':
                return [colors.success, '#059669'];
            case 'warning':
                return [colors.warning, '#D97706'];
            case 'error':
                return [colors.error, '#DC2626'];
            case 'info':
                return [colors.info, '#2563EB'];
            default:
                return [colors.primary, colors.secondary];
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={getGradient()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <Text style={styles.icon}>{icon}</Text>
                <View style={styles.content}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.valor}>{valor}</Text>
                    {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 150,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    gradient: {
        padding: 16,
        minHeight: 120,
        justifyContent: 'space-between',
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    content: {
        gap: 4,
    },
    titulo: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    valor: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitulo: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
    },
});
