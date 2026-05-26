import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

// Interface do Objeto/Espécie alinhada aos contratos do backend
export interface ObjectItem {
  id: string;
  name: string;
  description: string;
  sizeCm: number;
  status: 'ORGANIZED' | 'MISPLACED' | 'UNKNOWN';
  primaryHabitatName: string;
  environmentName: string;
}

// Lista de dados mockados de altíssima fidelidade para visualização premium imediata
const MOCK_OBJECTS: ObjectItem[] = [
  {
    id: '1',
    name: 'Chave Reserva',
    description: 'Chave de latão com chaveiro vermelho do carro.',
    sizeCm: 6.5,
    status: 'MISPLACED',
    primaryHabitatName: 'Gaveta de Chaves',
    environmentName: 'Hall de Entrada',
  },
  {
    id: '2',
    name: 'Controle da TV',
    description: 'Controle remoto smart da Samsung preto.',
    sizeCm: 16.0,
    status: 'ORGANIZED',
    primaryHabitatName: 'Painel da TV',
    environmentName: 'Sala de Estar',
  },
  {
    id: '3',
    name: 'Carregador Tipo C',
    description: 'Carregador rápido USB-C de 65W da Baseus.',
    sizeCm: 8.0,
    status: 'ORGANIZED',
    primaryHabitatName: 'Organizador de Cabos',
    environmentName: 'Escritório',
  },
  {
    id: '4',
    name: 'Carteira de Couro',
    description: 'Carteira marrom contendo CNH e cartões essenciais.',
    sizeCm: 11.5,
    status: 'MISPLACED',
    primaryHabitatName: 'Criado-Mudo Esquerdo',
    environmentName: 'Quarto',
  },
  {
    id: '5',
    name: 'Passaporte Nacional',
    description: 'Documento oficial de viagem válido até 2032.',
    sizeCm: 12.5,
    status: 'ORGANIZED',
    primaryHabitatName: 'Cofre Interno',
    environmentName: 'Escritório',
  },
  {
    id: '6',
    name: 'Fone Bluetooth',
    description: 'Fones intra-auriculares com cancelamento de ruído.',
    sizeCm: 5.0,
    status: 'UNKNOWN',
    primaryHabitatName: 'Bolso Frontal',
    environmentName: 'Mochila de Viagem',
  },
];

export default function IndexTab() {
  const router = useRouter();
  const { isOffline, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtragem instantânea local (Requisito da User Story 2)
  const filteredObjects = MOCK_OBJECTS.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.primaryHabitatName.toLowerCase().includes(query) ||
      item.environmentName.toLowerCase().includes(query)
    );
  });

  const getStatusDetails = (status: ObjectItem['status']) => {
    switch (status) {
      case 'ORGANIZED':
        return { label: 'Guardado', color: '#64FFDA', bg: 'rgba(100, 255, 218, 0.1)' };
      case 'MISPLACED':
        return { label: 'Fora do Lugar', color: '#FF5C5C', bg: 'rgba(255, 92, 92, 0.1)' };
      default:
        return { label: 'Desconhecido', color: '#FFB74D', bg: 'rgba(255, 183, 77, 0.1)' };
    }
  };

  const renderCard = ({ item }: { item: ObjectItem }) => {
    const statusDetails = getStatusDetails(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/object/${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Thumbnail Placeholder */}
        <View style={styles.thumbnailContainer}>
          <Ionicons name="cube-outline" size={32} color="#64FFDA" />
          <Text style={styles.sizeTag}>{item.sizeCm.toFixed(1)} cm</Text>
        </View>

        {/* Content Info */}
        <View style={styles.cardContent}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusDetails.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: statusDetails.color }]} />
            <Text style={[styles.statusText, { color: statusDetails.color }]} numberOfLines={1}>
              {statusDetails.label}
            </Text>
          </View>

          <View style={styles.habitatRow}>
            <Ionicons name="location-outline" size={12} color="#8892B0" />
            <Text style={styles.habitatText} numberOfLines={1}>
              {item.primaryHabitatName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Banner de Modo Offline */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#0A192F" />
          <Text style={styles.offlineBannerText}>MODO OFFLINE ATIVO - ACESSANDO CACHE LOCAL</Text>
        </View>
      )}

      {/* Header com Saudações */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bem-vindo de volta,</Text>
          <Text style={styles.userTitle}>{user?.username || 'Treco-Master'}</Text>
        </View>
        <TouchableOpacity style={styles.scanTrigger} onPress={() => router.push('/(tabs)/camera')}>
          <Ionicons name="scan-outline" size={20} color="#0A192F" />
        </TouchableOpacity>
      </View>

      {/* Barra de Busca Cyberpunk */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={18} color="#8892B0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, habitat ou cômodo..."
          placeholderTextColor="#8892B0"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#8892B0" />
          </TouchableOpacity>
        )}
      </View>

      {/* Listagem Grid dos Itens */}
      <FlatList
        data={filteredObjects}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-circle-outline" size={64} color="#233554" />
            <Text style={styles.emptyTitle}>Nenhum treco encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Tente ajustar os termos de pesquisa ou adicione um novo objeto!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Azul Cyberpunk Escuro profundo
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB74D',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  offlineBannerText: {
    color: '#0A192F',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 13,
    color: '#8892B0',
    fontWeight: '500',
  },
  userTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CCD6F6',
    letterSpacing: 0.5,
  },
  scanTrigger: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#64FFDA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#112240',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#233554',
    marginHorizontal: 20,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#CCD6F6',
    fontSize: 14,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  gridContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#112240',
    width: '47%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#233554',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailContainer: {
    height: 100,
    backgroundColor: '#0c162d',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#233554',
    position: 'relative',
  },
  sizeTag: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8892B0',
    backgroundColor: '#112240',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardContent: {
    padding: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 11,
    color: '#8892B0',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 8,
    maxWidth: '100%',
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
  habitatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitatText: {
    fontSize: 11,
    color: '#8892B0',
    marginLeft: 4,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#8892B0',
    textAlign: 'center',
    lineHeight: 18,
  },
});
