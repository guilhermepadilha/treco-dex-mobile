import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { querySyncStorage } from '../utils/storage';

/**
 * Cliente global do TanStack Query estruturado com configurações ideais
 * para dispositivos móveis e resiliência offline.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime (Garbage Collection Time): Tempo para persistir queries inativas em cache (24 horas)
      gcTime: 1000 * 60 * 60 * 24,
      // staleTime: Tempo até que dados locais sejam considerados obsoletos (5 minutos)
      staleTime: 1000 * 60 * 5,
      // refetchOnWindowFocus: Desabilitado em ambiente mobile para evitar loops de refresh ao abrir abas
      refetchOnWindowFocus: false,
      // retry: Limita o número de tentativas em caso de falha de conexão física
      retry: 1,
    },
  },
});

/**
 * Persister síncrono customizado do TanStack Query.
 * Vincula o cache de rede diretamente ao nosso banco nativo ultra-rápido MMKV Storage.
 */
const persister = createSyncStoragePersister({
  storage: querySyncStorage,
  key: 'trecodex-query-cache',
});

/**
 * Vincula ativamente a sincronização automática do cache entre o QueryClient
 * e o banco local MMKV.
 */
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // Validade máxima dos dados no cache local (24 horas)
});
