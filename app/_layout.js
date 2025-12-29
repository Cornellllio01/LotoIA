import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
    const colors = Colors.dark;

    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="resultados/[id]"
                    options={{
                        title: 'Detalhes do Resultado',
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="resultados/comparar"
                    options={{
                        title: 'Comparar Jogos',
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </>
    );
}
