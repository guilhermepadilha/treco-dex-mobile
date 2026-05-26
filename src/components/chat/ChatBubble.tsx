import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../../store/useChatOnboarding';

interface ChatBubbleProps {
  message: ChatMessage;
}

/**
 * Componente atômico representando um balão de conversa estilizado (Requisito T025).
 * Adota cores premium diferenciando a IA (esquerda) do Usuário (direita).
 */
export function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.sender === 'AI';

  return (
    <View style={[styles.wrapper, isAI ? styles.aiWrapper : styles.userWrapper]}>
      <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
        <Text style={[styles.senderLabel, isAI ? styles.aiLabel : styles.userLabel]}>
          {isAI ? '🤖 TRECO-AI' : '👤 VOCÊ'}
        </Text>
        <Text style={[styles.text, isAI ? styles.aiText : styles.userText]}>{message.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiBubble: {
    backgroundColor: '#112240', // Azul escuro
    borderColor: '#233554',
    borderTopLeftRadius: 2,
  },
  userBubble: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)', // Ciano translúcido
    borderColor: '#64FFDA',
    borderTopRightRadius: 2,
  },
  senderLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  aiLabel: {
    color: '#64FFDA',
  },
  userLabel: {
    color: '#CCD6F6',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: '#CCD6F6',
  },
  userText: {
    color: '#CCD6F6',
  },
});
