import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function CompararScreen() {
    const colors = Colors.dark;

    return (
        <>
            <Stack.Screen options={{ title: 'Comparar Jogos' }} />
            <View style={styles.container}>
                <Text style={styles.text}>🔄 Comparar Jogos</Text>
                <Text style={styles.subtitle}>Em breve...</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
    },
});
