import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChatOnboarding } from '../../store/useChatOnboarding';

export default function VisualSearchResultEntry() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    identified: string;
    objectName: string;
    habitatName: string;
    reasoning: string;
    photoUri: string;
    compressedUri: string;
  }>();

  const { startOnboarding } = useChatOnboarding();

  const isIdentified = params.identified === 'true';

  const handleStartOnboarding = () => {
    // Requisito T030: Disparar onboarding conversacional se o objeto for inédito
    if (params.photoUri && params.compressedUri) {
      startOnboarding(params.photoUri, params.compressedUri);
      router.replace('/(tabs)/camera');
    } else {
      router.replace('/(tabs)/camera');
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.replace('/(tabs)/camera')}
        >
          <Ionicons name="close-outline" size={26} color="#64FFDA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRECO-DEX ENTRY</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Visual da foto tirada */}
      <View style={styles.visualCard}>
        {params.photoUri ? (
          <Image source={{ uri: params.photoUri }} style={styles.photo} />
        ) : (
          <Ionicons name="cube-outline" size={64} color="#64FFDA" />
        )}
      </View>

      {isIdentified ? (
        // CASO 1: Objeto Reconhecido (Requisito T027)
        <View style={styles.resultContainer}>
          <View style={styles.identifiedHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#64FFDA" />
            <Text style={styles.identifiedTitle}>TRECO ENCONTRADO!</Text>
          </View>

          <Text style={styles.itemName}>{params.objectName || 'Objeto Identificado'}</Text>

          <View style={styles.habitatCard}>
            <Text style={styles.habitatHeader}>HABITAT DESIGNADO</Text>
            <View style={styles.habitatRow}>
              <Ionicons name="location" size={20} color="#64FFDA" />
              <Text style={styles.habitatName}>{params.habitatName || 'Não especificado'}</Text>
            </View>
          </View>

          <View style={styles.reasoningCard}>
            <Text style={styles.reasoningHeader}>ANÁLISE DE IA MULTIMODAL</Text>
            <Text style={styles.reasoningText}>
              {params.reasoning ||
                'O item corresponde com alto nível de precisão aos metadados geométricos e visuais salvos na Pokédex.'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              router.replace('/(tabs)/');
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-done" size={20} color="#0A192F" />
            <Text style={styles.actionBtnText}>DEVOLVER AO HABITAT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // CASO 2: Objeto Inédito / Desconhecido (Requisito T030)
        <View style={styles.resultContainer}>
          <View style={styles.unidentifiedHeader}>
            <Ionicons name="help-circle" size={28} color="#FFB74D" />
            <Text style={styles.unidentifiedTitle}>TRECO INÉDITO DETECTADO</Text>
          </View>

          <Text style={styles.itemName}>Item Não Catalogado</Text>
          <Text style={styles.unidentifiedSubtitle}>
            A IA analisou esta foto e não encontrou correspondências exatas em seu TrecoDex. Deseja
            iniciar o assistente conversacional para cadastrá-lo agora?
          </Text>

          <TouchableOpacity
            style={[styles.actionBtn, styles.onboardingBtn]}
            onPress={handleStartOnboarding}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles-outline" size={20} color="#0A192F" />
            <Text style={styles.actionBtnText}>INICIAR CADASTRO CHAT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.replace('/(tabs)/camera')}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>VOLTAR E TIRAR OUTRA FOTO</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 44 : 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCD6F6',
    letterSpacing: 2,
  },
  iconButton: {
    padding: 6,
  },
  visualCard: {
    height: 200,
    backgroundColor: '#0c162d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#233554',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  resultContainer: {
    flex: 1,
  },
  identifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  identifiedTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64FFDA',
    letterSpacing: 1,
    marginLeft: 6,
  },
  unidentifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unidentifiedTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFB74D',
    letterSpacing: 1,
    marginLeft: 6,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginBottom: 16,
  },
  habitatCard: {
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#233554',
    marginBottom: 16,
  },
  habitatHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64FFDA',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  habitatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginLeft: 8,
  },
  reasoningCard: {
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#233554',
    marginBottom: 28,
  },
  reasoningHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8892B0',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 13,
    color: '#8892B0',
    lineHeight: 20,
  },
  unidentifiedSubtitle: {
    fontSize: 14,
    color: '#8892B0',
    lineHeight: 22,
    marginBottom: 32,
  },
  actionBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#64FFDA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  onboardingBtn: {
    backgroundColor: '#FFB74D',
    shadowColor: '#FFB74D',
  },
  actionBtnText: {
    color: '#0A192F',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 8,
  },
  cancelBtn: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233554',
  },
  cancelBtnText: {
    color: '#8892B0',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
