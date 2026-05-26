<!--
Sync Impact Report
Version change: null → 1.0.0 (Initial adoption of TrecoDex Mobile Constitution)
Principles added:
  - I. Premium UI/UX & High-Fidelity Rendering
  - II. Offline-First Capability
  - III. AI-Native & Multimodal Experience
  - IV. Contract-Driven Integration
  - V. Code Health & Observability
Templates reviewed:
  ✅ .specify/templates/plan-template.md
  ✅ .specify/templates/spec-template.md
  ✅ .specify/templates/tasks-template.md
Follow-up: none
-->

# TrecoDex Mobile Constitution

## Core Principles

### I. Premium UI/UX & High-Fidelity Rendering

O aplicativo deve oferecer uma interface extremamente polida, moderna e responsiva. São obrigatórios o uso de temas consistentes (sleek dark mode por padrão), animações fluidas (60/120 FPS via Reanimated/Moti), e micro-interações que encantem o usuário ao catalogar seus trecos. Placeholders visuais simples ou layouts genéricos sem personalidade são estritamente proibidos.

### II. Offline-First Capability

O mobile deve ser capaz de funcionar de forma autônoma sem conexão activa. Deve prover cache local robusto de trecos e habitats, busca local instantânea e fila de sincronização em segundo plano para persistir dados novos ou alterações no backend (`treco-dex-api`) assim que a conexão for restabelecida.

### III. AI-Native & Multimodal Experience

O aplicativo deve ser otimizado para o fluxo de inteligência artificial do ecossistema:

- Captura ultra-rápida de fotos da câmera.
- Compressão e preparação local de imagens antes do upload para a busca visual multimodal (`POST /api/objects/visual-search`).
- Interface interativa fluida para guiar o usuário na máquina de estados de onboarding de novos objetos gerenciada pelo Redis/Kafka.

### IV. Contract-Driven Integration

Toda integração com o backend deve ser baseada em contratos estritos, com tipagem TypeScript completa em requests e responses. Falhas de conexão, timeouts ou indisponibilidades temporárias do backend devem ser tratadas de forma graciosa (graceful degradation) sem travar a experiência do usuário.

### V. Code Health & Observability

Manter 100% de type-safety e linting rígido. A lógica de negócio e gerenciamento de estado local devem ser cobertos por testes unitários e de integração. Logs do aplicativo devem registrar correlation IDs originados no backend para garantir a rastreabilidade ponta a ponta de ações induzidas por IA ou uploads assíncronos.

## Technical Constraints & Stack

O desenvolvimento do aplicativo deve seguir a stack e as diretrizes tecnológicas homologadas abaixo:

- **Framework Core**: React Native + Expo (TypeScript) para desenvolvimento ágil nativo multiplataforma (iOS & Android).
- **Estilização**: NativeWind (Tailwind CSS) ou styled-components para modularidade e consistência visual.
- **Roteamento**: Expo Router (roteamento moderno baseado em arquivos).
- **Gerenciamento de Estado**: Zustand para estados locais leves, previsíveis e rápidos.
- **Sincronização de APIs (Server State)**: React Query / TanStack Query para cache de rede, sincronizações resilientes e invalidações de query.
- **Persistência Local**: MMKV para cache offline de altíssima performance (leitura/escrita síncrona ultra-rápida).
- **Animações & Gráficos**: Reanimated, Moti e React Native Skia (para filtros de câmera nativos, efeitos de shader cyberpunk e renderização 2D de alta performance).

## Workflow & Quality Gates

Todo novo desenvolvimento no ecossistema mobile deve respeitar as seguintes etapas de qualidade:

1. **Especificação (SpecKit)**: Toda nova funcionalidade deve iniciar com uma especificação clara de casos de uso e critérios de aceitação independentes de implementação.
2. **Design & Planejamento**: Definição da arquitetura de telas e fluxos antes da escrita de código.
3. **Validação Estática**: Rodar linting e checagem de tipos TS antes de qualquer entrega.
4. **Testes de Integração**: Validar fluxos de câmera, upload e persistência offline sob condições de rede simuladas de baixa velocidade.

## Governance

Esta constitution é a autoridade máxima do desenvolvimento móvel da TrecoDex. Qualquer desvio de suas regras (ex.: introdução de componentes lentos ou quebra de tipagem de integração) deve ser justificado e revisado.

A evolução deste documento segue o versionamento semântico:

- **MAJOR**: Alteração em princípios básicos (ex.: migração de framework ou mudança nas regras offline).
- **MINOR**: Inclusão de novas regras de stack, capacidades de IA ou fluxos de trabalho.
- **PATCH**: Correções gramaticais, formatação ou pequenos ajustes de clareza.

**Version**: 1.0.0 | **Ratified**: 2026-05-20 | **Last Amended**: 2026-05-20
