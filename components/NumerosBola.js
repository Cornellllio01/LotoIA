import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/Colors';
import { formatarNumero } from '../utils/formatadores';
import { ehPrimo, ehFibonacci } from '../utils/validadores';

export default function NumerosBola({
    numero,
    status = 'neutral',
    size = 'medium',
    onPress,
    selected = false,
    showBadges = false,
}) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const getSize = () => {
        switch (size) {
            case 'small': return 36;
            case 'large': return 56;
            default: return 46;
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small': return 14;
            case 'large': return 22;
            default: return 18;
        }
    };

    const getGradient = () => {
        const colors = Colors.dark;

        if (selected) {
            return Gradients.primary;
        }

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

    const ballSize = getSize();
    const fontSize = getFontSize();

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress}
            activeOpacity={0.8}
        >
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                    colors={getGradient()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.ball,
                        {
                            width: ballSize,
                            height: ballSize,
                            borderRadius: ballSize / 2,
                        },
                        selected && styles.selected,
                    ]}
                >
                    <Text style={[styles.number, { fontSize }]}>
                        {formatarNumero(numero, 2)}
                    </Text>
                </LinearGradient>

                {showBadges && (
                    <View style={styles.badges}>
                        {ehPrimo(numero) && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>P</Text>
                            </View>
                        )}
                        {ehFibonacci(numero) && (
                            <View style={[styles.badge, styles.badgeFib]}>
                                <Text style={styles.badgeText}>F</Text>
                            </View>
                        )}
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    ball: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    selected: {
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    number: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    badges: {
        position: 'absolute',
        top: -4,
        right: -4,
        flexDirection: 'row',
        gap: 2,
    },
    badge: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    badgeFib: {
        backgroundColor: '#F59E0B',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
