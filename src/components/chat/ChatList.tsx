import React, { useRef, useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { ChatBubble } from './ChatBubble';
import { ChatMessage } from '../../store/useChatOnboarding';

interface ChatListProps {
  messages: ChatMessage[];
}

/**
 * Componente contendo a lista rolável das mensagens do chat conversacional (Requisito T025).
 * Auto-rola para a base de forma sutil quando novas mensagens são inseridas.
 */
export function ChatList({ messages }: ChatListProps) {
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    // Garante rolagem suave automática ao adicionar mensagem
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <FlatList
      ref={listRef}
      data={messages}
      renderItem={({ item }) => <ChatBubble message={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 16 }} />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 12,
  },
});
