import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// Mock de persistência síncrona usando localStorage para compatibilidade no navegador (Web) e no Expo Go
class WebMMKVMock {
  private store: Record<string, string> = {};

  set(key: string, value: string | boolean | number): void {
    this.store[key] = String(value);
    try {
      if (Platform.OS === 'web') localStorage.setItem(key, String(value));
    } catch {}
  }

  getString(key: string): string | undefined {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(key) ?? undefined;
    } catch {}
    return this.store[key] ?? undefined;
  }

  getBoolean(key: string): boolean {
    const val = this.getString(key);
    return val === 'true';
  }

  getNumber(key: string): number {
    const val = this.getString(key);
    return val ? Number(val) : 0;
  }

  contains(key: string): boolean {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(key) !== null;
    } catch {}
    return key in this.store;
  }

  delete(key: string): void {
    delete this.store[key];
    try {
      if (Platform.OS === 'web') localStorage.removeItem(key);
    } catch {}
  }

  clearAll(): void {
    this.store = {};
    try {
      if (Platform.OS === 'web') localStorage.clear();
    } catch {}
  }

  getAllKeys(): string[] {
    try {
      if (Platform.OS === 'web') return Object.keys(localStorage);
    } catch {}
    return Object.keys(this.store);
  }
}

// Detecção se o app está rodando no cliente Expo Go
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * Instância principal do MMKV Storage para o TrecoDex Mobile.
 * Utiliza armazenamento síncrono nativo em celulares construídos (Dev Client / Build)
 * e nosso Mock em memória/localStorage quando rodando no navegador ou no Expo Go.
 */
export const storage =
  Platform.OS === 'web' || isExpoGo
    ? (new WebMMKVMock() as unknown as MMKV)
    : new MMKV({
        id: 'trecodex-app-storage',
      });

/**
 * Adaptador de persistência para o Zustand.
 * Permite que stores globais (como useAuthStore e useSyncStore) persistam seus
 * estados no MMKV de forma síncrona e ultra-rápida.
 */
export const zustandMMKVStorage: StateStorage = {
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

/**
 * Adaptador de armazenamento síncrono para o TanStack Query Persister.
 * Compatível com o `createSyncStoragePersister` para caching offline instantâneo.
 */
export const querySyncStorage = {
  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },
  getItem: (key: string): string | null => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string): void => {
    storage.delete(key);
  },
};

/**
 * Helpers auxiliares altamente tipados para manipulação direta de chaves
 * e valores no MMKV Storage.
 */
export const storageHelpers = {
  /**
   * Salva um objeto serializado em formato JSON.
   */
  setObject: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[MMKV] Erro ao salvar objeto para chave "${key}":`, error);
    }
  },

  /**
   * Recupera e desserializa um objeto JSON com tipagem genérica estruturada.
   */
  getObject: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`[MMKV] Erro ao desserializar objeto para chave "${key}":`, error);
      return null;
    }
  },

  /**
   * Salva um valor booleano.
   */
  setBool: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  /**
   * Obtém um valor booleano ou retorna null caso a chave não exista.
   */
  getBool: (key: string): boolean | null => {
    if (!storage.contains(key)) return null;
    return storage.getBoolean(key) ?? null;
  },

  /**
   * Salva um número.
   */
  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  /**
   * Obtém um número ou retorna null caso a chave não exista.
   */
  getNumber: (key: string): number | null => {
    if (!storage.contains(key)) return null;
    return storage.getNumber(key) ?? null;
  },

  /**
   * Remove um item do armazenamento com base em sua chave.
   */
  delete: (key: string): void => {
    storage.delete(key);
  },

  /**
   * Verifica se determinada chave existe no armazenamento.
   */
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  /**
   * Retorna todas as chaves registradas.
   */
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },

  /**
   * Apaga todos os registros armazenados no banco local.
   */
  clearAll: (): void => {
    storage.clearAll();
  },
};
