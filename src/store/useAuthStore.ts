import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from '../utils/storage';

/**
 * Interface representando os dados do usuário autenticado no ecossistema TrecoDex.
 */
export interface User {
  id: string | number;
  username: string;
  email: string;
  name?: string;
}

/**
 * Interface que define o estado e as ações disponíveis no store de autenticação.
 */
interface AuthState {
  // Estados
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isOffline: boolean;

  // Ações
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setOfflineMode: (isOffline: boolean) => void;
}

/**
 * Zustand global Auth Store persistido de forma síncrona no MMKV Storage.
 * Usado para gerenciar sessões do usuário de modo offline-first instantâneo.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estados iniciais
      token: null,
      user: null,
      isAuthenticated: false,
      isOffline: false,

      /**
       * Define as informações da sessão autenticada obtida do backend treco-dex-api.
       */
      login: (token: string, user: User): void => {
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      /**
       * Desloga o usuário e remove de forma segura todos os dados de sessão
       * e cache do armazenamento MMKV.
       */
      logout: (): void => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      /**
       * Atualiza de forma parcial os dados cadastrais do usuário atualmente logado.
       */
      updateUser: (updatedUser: Partial<User>): void => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      /**
       * Atualiza o estado de rede do app móvel para ativar banners visuais
       * ou interceptadores offline.
       */
      setOfflineMode: (isOffline: boolean): void => {
        set({ isOffline });
      },
    }),
    {
      name: 'trecodex-auth-storage', // Nome da chave onde o estado será salvo no MMKV
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
