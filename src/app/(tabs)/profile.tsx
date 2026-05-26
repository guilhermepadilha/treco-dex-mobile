import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * Tela de Perfil (Treco-Master) que exibe as credenciais da sessão ativa
 * e permite efetuar logout de forma segura da aplicação.
 */
export default function ProfileTab() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Encerrar Sessão', 'Tem certeza de que deseja sair de sua conta do TrecoDex?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {user?.username?.substring(0, 2).toUpperCase() || 'U'}
        </Text>
      </View>

      <Text style={styles.username}>{user?.username || 'Usuário TrecoDex'}</Text>
      <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>DADOS DE MESTRE</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID DA CONTA</Text>
          <Text style={styles.infoValue} numberOfLines={1}>
            {user?.id || 'Não identificado'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.logoutButtonText}>ENCERRAR SESSÃO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Azul escuro premium
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#112240',
    borderWidth: 2,
    borderColor: '#64FFDA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64FFDA',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8892B0',
    marginBottom: 32,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#112240',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#233554',
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64FFDA',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#8892B0',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#CCD6F6',
    fontWeight: '500',
    maxWidth: '60%',
  },
  logoutButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FF5C5C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5C5C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#0A192F',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});
