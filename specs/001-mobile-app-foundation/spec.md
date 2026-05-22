# Feature Specification: TrecoDex Mobile Foundation

**Feature Branch**: `001-mobile-app-foundation`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "Especificação inicial para a fundação do aplicativo móvel do TrecoDex, garantindo alinhamento e consistência com os conceitos e contratos do backend treco-dex-api."

---

## Product Context & Alignment

Esta especificação define a fundação e os fluxos de experiência do usuário para o aplicativo **TrecoDex Mobile**, o frontend nativo do ecossistema TrecoDex. Ela se alinha diretamente aos conceitos definidos no backend (`treco-dex-api`), garantindo que o catálogo de objetos domésticos ("Pokédex da vida real"), os habitats físicos, a busca semântica e os pipelines de IA multimodal sejam expostos ao usuário de forma lógica, fluida e de altíssimo valor.

> [!IMPORTANT]
> **Delimitação de Escopo do MVP**: Toda a energia do MVP móvel está focada na **corretude dos fluxos de uso funcionais** (autenticação JWT, acionamento da câmera nativa, transições e ordem de telas no Expo Router, cache offline síncrono no MMKV, chamadas assíncronas do TanStack Query e processamento de imagens). Toda a identidade visual sofisticada (estética Cyberpunk/Pokédex), estilizações de UI complexas, animações personalizadas de transição e shaders do Skia estão **fora de escopo** e serão abordados em uma especificação visual subsequente. O layout será mantido **extremamente simples, limpo e em formato wireframe**, garantindo que a próxima tarefa de layout encontre uma aplicação 100% funcional, restando apenas polir a parte estética.

---

## Clarifications

### Session 2026-05-21
- Q: Qual o formato e limite máximo de tamanho de arquivo após a compressão da foto no dispositivo antes de enviar para o backend? → A: JPEG comprimido com tamanho máximo de 500KB (Opção A).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Autenticação Segura & Sessão Offline (Priority: P1)

Como um usuário do TrecoDex, quero realizar login e ter minha sessão mantida de forma segura no aplicativo, de modo que eu possa visualizar meu catálogo de itens instantaneamente mesmo quando não possuir acesso à internet.

**Why this priority**: É a porta de entrada da aplicação, garantindo segurança corporativa (JWT) combinada com resiliência móvel offline.

**Independent Test**: Pode ser testado realizando o login com credenciais válidas, desativando a internet do dispositivo, fechando/abrindo o app e verificando se o dashboard ainda carrega as informações do catálogo a partir do cache local.

**Acceptance Scenarios**:
1. **Given** que o usuário abre o aplicativo pela primeira vez, **When** ele insere as credenciais na tela de login, **Then** o app obtém o token JWT do backend (`treco-dex-api`), salva-o de forma segura localmente (Keyring/Keystore) e redireciona para a tela inicial.
2. **Given** que o usuário possui uma sessão ativa, **When** ele abre o aplicativo sem conexão de rede, **Then** o app carrega o último estado do catálogo salvo no cache local e apresenta um indicador visual discreto de "Modo Offline".
3. **Given** que o usuário decide sair (logout), **When** ele clica no botão de logout, **Then** todos os dados de sessão e cache de segurança são limpos do armazenamento local.

---

### User Story 2 - A Pokédex de Trecos & Busca Local (Priority: P1)

Como um usuário organizando minha casa, quero visualizar todos os meus trecos em um grid dinâmico e buscá-los instantaneamente por nome ou localização, para recuperar a memória espacial de onde eles estão guardados.

**Why this priority**: É o valor central do produto (a "Pokedex da vida real") de visualização rápida e localização imediata de itens cotidianos.

**Independent Test**: Pode ser testado buscando termos específicos que existem no cache local e validando que o grid é atualizado em tempo real com transições visuais fluidas.

