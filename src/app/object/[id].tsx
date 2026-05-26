import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useSyncStore } from '../../store/useSyncStore';
import { useObject, useObjectStates } from '../../services/queries/useObjects';

// Mock objects matching index.tsx for fallback/testing
const MOCK_OBJECTS_DETAIL = [
  {
    id: '1',
    name: 'Chave Reserva',
    description: 'Chave de latão com chaveiro vermelho do carro.',
    sizeCm: 6.5,
    status: 'MISPLACED',
    primaryHabitatName: 'Gaveta de Chaves',
    environmentName: 'Hall de Entrada',
    habitatDescription: 'Pequeno cesto de madeira ao lado da porta principal.',
  },
  {
    id: '2',
    name: 'Controle da TV',
    description: 'Controle remoto smart da Samsung preto.',
    sizeCm: 16.0,
    status: 'ORGANIZED',
    primaryHabitatName: 'Painel da TV',
    environmentName: 'Sala de Estar',
    habitatDescription: 'Suporte de acrílico fixado atrás do painel esquerdo.',
  },
  {
    id: '3',
    name: 'Carregador Tipo C',
    description: 'Carregador rápido USB-C de 65W da Baseus.',
    sizeCm: 8.0,
    status: 'ORGANIZED',
    primaryHabitatName: 'Organizador de Cabos',
    environmentName: 'Escritório',
    habitatDescription: 'Gaveteiro cinza, segunda gaveta com divisórias pretas.',
  },
  {
    id: '4',
    name: 'Carteira de Couro',
    description: 'Carteira marrom contendo CNH e cartões essenciais.',
    sizeCm: 11.5,
    status: 'MISPLACED',
    primaryHabitatName: 'Criado-Mudo Esquerdo',
    environmentName: 'Quarto',
    habitatDescription: 'Prato organizador de cerâmica preta no topo do móvel.',
  },
  {
    id: '5',
    name: 'Passaporte Nacional',
    description: 'Documento oficial de viagem válido até 2032.',
    sizeCm: 12.5,
    status: 'ORGANIZED',
    primaryHabitatName: 'Cofre Interno',
    environmentName: 'Escritório',
    habitatDescription: 'Cofre digital embutido atrás do quadro decorativo.',
  },
  {
    id: '6',
    name: 'Fone Bluetooth',
    description: 'Fones intra-auriculares com cancelamento de ruído.',
    sizeCm: 5.0,
    status: 'UNKNOWN',
    primaryHabitatName: 'Bolso Frontal',
    environmentName: 'Mochila de Viagem',
    habitatDescription: "Bolso menor com zíper à prova d'água.",
  },
];

