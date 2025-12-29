import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TabsLayout() {
    const colors = Colors.dark;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 85,
                    paddingBottom: 35,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabBarIcon name="🏠" color={color} />,
                    headerTitle: 'LotoIA 🎰',
                }}
            />
            <Tabs.Screen
                name="gerador"
                options={{
                    title: 'Gerador',
                    tabBarIcon: ({ color }) => <TabBarIcon name="🤖" color={color} />,
                    headerTitle: 'Gerador Inteligente',
                }}
            />
            <Tabs.Screen
                name="estatisticas"
                options={{
                    title: 'Estatísticas',
                    tabBarIcon: ({ color }) => <TabBarIcon name="📊" color={color} />,
                    headerTitle: 'Estatísticas',
                }}
            />
            <Tabs.Screen
                name="historico"
                options={{
                    title: 'Histórico',
                    tabBarIcon: ({ color }) => <TabBarIcon name="📈" color={color} />,
                    headerTitle: 'Histórico',
                }}
            />
        </Tabs>
    );
}

function TabBarIcon({ name, color }) {
    return (
        <Text style={{ fontSize: 24, color, marginTop: -8 }}>
            {name}
        </Text>
    );
}