**Acceptance Scenarios**:
1. **Given** o catálogo com objetos e habitats sincronizados, **When** o usuário digita na barra de busca, **Then** a lista de objetos é filtrada instantaneamente por nome, tags ou nome do habitat sem latência de rede.
2. **Given** o grid de objetos, **When** o usuário clica em um item, **Then** ele vê os detalhes do treco (propriedades físicas, estado atual, fotos associadas e a localização exata do habitat com a foto do local esperado).
3. **Given** um objeto fora do seu local correto, **When** o usuário atualiza o estado do objeto para "Em habitat" pela interface, **Then** a mudança de estado é refletida visualmente com uma animação sutil e salva localmente.

---

### User Story 3 - Cadastro Conversacional de Objeto com Câmera (Priority: P2)

Como um usuário com um novo objeto que quero catalogar, quero iniciar uma conversação simples onde posso tirar uma foto do item, receber uma sugestão de habitat inteligente e adicioná-lo progressivamente ao meu TrecoDex.

**Why this priority**: Implementa o fluxo dinâmico conversacional e interativo em etapas do produto, alinhado à máquina de estados do backend persistida no Redis.

**Independent Test**: Pode ser testado simulando o envio de uma foto tirada pela câmera, recebendo a recomendação e finalizando a associação de um novo habitat.

**Acceptance Scenarios**:
1. **Given** que o usuário inicia o cadastro de um novo item, **When** ele tira uma foto usando o componente de câmera integrado do app, **Then** a imagem é comprimida localmente e enviada em background, iniciando a sessão de onboarding.
2. **Given** a sugestão de habitat fornecida pela IA factual/generativa do backend, **When** o usuário confirma a recomendação, **Then** o objeto é registrado com sucesso na base de dados e no cache local.
3. **Given** que a IA sugere um habitat inexistente ou que o usuário rejeita a sugestão, **When** o usuário opta por criar um novo habitat, **Then** o app guia o usuário no processo de nomear o novo local e capturar uma foto rápida de contexto do ambiente.

---

### User Story 4 - Busca Visual Multimodal & Recuperação Rápida (Priority: P2)

Como um usuário que encontrou um objeto perdido ou não identificado, quero apontar a câmera e tirar uma foto dele para que o app me diga imediatamente o que é, onde ele deveria estar e me mostre a foto do local correto.

**Why this priority**: Experiência "UAU" do produto móvel, unindo visão computacional, IA contextual e a verdade factual do banco de dados local.

**Independent Test**: Pode ser testado capturando um objeto com a câmera e verificando se o app exibe a tela de resultado "Encontrado" com os dados factuais corretos do catálogo.

**Acceptance Scenarios**:
1. **Given** que o usuário deseja encontrar onde guardar um item, **When** ele tira uma foto através do botão de busca rápida por câmera, **Then** a foto é enviada para `/api/objects/visual-search`.
2. **Given** um retorno de sucesso de objeto já catalogado, **When** a resposta é recebida, **Then** o app exibe uma tela visual premium contendo a descrição divertida no estilo Pokédex, a localização do habitat e a foto do habitat para guiar a devolução correta do treco.
3. **Given** um retorno indicando que o item é inédito, **When** a resposta da IA é exibida, **Then** o app abre a máquina de estados de onboarding conversacional perguntando ao usuário se ele deseja registrar o item sugerido.

---

### Edge Cases

- **Sem Conexão ao Registrar (Modo Estrito Offline)**:
  - O que acontece se o usuário tirar a foto e o dispositivo perder totalmente o sinal antes do upload? 
  - *Comportamento*: O app armazena a tarefa de upload em uma fila de sincronização offline persistente, exibindo uma mensagem amigável de que o item será analisado e cadastrado assim que a conexão retornar.
- **Falha Parcial da Câmera ou Sem Permissão de Hardware**:
  - Como o sistema se comporta caso o usuário recuse o acesso à câmera?
  - *Comportamento*: O app apresenta uma tela alternativa elegante convidando o usuário a digitar o nome do objeto manualmente ou a permitir o acesso à câmera através das configurações do sistema operacional.
