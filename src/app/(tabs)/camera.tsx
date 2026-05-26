import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Placeholder esquelético temporário para a tela de busca visual / câmera.
 * A implementação completa será feita na tarefa T021.
 */
export default function CameraTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner de Trecos</Text>
      <Text style={styles.subtitle}>
        O scanner conversacional integrado com IA e câmera nativa será exibido aqui.
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
