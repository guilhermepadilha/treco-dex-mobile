import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/queryClient';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

/**
 * Gatekeeper de sessão e roteamento inteligente do aplicativo TrecoDex.
 * Utiliza o estado síncrono do Zustand persistido no MMKV para
 * redirecionar o usuário de acordo com sua autenticação.
 */
function InitialLayout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Curto delay para assegurar que a árvore do Expo Router está montada e os segmentos estão acessíveis
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated) {
      // Se já está logado, impede acesso ao fluxo de login/registro e vai para Home
      if (inAuthGroup || segments.length === 0 || segments[0] === 'index' || segments[0] === '') {
        router.replace('/(tabs)');
      }
    } else {
      // Se não autenticado e tenta acessar uma área restrita, força login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, segments, isReady, router]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#0A192F',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#64FFDA" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <InitialLayout />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
