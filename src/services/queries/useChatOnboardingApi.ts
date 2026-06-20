import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

export interface ChatOnboardingRequest {
  sessionId: string;
  message: string;
}

export interface ChatOnboardingResponse {
  sessionId: string;
  step: 'AWAITING_PHOTO_CONFIRMATION' | 'AWAITING_HABITAT' | 'COMPLETED';
  objectName: string;
  habitatName: string;
  reply: string;
  completed: boolean;
}

export function useChatOnboardingMutation() {
  return useMutation<ChatOnboardingResponse, Error, ChatOnboardingRequest>({
    mutationFn: async (request: ChatOnboardingRequest) => {
      return api.post<ChatOnboardingResponse>('/api/objects/chat-onboarding', request);
    },
  });
}
