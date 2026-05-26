import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '../utils/storage';

/**
 * Interface que representa uma transação/mutação HTTP enfileirada offline.
 */
export interface OfflineMutation {
  id: string; // Identificador único da transação local
  endpoint: string; // Endpoint vindo da requisição (ex: /api/objects/12)
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // Método HTTP executado
  body: any; // Corpo da requisição a ser enviado ao backend
  timestamp: number; // Timestamp da transação para ordenação cronológica e auditoria
}

/**
 * Interface definindo o estado e as ações disponíveis no store de sincronização offline.
 */
interface SyncState {
  // Estados
  queue: OfflineMutation[];
  isSyncing: boolean;

  // Ações
  enqueueMutation: (endpoint: string, method: OfflineMutation['method'], body: any) => void;
  dequeueMutation: (id: string) => void;
  clearQueue: () => void;
  setSyncing: (isSyncing: boolean) => void;
}

/**
 * Zustand global Sync Store persistido de forma síncrona no MMKV Storage.
 * Controla e enfileira transações e mutações de modificação feitas offline pelo usuário.
 */
export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      // Estados iniciais
      queue: [],
      isSyncing: false,

      /**
       * Enfileira uma nova transação offline gerando um ID transacional único.
       */
      enqueueMutation: (endpoint: string, method: OfflineMutation['method'], body: any): void => {
        const newMutation: OfflineMutation = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          endpoint,
          method,
          body,
          timestamp: Date.now(),
        };

        set((state) => ({
          queue: [...state.queue, newMutation],
        }));
      },

      /**
       * Remove da fila uma transação offline que já foi despachada e resolvida
       * com sucesso pelo Spring Boot backend.
       */
      dequeueMutation: (id: string): void => {
        set((state) => ({
          queue: state.queue.filter((mutation) => mutation.id !== id),
        }));
      },

      /**
       * Esvazia completamente a fila de transações pendentes de sincronização.
       */
      clearQueue: (): void => {
        set({ queue: [] });
      },

      /**
       * Altera o status do despachador (worker) de mutações.
       */
      setSyncing: (isSyncing: boolean): void => {
        set({ isSyncing });
      },
    }),
    {
      name: 'trecodex-sync-storage', // Nome da chave onde o estado será persistido no MMKV
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
