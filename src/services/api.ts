import { useAuthStore } from '../store/useAuthStore';

// URL base padrão da API Spring Boot.
// NOTA: Em emuladores Android ou dispositivos reais na mesma rede local, recomenda-se configurar
// a variável EXPO_PUBLIC_API_URL apontando para o IP do seu host na rede local.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Interface descrevendo detalhes estruturados de erros retornados pela API.
 */
export interface ApiErrorDetails {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Classe personalizada para representação estruturada de falhas de comunicação REST HTTP.
 */
export class ApiError extends Error {
  status: number;
  details: ApiErrorDetails;

  constructor(status: number, details: ApiErrorDetails) {
    super(details.message || `Erro HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Configurações estendidas suportando parâmetros de consulta (Query Params).
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Cliente HTTP unificado, resiliente e offline-first do ecossistema TrecoDex Mobile.
 * Encapsula de forma inteligente a injeção do token JWT e o gerenciamento do modo offline.
 */
export const api = {
  /**
   * Método de requisição core centralizador com interceptadores e tratamento de erros.
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, logout, setOfflineMode } = useAuthStore.getState();

    // Cria e configura cabeçalhos padrão
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    // Se houver token de autenticação salvo, injeta-o no cabeçalho
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Processa parâmetros de consulta (?key=value)
    let url = `${BASE_URL}${endpoint}`;
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, val]) => {
        searchParams.append(key, String(val));
      });
      url += `?${searchParams.toString()}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Sincronização de rede bem-sucedida restabelece a flag online
      setOfflineMode(false);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText || 'Erro inesperado da API' };
        }

        const apiErrorDetails: ApiErrorDetails = {
          status: response.status,
          message: errorData.message || errorData.error || `Erro HTTP ${response.status}`,
          code: errorData.code,
          errors: errorData.errors,
        };

        // Interceptador global de token expirado ou inválido (401)
        if (response.status === 401) {
          console.warn(
            '[API] Token de autenticação inválido ou expirado (401). Efetuando logout automático.',
          );
          logout();
        }

        throw new ApiError(response.status, apiErrorDetails);
      }

      // Trata respostas com payload vazio (ex: 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Trata falha física de conexão de rede (timeout / offline)
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      if (isNetworkError) {
        console.warn('[API] Falha de conexão de rede detectada. Forçando entrada no Modo Offline.');
        setOfflineMode(true);
      }

      const connectionErrorDetails: ApiErrorDetails = {
        status: 0,
        message:
          'Não foi possível estabelecer contato com o backend. Verifique seu sinal ou Wi-Fi.',
        code: 'NETWORK_ERROR',
      };

      throw new ApiError(0, connectionErrorDetails);
    }
  },

  /**
   * Realiza requisições HTTP GET.
   */
  get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * Realiza requisições HTTP POST com serialização JSON automática de corpo.
   */
  post<T>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Realiza requisições HTTP PUT com serialização JSON automática de corpo.
   */
  put<T>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Realiza requisições HTTP DELETE.
   */
  delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Realiza requisições HTTP PATCH com serialização JSON automática de corpo.
   */
  patch<T>(
    endpoint: string,
    body: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {},
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },
};
