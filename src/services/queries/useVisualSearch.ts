import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

export interface VisualSearchResponse {
  identified: boolean;
  objectName: string;
  habitatName: string;
  reasoning: string;
  sessionId?: string;
  message?: string;
}

/**
 * Hook de mutação para realizar a busca visual multimodal (Requisito T028).
 * Envia o arquivo JPEG comprimido para o endpoint POST /api/objects/visual-search.
 */
export function useVisualSearch() {
  return useMutation<VisualSearchResponse, Error, string>({
    mutationFn: async (imageUri: string) => {
      const formData = new FormData();

      // Formatar o arquivo para upload multipart/form-data
      const filePayload = {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      };

      formData.append('file', filePayload as any);

      // Chamada HTTP usando o cliente de API configurado
      return await api.post<VisualSearchResponse>('/api/objects/visual-search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
}