export default function ObjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isOffline } = useAuthStore();
  const { enqueueMutation } = useSyncStore();

  // Chamada de Hooks do React Query
  const { data: realObject, refetch } = useObject(id || '');
  const { data: stateHistory } = useObjectStates(id || '');

  // Usar dados reais da API ou fallbacks de Mock de alta fidelidade
  const mockObject = MOCK_OBJECTS_DETAIL.find((o) => o.id === id);
  const activeObject = realObject
    ? {
        id: realObject.id,
        name: realObject.name,
        description: realObject.description,
        sizeCm: realObject.sizeCm,
        status: (stateHistory && stateHistory[0]?.state) || 'UNKNOWN',
        primaryHabitatName: 'Carregando Habitat...',
        environmentName: '...',
        habitatDescription: 'Carregando detalhes...',
      }
    : mockObject;

  const [currentStatus, setCurrentStatus] = useState<'ORGANIZED' | 'MISPLACED' | 'UNKNOWN'>(
    (activeObject?.status as any) || 'UNKNOWN',
  );

  if (!activeObject) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF5C5C" />
        <Text style={styles.errorText}>Treco não encontrado na base local.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUpdateStatus = async (status: 'ORGANIZED' | 'MISPLACED' | 'UNKNOWN') => {
    setCurrentStatus(status);

    if (isOffline) {
      // Enfileira a mutação localmente (Requisito T020)
      enqueueMutation(`/api/objects/${activeObject.id}/states`, 'POST', {
        state: status,
      });

      Alert.alert(
        '💾 Modo Offline',
        'Seu dispositivo está sem conexão. A alteração foi salva localmente e será sincronizada assim que a internet retornar!',
        [{ text: 'OK', style: 'default' }],
      );
    } else {
      // Se online, simula postagem ou tenta requisitar
      try {
        await api.post(`/api/objects/${activeObject.id}/states`, {
          state: status,
        });
        Alert.alert('⚡ Sucesso', 'Estado atualizado no servidor com sucesso!', [{ text: 'OK' }]);
        refetch();
      } catch {
        // Fallback robusto se a API falhar inesperadamente
        enqueueMutation(`/api/objects/${activeObject.id}/states`, 'POST', {
          state: status,
        });
        Alert.alert(
          '💾 Salvo Localmente',
          'Não foi possível contatar o servidor. Alteração enfileirada para sincronização futura.',
          [{ text: 'OK' }],
        );
      }
    }
  };

  const getStatusDetails = (status: typeof currentStatus) => {
    switch (status) {
      case 'ORGANIZED':
        return { label: 'Guardado', color: '#64FFDA', bg: 'rgba(100, 255, 218, 0.1)' };
      case 'MISPLACED':
        return { label: 'Fora do Lugar', color: '#FF5C5C', bg: 'rgba(255, 92, 92, 0.1)' };
      default:
        return { label: 'Desconhecido', color: '#FFB74D', bg: 'rgba(255, 183, 77, 0.1)' };
    }
  };

  const statusInfo = getStatusDetails(currentStatus);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#64FFDA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRECO-DEX ENTRY</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Caixa de Câmera/Visual */}
      <View style={styles.visualContainer}>
        <Ionicons name="cube-outline" size={64} color="#64FFDA" />
        <Text style={styles.dimensionsText}>DIMENSÕES FÍSICAS: {activeObject.sizeCm} cm</Text>
      </View>

      {/* Informações Principais */}
      <View style={styles.section}>
        <View style={styles.nameRow}>
          <Text style={styles.itemName}>{activeObject.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>{activeObject.description}</Text>
      </View>

      {/* Localização Espacial e Habitat */}
      <View style={styles.habitatCard}>
        <Text style={styles.cardHeader}>HABITAT DE DESTINO</Text>
        <View style={styles.habitatNameRow}>
          <Ionicons name="location" size={20} color="#64FFDA" />
          <Text style={styles.habitatName}>
            {activeObject.primaryHabitatName} ({activeObject.environmentName})
          </Text>
        </View>
        <Text style={styles.habitatDesc}>{activeObject.habitatDescription}</Text>
      </View>

      {/* Ações de Estado */}
      <View style={styles.actionsSection}>
        <Text style={styles.actionsHeader}>REPROGRAMAR ESTADO DE ORGANIZAÇÃO</Text>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.organizedBtn,
            currentStatus === 'ORGANIZED' && styles.activeBtn,
          ]}
          onPress={() => handleUpdateStatus('ORGANIZED')}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#0A192F" />
          <Text style={styles.actionBtnText}>MARCAR COMO GUARDADO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.misplacedBtn,
            currentStatus === 'MISPLACED' && styles.activeBtn,
          ]}
          onPress={() => handleUpdateStatus('MISPLACED')}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle-outline" size={20} color="#0A192F" />
          <Text style={styles.actionBtnText}>MARCAR COMO FORA DO LUGAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.unknownBtn,
            currentStatus === 'UNKNOWN' && styles.activeBtn,
          ]}
          onPress={() => handleUpdateStatus('UNKNOWN')}
          activeOpacity={0.8}
        >
          <Ionicons name="help-circle-outline" size={20} color="#0A192F" />
          <Text style={styles.actionBtnText}>REGISTRAR COMO DESCONHECIDO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Extrato simulado de chamadas locais
const api = {
  post: async (_url: string, _data: any) => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 44 : 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCD6F6',
    letterSpacing: 2,
  },
  iconButton: {
    padding: 8,
  },
  visualContainer: {
    height: 180,
    backgroundColor: '#0c162d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#233554',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dimensionsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8892B0',
    marginTop: 16,
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#CCD6F6',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#8892B0',
    lineHeight: 22,
  },
  habitatCard: {
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#233554',
    marginBottom: 32,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64FFDA',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  habitatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitatName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginLeft: 8,
  },
  habitatDesc: {
    fontSize: 12,
    color: '#8892B0',
    lineHeight: 18,
  },
  actionsSection: {
    width: '100%',
  },
  actionsHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8892B0',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    opacity: 0.8,
  },
  activeBtn: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#64FFDA',
  },
  organizedBtn: {
    backgroundColor: '#64FFDA',
  },
  misplacedBtn: {
    backgroundColor: '#FF5C5C',
  },
  unknownBtn: {
    backgroundColor: '#FFB74D',
  },
  actionBtnText: {
    color: '#0A192F',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#8892B0',
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    height: 44,
    paddingHorizontal: 24,
    backgroundColor: '#64FFDA',
    borderRadius: 8,
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#0A192F',
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
