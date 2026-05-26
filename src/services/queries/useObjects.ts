import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

// Interface do Objeto/Espécie alinhada com o ObjectSpeciesResponse do backend
export interface ObjectSpeciesResponse {
  id: string;
  name: string;
  description: string;
  sizeCm: number;
  primaryHabitatId: string;
  refugeHabitatId: string;
  environmentId: string;
  createdAt: string;
  updatedAt: string;
}

// Interface do Habitat alinhada com o HabitatResponse do backend
export interface HabitatResponse {
  id: string;
  name: string;
  description: string;
  environmentId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface do Cômodo/Ambiente alinhada com o EnvironmentResponse do backend
export interface EnvironmentResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Interface do Histórico de Estados do Objeto
export interface ObjectStateResponse {
  id: string;
  objectSpeciesId: string;
  state: 'ORGANIZED' | 'MISPLACED' | 'UNKNOWN';
  recordedById: string;
  recordedAt: string;
  createdAt: string;
}

/**
 * Hook do TanStack Query para listar todas as espécies de objetos do usuário.
 */
export function useObjects() {
  return useQuery<ObjectSpeciesResponse[]>({
    queryKey: ['objects'],
    queryFn: async () => {
      return await api.get<ObjectSpeciesResponse[]>('/api/objects');
    },
  });
}

/**
 * Hook do TanStack Query para obter detalhes de um objeto específico pelo ID.
 */
export function useObject(id: string) {
  return useQuery<ObjectSpeciesResponse>({
    queryKey: ['object', id],
    queryFn: async () => {
      return await api.get<ObjectSpeciesResponse>(`/api/objects/${id}`);
    },
    enabled: !!id,
  });
}

/**
 * Hook do TanStack Query para obter a lista de habitats disponíveis.
 */
export function useHabitats() {
  return useQuery<HabitatResponse[]>({
    queryKey: ['habitats'],
    queryFn: async () => {
      return await api.get<HabitatResponse[]>('/api/habitats');
    },
  });
}

/**
 * Hook do TanStack Query para obter detalhes de um habitat específico.
 */
export function useHabitat(id: string) {
  return useQuery<HabitatResponse>({
    queryKey: ['habitat', id],
    queryFn: async () => {
      return await api.get<HabitatResponse>(`/api/habitats/${id}`);
    },
    enabled: !!id,
  });
}

/**
 * Hook do TanStack Query para obter todos os ambientes/cômodos.
 */
export function useEnvironments() {
  return useQuery<EnvironmentResponse[]>({
    queryKey: ['environments'],
    queryFn: async () => {
      return await api.get<EnvironmentResponse[]>('/api/environments');
    },
  });
}

/**
 * Hook do TanStack Query para obter o histórico de estados e estado atual de um objeto específico.
 */
export function useObjectStates(objectId: string) {
  return useQuery<ObjectStateResponse[]>({
    queryKey: ['object-states', objectId],
    queryFn: async () => {
      return await api.get<ObjectStateResponse[]>(`/api/objects/${objectId}/states`);
    },
    enabled: !!objectId,
  });
}
