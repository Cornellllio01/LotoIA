import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import NumerosBola from '../../components/NumerosBola';
import { formatarConcurso, formatarData, formatarMoeda } from '../../utils/formatadores';

export default function ResultadoDetalhesScreen() {
    const { id } = useLocalSearchParams();
    const colors = Colors.dark;

    // Mock data - em produção, buscar do storage ou API
    const resultado = {
        concurso: parseInt(id),
        data: '28/12/2024',
        numeros: [1, 2, 4, 5, 7, 9, 11, 13, 15, 17, 18, 20, 22, 23, 25],
        premiacoes: [
            { acertos: 15, ganhadores: 2, valorPremio: 850000 },
            { acertos: 14, ganhadores: 458, valorPremio: 1250 },
            { acertos: 13, ganhadores: 12450, valorPremio: 30 },
            { acertos: 12, ganhadores: 98750, valorPremio: 12 },
            { acertos: 11, ganhadores: 325000, valorPremio: 6 },
        ],
        acumulado: false,
    };

    return (
        <>
            <Stack.Screen options={{ title: formatarConcurso(resultado.concurso) }} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.concurso}>{formatarConcurso(resultado.concurso)}</Text>
                    <Text style={styles.data}>{formatarData(resultado.data)}</Text>
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
            </ScrollView>
        </>
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
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 20,
    },
    concurso: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 4,
    },
    data: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
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
    numerosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    premiacaoCard: {
        backgroundColor: Colors.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    premiacaoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
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
});
