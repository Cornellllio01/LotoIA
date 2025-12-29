import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';

export default function AnaliseDetalhada({ explicacao }) {
    const [expandedSections, setExpandedSections] = useState(new Set([0])); // Primeira seção expandida por padrão
    const colors = Colors.dark;

    const toggleSection = (index) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSections(newExpanded);
    };

    if (!explicacao || !explicacao.sections) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>{explicacao.titulo}</Text>

            <ScrollView style={styles.sectionsContainer} showsVerticalScrollIndicator={false}>
                {explicacao.sections.map((section, index) => {
                    const isExpanded = expandedSections.has(index);

                    return (
                        <View key={index} style={styles.section}>
                            <TouchableOpacity
                                style={styles.sectionHeader}
                                onPress={() => toggleSection(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.sectionHeaderLeft}>
                                    <Text style={styles.sectionIcon}>{section.icon}</Text>
                                    <Text style={styles.sectionTitulo}>{section.titulo}</Text>
                                </View>
                                <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text>
                            </TouchableOpacity>

                            {isExpanded && (
                                <View style={styles.sectionContent}>
                                    <Text style={styles.sectionTexto}>{section.texto}</Text>
                                    {section.numeros && section.numeros.length > 0 && (
                                        <View style={styles.numerosContainer}>
                                            {section.numeros.map((num, idx) => (
                                                <View key={idx} style={styles.numeroChip}>
                                                    <Text style={styles.numeroChipText}>{num}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
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
    titulo: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionsContainer: {
        maxHeight: 400,
    },
    section: {
        marginBottom: 12,
        backgroundColor: Colors.dark.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    sectionIcon: {
        fontSize: 20,
    },
    sectionTitulo: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    chevron: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    sectionContent: {
        padding: 12,
        paddingTop: 0,
        gap: 8,
    },
    sectionTexto: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },
    numerosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 8,
    },
    numeroChip: {
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    numeroChipText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
});
