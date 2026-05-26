# 📱 TrecoDex Mobile - React Native Application

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React Native](https://img.shields.io/badge/React_Native-0.73+-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_50+-black.svg)](https://expo.dev/)

O **TrecoDex Mobile** é o aplicativo móvel oficial do ecossistema **TrecoDex** (a "Pokédex da vida real" para organização e catalogação de pertences domésticos). Desenvolvido com foco em acessibilidade e neuro-inclusão, o aplicativo trabalha integrado ao backend inteligente do [TrecoDex API](https://github.com/guilhermepadilha/treco-dex-api) para ajudar pessoas com TDAH, Autismo ou dificuldades de memória espacial a organizarem suas casas de forma autônoma, leve e divertida.

---

## 🌟 Recursos Principais

- 📷 **Busca Visual Multimodal**: Aponte a câmera para qualquer objeto doméstico para identificá-lo instantaneamente e descobrir onde ele deve ser guardado.
- 🎮 **Experiência Gamificada ("Pokédex Style")**: Transforma a rotina de arrumação em um jogo divertido, com descrições engraçadas geradas por IA para seus pertences.
- 🏡 **Navegação de Habitats**: Estrutura espacial e fotos reais do ponto de armazenamento exato de cada objeto.
- ⚡ **Offline-First Absoluto**: Carregamento instantâneo do catálogo e busca local ultraveloz em menos de 100ms, funcionando mesmo nos cantos sem internet da casa (garagem, subsolo, armários).
- 💬 **Cadastro Conversacional**: Assistente inteligente por chat guiado para catalogar novos objetos de forma fácil, sem digitação burocrática.
- 🔐 **Autenticação Segura**: Gerenciamento seguro de sessões locais e integração encriptada com o backend do TrecoDex API.

---

## 🛠️ Stack Tecnológica

- **Plataforma & Core**: React Native + Expo (TypeScript)
- **Navegação**: Expo Router (Roteamento baseado em arquivos)
- **Gerenciamento de Estado**: Zustand
- **Sincronização de APIs & Caching**: TanStack Query (React Query)
- **Persistência Offline**: MMKV (Chave-valor de alta performance)
- **Efeitos Gráficos & Animações**: Reanimated, Moti e React Native Skia (desempenho gráfico a 60/120 FPS)

---

## 📂 Estrutura do Projeto

```text
/
├── .agents/          # Instruções e habilidades do assistente autônomo
├── .specify/         # Workflows e automações do Spec Kit
├── specs/            # Especificações de features e planos de desenvolvimento
└── README.md         # Documentação principal do projeto
```

---

## 🚀 Próximos Passos de Desenvolvimento

1.  **Fundação Esquelética (MVP)**: Instalação e acoplamento completo de todas as dependências nativas (Skia, Reanimated, Moti, MMKV).
2.  **Fluxo de Autenticação**: Implementação do login com persistência de token JWT criptografado via chaveiro local.
3.  **Visual Integrado**: Implementação da câmera de visão multimodal para busca por imagem.
4.  **Polish Estético**: Polimento visual premium com transições fluidas e paleta de cores harmoniosa.

---

## License

This project is licensed under the Apache License 2.0.

Copyright (c) 2026 Guilherme Santos Padilha
