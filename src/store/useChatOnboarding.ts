import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'SYSTEM' | 'AI';
  text: string;
  timestamp: number;
}

export interface HabitatRecommendation {
  id?: string;
  name: string;
  environmentName: string;
  description: string;
  confidence: number;
}

interface ChatOnboardingState {
  // Estados
  messages: ChatMessage[];
  photoUri: string | null;
  compressedPhotoUri: string | null;
  isStarted: boolean;
  isLoading: boolean;
  recommendedHabitat: HabitatRecommendation | null;
  sessionId: string | null;
  objectName: string | null;
  currentStep: 'PHOTO_TAKEN' | 'RECOMMENDATION_SHOWN' | 'AWAITING_PHOTO_CONFIRMATION' | 'AWAITING_HABITAT' | 'CONFIRMING' | 'COMPLETED' | 'FINISHED';

  // Ações
  startOnboarding: (photoUri: string, compressedUri: string) => void;
  addMessage: (sender: ChatMessage['sender'], text: string) => void;
  setRecommendedHabitat: (rec: HabitatRecommendation | null) => void;
  setLoading: (loading: boolean) => void;
  nextStep: (step: ChatOnboardingState['currentStep']) => void;
  setSessionData: (sessionId: string, objectName: string, step: ChatOnboardingState['currentStep']) => void;
  resetOnboarding: () => void;
}

/**
 * Zustand Store para gerenciar o estado da conversa e a máquina de estados
 * do onboarding conversacional inteligente (Requisito T024).
 */
export const useChatOnboarding = create<ChatOnboardingState>((set) => ({
  messages: [],
  photoUri: null,
  compressedPhotoUri: null,
  sessionId: null,
  objectName: null,
  isStarted: false,
  isLoading: false,
  recommendedHabitat: null,
  currentStep: 'PHOTO_TAKEN',

  startOnboarding: (photoUri: string, compressedUri: string) => {
    const welcomeMsg: ChatMessage = {
      id: `system-${Date.now()}`,
      sender: 'AI',
      text: '🤖 Olá! Capturei a foto do seu objeto. Estou analisando as propriedades visuais dele...',
      timestamp: Date.now(),
    };

    set({
      photoUri,
      compressedPhotoUri: compressedUri,
      isStarted: true,
      messages: [welcomeMsg],
      currentStep: 'PHOTO_TAKEN',
      recommendedHabitat: null,
      sessionId: null,
      objectName: null,
    });
  },

  addMessage: (sender, text) => {
    const newMsg: ChatMessage = {
      id: `${sender}-${Date.now()}`,
      sender,
      text,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, newMsg],
    }));
  },

  setRecommendedHabitat: (rec) => {
    set({ recommendedHabitat: rec });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  nextStep: (step) => {
    set({ currentStep: step });
  },

  setSessionData: (sessionId, objectName, step) => {
    set({ sessionId, objectName, currentStep: step });
  },

  resetOnboarding: () => {
    set({
      messages: [],
      photoUri: null,
      compressedPhotoUri: null,
      isStarted: false,
      isLoading: false,
      recommendedHabitat: null,
      sessionId: null,
      objectName: null,
      currentStep: 'PHOTO_TAKEN',
    });
  },
}));
