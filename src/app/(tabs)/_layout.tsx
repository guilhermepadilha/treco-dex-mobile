import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

/**
 * Layout de navegação por abas principais (Tabs) do TrecoDex.
 * Utiliza cores premium e consistentes com a identidade visual Cyberpunk do app.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#112240', // Azul Cyberpunk escuro
          borderBottomWidth: 1,
          borderBottomColor: '#233554',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#CCD6F6',
          fontSize: 18,
          letterSpacing: 1.2,
        },
        tabBarStyle: {
          backgroundColor: '#112240',
          borderTopWidth: 1,
          borderTopColor: '#233554',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#64FFDA', // Ciano cyberpunk
        tabBarInactiveTintColor: '#8892B0', // Cinza azulado
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TRECOS',
          headerTitle: '⚡ MEUS TRECOS',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'SCANNER',
          headerTitle: '📷 DISPOSITIVO DE BUSCA',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'camera' : 'camera-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PERFIL',
          headerTitle: '👤 TRECO-MASTER',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
