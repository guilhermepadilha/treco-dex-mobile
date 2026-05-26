import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/queryClient';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/useAuthStore';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ==========================================
// 1. BOUNDARY DE ERRO GLOBAL (Requisito T031)
// ==========================================
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GlobalErrorBoundary] Erro crítico capturado:', error, errorInfo);
  }

  private handleReboot = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="skull-outline" size={80} color="#FF5C5C" style={styles.errorIcon} />
          <Text style={styles.errorTitle}>SYSTEM ANOMALY DETECTED</Text>
          <Text style={styles.errorSubtitle}>
            Um erro crítico impediu o funcionamento seguro do núcleo do TrecoDex. O protocolo de
            contenção de falhas foi ativado.
          </Text>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsText} numberOfLines={4}>
              {this.state.error?.toString() || 'Erro desconhecido na árvore de componentes'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.rebootBtn}
            onPress={this.handleReboot}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#0A192F" />
            <Text style={styles.rebootBtnText}>REINICIAR SISTEMA (REBOOT)</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// ==========================================
// 2. GATEKEEPER DE SESSÃO E ROTEAMENTO
// ==========================================
function InitialLayout() {
  const { isAuthenticated, isOffline } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated) {
      if (inAuthGroup || !segments[0] || segments[0] === 'index' || segments[0] === '') {
        router.replace('/(tabs)');
      }
    } else {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, segments, isReady, router]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#64FFDA" />
      </View>
    );
  }

  return (
    <View style={styles.flexContainer}>
      {/* Elemento de Roteamento Principal */}
      <Slot />

      {/* 3. TOAST OFFLINE FLUTUANTE (Requisito T031) */}
      {isOffline && (
        <View style={styles.offlineToast}>
          <Ionicons
            name="cloud-offline-outline"
            size={16}
            color="#0A192F"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.offlineToastText}>
            MODO OFFLINE ATIVO — OPERANDO EM REDE LOCAL MMKV
          </Text>
        </View>
      )}
    </View>
  );
}

// ==========================================
// 4. LAYOUT RAIZ
// ==========================================
export default function RootLayout() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <InitialLayout />
        <StatusBar style="light" />
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineToast: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 40,
    backgroundColor: '#FFB74D', // Amarelo/Laranja Cyberpunk
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#FFB74D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 9999,
  },
  offlineToastText: {
    color: '#0A192F',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  // Estilos da Tela de Anomalia (Crash Screen)
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    marginBottom: 24,
    shadowColor: '#FF5C5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5C5C',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#8892B0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 92, 92, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 92, 92, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  detailsText: {
    color: '#FF5C5C',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  rebootBtn: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#FF5C5C',
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5C5C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rebootBtnText: {
    color: '#0A192F',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 8,
  },
});