- **Conflito de Sincronização (Edição Concorrente)**:
  - O que acontece se um objeto for editado offline no celular e modificado no backend concorrentemente por outro cliente?
  - *Comportamento*: O app adota a estratégia de "Última Edição Prevalece" baseada no timestamp da alteração, mantendo logs estruturados locais.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O aplicativo MUST possuir layout simples e em formato de wireframe direto, focado na usabilidade de fluxo e na inicialização esquelética das bibliotecas (Moti, Reanimated, Skia) sem estilizações ou shaders complexos nesta fase.
- **FR-002**: O aplicativo MUST gerenciar a sessão do usuário de forma segura através de persistência local encriptada de tokens JWT.
- **FR-003**: O aplicativo MUST manter cache local (offline persistence) atualizado de todos os objetos, habitats e ambientes do usuário para carregamento instantâneo.
- **FR-004**: O aplicativo MUST fornecer funcionalidade de busca e filtragem instantânea local por texto.
- **FR-005**: O aplicativo MUST integrar-se nativamente com a câmera do dispositivo, incluindo compressão de imagem no lado do cliente em formato **JPEG com tamanho máximo de 500KB** antes do envio à API.
- **FR-006**: O aplicativo MUST implementar a interface da máquina de estados do onboarding conversacional guiado por IA, renderizando mensagens em formato de balões de chat interativos em layout básico.
- **FR-007**: O aplicativo MUST exibir a tela de resultado "Treco-Dex Entry" com a foto e localização exata do habitat do item encontrado por busca semântica ou visual.
- **FR-008**: O aplicativo MUST monitorar a conectividade de rede do dispositivo e gerenciar uma fila de sincronização em segundo plano para ações realizadas offline.

### Key Entities

- **User Session**: Mantém o estado de login, JWT e dados básicos do usuário no dispositivo.
- **Local Object (Species)**: Representação em cache do objeto físico, contendo ID, nome, descrição humorística, estado organizacional, URI da imagem local/remota e ID do habitat associado.
- **Local Habitat**: Representação em cache da localização física com nome, URI da foto do habitat e associação ao ambiente de alto nível.
- **Local Environment**: Agrupamento de habitats (ex: Cozinha, Escritório).
- **OfflineSyncQueue**: Fila de transações e atualizações geradas offline que precisam ser despachadas ao backend em lote.

---

## Success Criteria *(mandatory)*

## Measurable Outcomes

- **SC-001**: O tempo de carregamento inicial do aplicativo (Cold Start) para exibição do dashboard em modo offline deve ser inferior a 1.2 segundos.
- **SC-002**: O aplicativo deve realizar transições de tela completas de forma estável, sem travamentos na execução de código nativo e das APIs integradas.
- **SC-003**: A barra de busca local deve retornar resultados filtrados em menos de 100ms contra um catálogo simulado contendo até 1.000 objetos cadastrados.
- **SC-004**: O upload e compressão da imagem do treco capturada pela câmera nativa deve ser finalizado e processado localmente em menos de 1.5 segundos (antes de enviar à rede).

---

## Assumptions

- **Stack Técnica Homologada**: A aplicação será construída utilizando **React Native + Expo (TypeScript)** com roteamento via **Expo Router**, gerenciamento de estado via **Zustand**, sincronização de rede com **React Query / TanStack Query**, persistência ultrarrápida offline com **MMKV**, e interface rica/animações fluidas baseadas em **Reanimated**, **Moti** e renderizações 2D via **React Native Skia**.
- O dispositivo do usuário possui capacidade de hardware suficiente para compressão de imagens local e suporte a animações de hardware aceleradas (Reanimated/Moti/Skia).
- O backend `treco-dex-api` está em execução e acessível através de endpoints REST documentados.
- As permissões nativas de câmera e galeria do celular são fundamentais para o funcionamento pleno dos fluxos P2 de IA multimodal.
- Sincronização multi-dispositivo concorrente em tempo real é considerada fora de escopo para esta especificação inicial (foco no cache offline local-first).
