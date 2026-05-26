# Tasks: TrecoDex Mobile Foundation

**Input**: Design documents from `/specs/001-mobile-app-foundation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Tests below focus on offline verification, query caching, and core functional manual validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize React Native Expo project structure at `/home/guilherme.padilha/projetos/treco-dex-mobile` using typescript template
- [x] T002 Configure core dependencies in `/home/guilherme.padilha/projetos/treco-dex-mobile/package.json` (`expo-router`, `zustand`, `@tanstack/react-query`, `react-native-mmkv`, `react-native-reanimated`, `moti`, `@shopify/react-native-skia`)
- [x] T003 [P] Configure TypeScript compiler options in `/tsconfig.json` and strict ESLint/Prettier configuration in `/.eslintrc.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Initialize MMKV storage client instance and helpers in `/src/utils/storage.ts`
- [x] T005 Setup global Zustand authentication store in `/src/store/useAuthStore.ts`
- [x] T006 [P] Initialize typed Axios/Fetch API client with automatic JWT bearer token headers and interceptors in `/src/services/api.ts`
- [x] T007 Setup global Zustand offline sync store queue to track pending mutations in `/src/store/useSyncStore.ts`
- [x] T008 [P] Configure TanStack Query client with MMKV local cache persister in `/src/services/queryClient.ts`
- [x] T009 Create root router layout file containing QueryClient, Zustand, and Theme Providers in `/src/app/_layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Autenticação Segura & Sessão Offline (Priority: P1) 🎯 MVP

**Goal**: Establish JWT authenticated session, persist it locally in MMKV, and load cached data offline.

**Independent Test**: Perform secure login, verify JWT is stored in MMKV, disable internet, reload app, and ensure catalog loads from local MMKV cache with an "Offline Mode" banner.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create the secure login screen wireframe layout (inputs and submit button) in `/src/app/(auth)/login.tsx`
- [x] T011 [US1] Implement user login form handler and integrate with useAuthStore and API login endpoint in `/src/app/(auth)/login.tsx`
- [x] T012 [P] [US1] Create the register screen wireframe layout in `/src/app/(auth)/register.tsx`
- [x] T013 [US1] Implement registration form handler and API registration integration in `/src/app/(auth)/register.tsx`
- [ ] T014 [US1] Implement automated local session recovery (JWT check from MMKV storage) on app startup in `/src/app/_layout.tsx`

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - A Pokédex de Trecos & Busca Local (Priority: P1)

**Goal**: Display catalog grid of items and habitats, and filter locally without latency.

**Independent Test**: Load grid, verify it works in Offline Mode, search by name, and confirm instant filtering (under 100ms) from local cache.

### Implementation for User Story 2

- [ ] T015 [US2] Create basic tab-navigation structure with file routes in `/src/app/(tabs)/_layout.tsx`
- [ ] T016 [US2] Create high-performance Pokedex grid layout for objects list in `/src/app/(tabs)/index.tsx`
- [ ] T017 [P] [US2] Create object detail modal/screen in `/src/app/object/[id].tsx`
- [ ] T018 [US2] Implement TanStack Query fetchers and custom hooks for fetching object lists and habitats in `/src/services/queries/useObjects.ts`
- [ ] T019 [US2] Implement instant text-based local search and filtering of objects in `/src/app/(tabs)/index.tsx` without network latency
- [ ] T020 [US2] Implement object physical state modification (e.g. updating item state/location) in `/src/app/object/[id].tsx` with offline fallback to useSyncStore

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Cadastro Conversacional de Objeto com Câmera (Priority: P2)

**Goal**: Take a photo of an item, compress it, start chatbot conversational onboarding, and receive AI recommended habitat.

**Independent Test**: Take a photo using native camera, compress image, trigger chat flow, verify suggestion from backend, and save.

### Implementation for User Story 3

- [ ] T021 [US3] Create Camera and Onboarding conversational view structure in `/src/app/(tabs)/camera.tsx`
- [ ] T022 [US3] Integrate native camera component (expo-camera) and display basic Skia wireframe reticle in `/src/app/(tabs)/camera.tsx`
- [ ] T023 [P] [US3] Implement client-side image compression utility in `/src/utils/media.ts` supporting JPEG format and max size of 500KB
- [ ] T024 [US3] Setup conversational onboarding Zustand store in `/src/store/useChatOnboarding.ts` to manage chatbot message state
- [ ] T025 [US3] Create conversational chat list and bubble components in `/src/components/chat/ChatBubble.tsx` and `/src/components/chat/ChatList.tsx`
- [ ] T026 [US3] Integrate image compression and upload with chat onboarding flow trigger in `/src/app/(tabs)/camera.tsx`

**Checkpoint**: User Story 3 should be fully functional and testable.

---

## Phase 6: User Story 4 - Busca Visual Multimodal & Recuperação Rápida (Priority: P2)

**Goal**: Identify lost items via image, query vector visual search, and view correct habitat location visual guides.

**Independent Test**: Upload a photo of a known object, ensure app displays the correct designated location entry ("Treco-Dex Entry").

### Implementation for User Story 4

- [ ] T027 [US4] Create visual results detail view "Treco-Dex Entry" in `/src/app/result/entry.tsx`
- [ ] T028 [US4] Implement visual search query hook calling `/api/objects/visual-search` in `/src/services/queries/useVisualSearch.ts`
- [ ] T029 [US4] Integrate visual search trigger in `/src/app/(tabs)/camera.tsx` and navigate to visual results entry upon success
- [ ] T030 [US4] Implement onboarding flow fallback trigger if object visual search returns as new/unknown in `/src/app/result/entry.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: General stability, error boundaries, styling, and final checks.

- [ ] T031 [P] Setup global error boundary, offline warning toast, and custom layout styling in `/src/app/_layout.tsx`
- [ ] T032 Write end-to-end integration manual tests in `/specs/001-mobile-app-foundation/quickstart.md`
- [ ] T033 [P] Verify code quality, linting issues, and run formatting check across all files in `/src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Depends on US3 components (Camera integration, image compression)

---

## Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Models and store components within a story marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch both layout templates for User Story 1 together:
Task: "Create the secure login screen wireframe layout in /src/app/(auth)/login.tsx"
Task: "Create the register screen wireframe layout in /src/app/(auth)/register.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready
