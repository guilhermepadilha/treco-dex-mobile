import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Placeholder esquelético temporário para a tela de listagem (Pokédex Grid).
 * A implementação completa será feita na tarefa T016.
 */
export default function IndexTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grade de Trecos</Text>
      <Text style={styles.subtitle}>
        A listagem Pokédex completa de seus habitats e trecos será exibida aqui.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64FFDA',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8892B0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
