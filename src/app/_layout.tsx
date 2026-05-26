import { Slot } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../services/queryClient';
import { StatusBar } from 'expo-status-bar';

/**
 * Raiz de Roteamento do Expo Router (_layout.tsx).
 * Envolve toda a árvore de telas do aplicativo com os provedores de estado global.
 */
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Roteador de telas filhas */}
      <Slot />

      {/* Configurações básicas de barra de status (Estilo automático adaptativo) */}
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
