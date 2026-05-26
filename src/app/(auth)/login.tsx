import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { api, ApiError } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const loginStore = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // POST para o endpoint /api/auth/login do backend Spring Boot
      const response = await api.post<{
        token: string;
        id: string;
        username: string;
        email: string;
      }>('/api/auth/login', { username, password });

      // Atualiza o estado global de autenticação (Zustand + persistência MMKV)
      loginStore.login(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
      });

      // Navega para a aba inicial (Home) do aplicativo
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('[Login] Falha na autenticação:', err);
      if (err instanceof ApiError) {
        setError(err.details.message);
      } else {
        setError('Ocorreu um erro ao conectar ao servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.logoText}>⚡ TRECO-DEX</Text>
          <Text style={styles.subtitleText}>
            A Pokédex da vida real. Organize sua casa com inteligência.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Entrar na sua Conta</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NOME DE USUÁRIO</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu usuário"
              placeholderTextColor="#8892B0"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SENHA</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#8892B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#0A192F" />
            ) : (
              <Text style={styles.buttonText}>CONECTAR SESSÃO</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerLabel}>Ainda não possui conta?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TrecoDex Mobile v1.0.0 • Offline-First & IA Native</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Azul Cyberpunk Escuro profundo premium
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64FFDA', // Ciano vibrante cyberpunk
    letterSpacing: 2,
  },
  subtitleText: {
    fontSize: 14,
    color: '#8892B0',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#112240', // Cartão azul ligeiramente mais claro
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#233554',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CCD6F6',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 92, 92, 0.1)',
    borderWidth: 1,
    borderColor: '#FF5C5C',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF5C5C',
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64FFDA',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0A192F',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    color: '#CCD6F6',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#233554',
  },
  button: {
    backgroundColor: '#64FFDA',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#0A192F',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerLabel: {
    color: '#8892B0',
    fontSize: 14,
    marginRight: 6,
  },
  registerLink: {
    color: '#64FFDA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 11,
    color: '#495670',
  },
});
