# TrecoDex Mobile — End-to-End Integration Manual Verification

This document provides step-by-step instructions to manually verify and test all user stories and architectural requirements of the **TrecoDex Mobile** application.

---

## 📋 Prerequisites & Local Setup

### 1. Start the Backend API

Ensure the Spring Boot backend (`treco-dex-api`) and its supporting PostgreSQL + Vector database are active:

```bash
# In the treco-dex-api folder
./gradlew bootRun
```

_Verify that the API resolves locally on port `8082` (e.g., `http://192.168.68.107:8082`)._

### 2. Configure Frontend Environment

Ensure `src/services/api.ts` points to your exact backend address:

```typescript
const BASE_URL = 'http://192.168.68.107:8082';
```

### 3. Start Expo Dev Server

Start the frontend development environment with clean caches:

```bash
# In the treco-dex-mobile folder
npx expo start --clear
```

_Press `a` to run in an Android emulator/device or `i` for iOS._

---

## 🧪 Step-by-Step Test Scenarios

### Test Suite 1: Conversational Authentication & Session (US1)

> **Goal**: Verify registration, login, session persistence, and logout.

1. **Clean Start**: Open the application on your device. Since you are unauthenticated, you must be automatically redirected to `/src/app/(auth)/login`.
2. **Registration Flow**:
   - Click **"NÃO POSSUI CONTA? CADASTRE-SE"**.
   - Fill out the form: Name, Email, Password, and Confirm Password.
   - Click **"REGISTRAR AGORA"**.
   - _Pass Criteria_: A success toast appears, and you are redirected to the Login Screen.
3. **Login & Persistence**:
   - Input the registered email and password.
   - Press **"ENTRAR NO SISTEMA"**.
   - _Pass Criteria_: You are redirected to the Home Tab `/(tabs)/index` (Pokedex Grid).
   - **Reboot Test**: Force close the app and open it again.
   - _Pass Criteria_: The app starts directly in the Home Tab (no login prompted) due to secure local session persistence in MMKV.
4. **Session Termination**:
   - Go to the **PERFIL** tab.
   - Click **"ENCERRAR SESSÃO (LOGOUT)"**.
   - _Pass Criteria_: Cache is wiped, and you are redirected back to the Login Screen.

---

### Test Suite 2: Cyberpunk Grid Catalog & Local Search (US2)

> **Goal**: Verify responsive card rendering, offline-state warnings, and latency-free local filtering.

1. **Dashboard Loading**: Open the **TRECOS** Home tab.
2. **Visual Inspection**:
   - Check card layouts (2 columns): each card must display a geometric placeholder thumbnail, destination habitat tag, physical size (`sizeCm`), and neon badges indicating organization status.
3. **Offline Banner Validation**:
   - In the **PERFIL** tab, toggle **"Simular Modo Offline"** ON.
   - _Pass Criteria_: A floating orange banner **"⚠️ MODO OFFLINE ATIVO — OPERANDO EM REDE LOCAL MMKV"** appears instantly at the bottom of the screen.
4. **Instant Searching (< 100ms)**:
   - Tap the search bar and type `"chave"`.
   - _Pass Criteria_: Items are filtered instantly. Tap backspace and type `"escritório"`. Items in the Escritório environment are filtered immediately with zero network latency.

---

### Test Suite 3: Detail Modals & Offline Mutation Queuing (US2)

> **Goal**: Verify physical state modification and offline transactional resilience.

1. **Object Details**:
   - Tap any item (e.g., _Chave Reserva_) in the Pokedex Grid.
   - _Pass Criteria_: The app opens `/src/app/object/[id].tsx` presenting full specifications (size, description, habitat name, and environment).
2. **Offline Mutation Test**:
   - Ensure **Modo Offline** is enabled.
   - Press **"MARCAR COMO GUARDADO"** or **"MARCAR COMO FORA DO LUGAR"**.
   - _Pass Criteria_: A dialog box appears saying: _"💾 Modo Offline: Seu dispositivo está sem conexão. A alteração foi salva localmente e será sincronizada assim que a internet retornar!"_.
   - State is visually updated on-screen immediately.
3. **Fila de Sincronização (MMKV)**:
   - Verify using React Native debugger or inspect the `useSyncStore` queue state. A transaction is successfully scheduled in the queue with a custom transaction ID.

---

### Test Suite 4: Media Onboarding & Compression (US3)

> **Goal**: Verify camera integration, Skia reticle overlays, JPEG client-side compression, and chatbot assistant steps.

1. **Camera Permissions**:
   - Tap the **SCANNER** tab.
   - If prompted for permissions, click **"CONCEDER PERMISSÃO"**.
2. **Skia Overlays**:
   - With camera active, check the central area of the screen.
   - _Pass Criteria_: Four glowing corner brackets (Skia Vector Reticle) are drawn on top of the camera viewport.
3. **Capture & Compression**:
   - Switch the top slider toggle to **"CADASTRO CHAT"**.
   - Aim at an item and press the circular shutter button.
   - _Pass Criteria_: The image manipulator resizes the photo (max 1200px) and compresses it below `500KB`.
4. **Chatbot Simulation**:
   - The camera fades into the **Cadastro Conversacional** chat.
   - The AI bubble analyzes the photo and prints a recommended location: `"📍 Organizador de Cabos no Escritório (Confiança: 98%)"`.
   - Click `"SIM, CONFIRMAR DESTINO"`. The AI confirms the registration and finishes the wizard.

---

### Test Suite 5: Visual Search & Fallback Routing (US4)

> **Goal**: Verify fast visual search, results detail view, and unidentified onboarding fallbacks.

1. **Visual Search Mode**:
   - Tap the **SCANNER** tab.
   - Slide the top toggle to **"BUSCA RÁPIDA"**.
2. **Reconhecimento**:
   - Take a picture of a known object.
   - _Pass Criteria_: Upon upload, the app redirects to `/src/app/result/entry.tsx` and displays `"TRECO ENCONTRADO!"` with its designated habitat location and AI reasoning.
3. **Unidentified Fallback**:
   - Take a picture of an unknown item.
   - _Pass Criteria_: The results screen displays `"TRECO INÉDITO DETECTADO"`.
   - Tap **"INICIAR CADASTRO CHAT"**.
   - _Pass Criteria_: You are instantly redirected to `/camera` and the Conversational Onboarding is launched using the picture you just took!

---

## 🛠️ Troubleshooting Guide

### 1. Developer Server Redirection Issues

If you face an "Unmatched Route" warning, clear your router cache:

```bash
npx expo start --clear
```

### 2. Network Timeouts on Real Devices

If your physical phone shows network errors trying to reach the API:

- Ensure your phone and development machine are connected to the exact same Wi-Fi network.
- Ensure your local system firewall is not blocking incoming requests on port `8082`.
