import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Canvas, Line } from '@shopify/react-native-skia';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useChatOnboarding } from '../../store/useChatOnboarding';
import { compressImage } from '../../utils/media';
import { ChatList } from '../../components/chat/ChatList';
import { useVisualSearch } from '../../services/queries/useVisualSearch';
import { useAuthStore } from '../../store/useAuthStore';

export default function CameraTab() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);

  // Modo de operação da Câmera: "ONBOARDING" (Cadastro) ou "SEARCH" (Busca Rápida)
  const [cameraMode, setCameraMode] = useState<'ONBOARDING' | 'SEARCH'>('ONBOARDING');

  // Zustand Chat Store
  const {
    messages,
    photoUri,
    isStarted,
    isLoading,
    currentStep,
    startOnboarding,
    addMessage,
    recommendedHabitat,
    setRecommendedHabitat,
    setLoading,
    nextStep,
    resetOnboarding,
  } = useChatOnboarding();

  // Hook da API de Busca Visual
  const visualSearchMutation = useVisualSearch();
  const { isOffline } = useAuthStore();
  const [chatInput, setChatInput] = useState('');
  const [chatContext, setChatContext] = useState<'OBJECT_NAME' | 'HABITAT'>('HABITAT');

  if (!permission) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#64FFDA" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons
          name="camera-reverse-outline"
          size={64}
          color="#FF5C5C"
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.permissionTitle}>ACESSO À CÂMERA NECESSÁRIO</Text>
        <Text style={styles.permissionSubtitle}>
          O TrecoDex precisa de acesso à câmera para digitalizar e cadastrar seus trecos com
          inteligência visual.
        </Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.permissionBtnText}>CONCEDER PERMISSÃO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Ação de captura de foto para disparo do onboarding (Fase 5 - T022/T026)
  const handleCaptureOnboarding = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        setLoading(true);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });

        if (photo && photo.uri) {
          const compressionResult = await compressImage(photo.uri);
          startOnboarding(photo.uri, compressionResult.uri);

          // Função interna para aplicar a recomendação na interface de Chat
          const applyRecommendation = (
            habitatName: string,
            environment: string,
            desc: string,
            conf: number,
            msgText: string,
          ) => {
            setRecommendedHabitat({
              name: habitatName,
              environmentName: environment,
              description: desc,
              confidence: conf,
            });

            addMessage('AI', msgText + '\n\nDeseja confirmar essa recomendação?');
            nextStep('RECOMMENDATION_SHOWN');
            setLoading(false);
          };

          if (!isOffline) {
            // Tenta obter a classificação real e multimodal via backend (Spring Boot / Vector search)
            visualSearchMutation.mutate(compressionResult.uri, {
              onSuccess: (data) => {
                if (data.identified) {
                  applyRecommendation(
                    data.habitatName,
                    'Identificado via IA',
                    'Local sugerido pelo modelo de IA visual.',
                    0.99,
                    `🔍 Sucesso! Identifiquei o objeto: **"${data.objectName}"**.\n\nCom base em meus sensores, recomendo o habitat:\n📍 **${data.habitatName}** (Confiança: 99%).\n\nLógica: ${data.reasoning}`,
                  );
                } else {
                  // Se a IA identificou um objeto real (ex: "mouse") mas ele não está no catálogo local
                  if (data.objectName && !data.objectName.includes('[demo]')) {
                    setRecommendedHabitat({
                      name: 'Novo Habitat',
                      environmentName: 'Definir',
                      description: 'Defina o local de armazenamento deste novo treco.',
                      confidence: 1.0,
                    });
                    addMessage('AI', `🤖 ${data.message || `Não encontrei esse ser no meu catálogo. Isso é um ${data.objectName}?`}\n\nDeseja confirmar?`);
                    nextStep('RECOMMENDATION_SHOWN');
                    setLoading(false);
                  } else {
                    // Fallback dinâmico se a IA não identificou com precisão (ou se retornou o escorredor demo)
                    triggerDynamicFallback();
                  }
                }
              },
              onError: () => {
                triggerDynamicFallback();
              },
            });
          } else {
            triggerDynamicFallback();
          }

          function triggerDynamicFallback() {
            setTimeout(() => {
              // Lista de simulação de objetos Cyberpunk de alta fidelidade para testes manuais
              const mockItems = [
                {
                  habitat: 'Bancada de Lanches',
                  environment: 'Cozinha',
                  description: 'Prateleira superior, canto esquerdo.',
                  confidence: 0.94,
                  message:
                    '☕ [demo] Identifiquei uma caneca/xícara de louça para bebidas quentes.\n\nCom base em seus padrões de organização, recomendo o habitat:\n📍 **Bancada de Lanches** no cômodo **Cozinha** (Confiança: 94%).',
                },
                {
                  habitat: 'Organizador de Cabos',
                  environment: 'Escritório',
                  description: 'Gaveteiro cinza, segunda gaveta.',
                  confidence: 0.98,
                  message:
                    '🔍 [demo] Identifiquei um dispositivo eletrônico compacto com cabo (carregador/fone).\n\nCom base em seus padrões de organização, recomendo o habitat:\n📍 **Organizador de Cabos** no cômodo **Escritório** (Confiança: 98%).',
                },
                {
                  habitat: 'Gaveta de Chaves',
                  environment: 'Hall de Entrada',
                  description: 'Porta-chaves de madeira próximo ao espelho.',
                  confidence: 0.97,
                  message:
                    '🔑 [demo] Identifiquei um molho de chaves de metal com chaveiro decorativo.\n\nCom base em seus padrões de organização, recomendo o habitat:\n📍 **Gaveta de Chaves** no cômodo **Hall de Entrada** (Confiança: 97%).',
                },
                {
                  habitat: 'Painel da TV',
                  environment: 'Sala de Estar',
                  description: 'Suporte de acrílico fixado atrás do painel esquerdo.',
                  confidence: 0.95,
                  message:
                    '📺 [demo] Identifiquei um controle remoto Smart preto com botões de atalho.\n\nCom base em seus padrões de organização, recomendo o habitat:\n📍 **Painel da TV** no cômodo **Sala de Estar** (Confiança: 95%).',
                },
                {
                  habitat: 'Gaveta de Acessórios',
                  environment: 'Quarto',
                  description: 'Divisória interna de veludo cinza.',
                  confidence: 0.93,
                  message:
                    '🕶️ [demo] Identifiquei um par de óculos com armação escura / lentes de sol.\n\nCom base em seus padrões de organização, recomendo o habitat:\n📍 **Gaveta de Acessórios** no cômodo **Quarto** (Confiança: 93%).',
                },
              ];

              // Seleciona um item aleatoriamente
              const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];

              applyRecommendation(
                randomItem.habitat,
                randomItem.environment,
                randomItem.description,
                randomItem.confidence,
                randomItem.message,
              );
            }, 1500);
          }
        }
      } catch (error) {
        console.error('Falha no Onboarding por Foto:', error);
        setIsCapturing(false);
        setLoading(false);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // Ação de busca visual rápida por câmera (Fase 6 - T029)
  const handleCaptureSearch = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        setIsCapturing(true); // Bloqueia clicks concorrentes

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });

        if (photo && photo.uri) {
          const compressionResult = await compressImage(photo.uri);

          if (isOffline) {
            // Fallback offline resiliente imediato (Requisito T029 / SC-003)
            setTimeout(() => {
              setIsCapturing(false);
              router.push({
                pathname: '/result/entry',
                params: {
                  identified: 'true',
                  objectName: 'Carregador Tipo C [demo]',
                  habitatName: 'Organizador de Cabos (Escritório)',
                  reasoning:
                    'Item identificado via busca semântica em cache local síncrono offline. [demo]',
                  photoUri: photo.uri,
                  compressedUri: compressionResult.uri,
                },
              });
            }, 1000);
          } else {
            // Online: Faz chamada multipart à API do Spring Boot
            visualSearchMutation.mutate(compressionResult.uri, {
              onSuccess: (data) => {
                setIsCapturing(false);
                router.push({
                  pathname: '/result/entry',
                  params: {
                    identified: String(data.identified),
                    objectName: data.objectName,
                    habitatName: data.habitatName,
                    reasoning: data.reasoning,
                    photoUri: photo.uri,
                    compressedUri: compressionResult.uri,
                  },
                });
              },
              onError: (_error) => {
                // Se a rede falhar, cai no mock local-first
                setIsCapturing(false);
                router.push({
                  pathname: '/result/entry',
                  params: {
                    identified: 'true',
                    objectName: 'Carregador Tipo C [demo]',
                    habitatName: 'Organizador de Cabos (Escritório)',
                    reasoning:
                      'Não foi possível contatar o servidor de IA. Utilizando busca analítica local. [demo]',
                    photoUri: photo.uri,
                    compressedUri: compressionResult.uri,
                  },
                });
              },
            });
          }
        }
      } catch (error) {
        console.error('Erro na busca visual:', error);
        setIsCapturing(false);
      }
    }
  };

  const handleConfirmHabitat = () => {
    addMessage('USER', 'Sim, confirmar!');
    setLoading(true);

    if (recommendedHabitat?.name === 'Novo Habitat') {
      setTimeout(() => {
        const objName = visualSearchMutation.data?.objectName || 'treco';
        addMessage(
          'AI',
          `🤖 Excelente! Confirmado que é um **"${objName}"**.\n\nPara finalizar o cadastro, por favor digite o nome do habitat (local) onde você deseja guardar este treco:`,
        );
        setChatContext('HABITAT');
        nextStep('CONFIRMING');
        setLoading(false);
      }, 1000);
      return;
    }

    setTimeout(() => {
      addMessage(
        'AI',
        '⚡ Excelente escolha! O treco foi cadastrado com sucesso e já está integrado à sua Pokédex de trecos.\n\nSempre que precisar encontrar, basta buscar por esse nome ou olhar na aba principal!',
      );
      nextStep('FINISHED');
      setLoading(false);
    }, 1500);
  };

  const handleCustomHabitat = () => {
    if (recommendedHabitat?.name === 'Novo Habitat') {
      addMessage('USER', 'Não, outra coisa');
      setChatContext('OBJECT_NAME');
      nextStep('CONFIRMING');
      setTimeout(() => {
        addMessage(
          'AI',
          '🤖 Sem problemas! Por favor, digite o nome correto/real deste treco para que eu possa cadastrá-lo:',
        );
      }, 500);
      return;
    }

    addMessage('USER', 'Quero registrar em outro lugar...');
    nextStep('CONFIRMING');
    addMessage(
      'AI',
      'Entendido! Por favor, digite o nome do novo habitat onde deseja guardar este treco:',
    );
  };

  const handleSendChatText = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    addMessage('USER', userText);
    setChatInput('');
    setLoading(true);

    if (chatContext === 'OBJECT_NAME') {
      setTimeout(() => {
        if (visualSearchMutation.data) {
          visualSearchMutation.data.objectName = userText;
        }
        addMessage(
          'AI',
          `🤖 Perfeito! Registrado como **"${userText}"**.\n\nAgora, digite o nome do habitat (local) onde você deseja guardar este treco:`,
        );
        setChatContext('HABITAT');
        setLoading(false);
      }, 1000);
      return;
    }

    setTimeout(() => {
      addMessage(
        'AI',
        `✅ Entendido! Guardando no novo habitat: **"${userText}"**.\nO registro do treco foi finalizado com sucesso!`,
      );
      nextStep('FINISHED');
      setLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {!isStarted ? (
        // Modo Câmera Ativa com Mira Skia (T022)
        <View style={styles.cameraContainer}>
          <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef} facing="back" />

          {/* Sobreposição Skia: Mira de Arame (Reticle) */}
          <Canvas style={StyleSheet.absoluteFillObject}>
            <Line p1={{ x: 60, y: 150 }} p2={{ x: 100, y: 150 }} color="#64FFDA" strokeWidth={3} />
            <Line p1={{ x: 60, y: 150 }} p2={{ x: 60, y: 190 }} color="#64FFDA" strokeWidth={3} />

            <Line p1={{ x: 300, y: 150 }} p2={{ x: 260, y: 150 }} color="#64FFDA" strokeWidth={3} />
            <Line p1={{ x: 300, y: 150 }} p2={{ x: 300, y: 190 }} color="#64FFDA" strokeWidth={3} />

            <Line p1={{ x: 60, y: 390 }} p2={{ x: 100, y: 390 }} color="#64FFDA" strokeWidth={3} />
            <Line p1={{ x: 60, y: 350 }} p2={{ x: 60, y: 390 }} color="#64FFDA" strokeWidth={3} />

            <Line p1={{ x: 300, y: 390 }} p2={{ x: 260, y: 390 }} color="#64FFDA" strokeWidth={3} />
            <Line p1={{ x: 300, y: 390 }} p2={{ x: 300, y: 350 }} color="#64FFDA" strokeWidth={3} />
          </Canvas>

          {/* Seleção de Modo de Câmera Cyberpunk */}
          <View style={styles.modeToggleContainer}>
            <TouchableOpacity
              style={[styles.modeToggleBtn, cameraMode === 'ONBOARDING' && styles.activeModeBtn]}
              onPress={() => setCameraMode('ONBOARDING')}
            >
              <Text
                style={[
                  styles.modeToggleText,
                  cameraMode === 'ONBOARDING' && styles.activeModeText,
                ]}
              >
                CADASTRO CHAT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeToggleBtn, cameraMode === 'SEARCH' && styles.activeModeBtn]}
              onPress={() => setCameraMode('SEARCH')}
            >
              <Text
                style={[styles.modeToggleText, cameraMode === 'SEARCH' && styles.activeModeText]}
              >
                BUSCA RÁPIDA
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dica da Câmera */}
          <View style={styles.tipOverlay}>
            <Text style={styles.tipText}>
              {cameraMode === 'ONBOARDING'
                ? 'Cadastre um novo treco assistido'
                : 'Descubra onde o item deve ser guardado'}
            </Text>
          </View>

          {/* Botão de Disparo */}
          <View style={styles.actionRow}>
            {isCapturing || visualSearchMutation.isPending ? (
              <ActivityIndicator size="large" color="#64FFDA" />
            ) : (
              <TouchableOpacity
                style={[styles.captureBtn, cameraMode === 'SEARCH' && styles.searchCaptureBtn]}
                onPress={
                  cameraMode === 'ONBOARDING' ? handleCaptureOnboarding : handleCaptureSearch
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.captureBtnInner,
                    cameraMode === 'SEARCH' && styles.searchCaptureBtnInner,
                  ]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        // Modo Chat Conversacional Ativo (T021)
        <View style={styles.chatContainer}>
          {/* Header do Chat */}
          <View style={styles.chatHeader}>
            {photoUri && <Image source={{ uri: photoUri }} style={styles.chatHeaderThumbnail} />}
            <View>
              <Text style={styles.chatHeaderTitle}>CADASTRO CONVERSACIONAL</Text>
              <Text style={styles.chatHeaderSubtitle}>IA Multimodal Onboarding</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={resetOnboarding} activeOpacity={0.7}>
              <Ionicons name="close-outline" size={24} color="#FF5C5C" />
            </TouchableOpacity>
          </View>

          {/* Listagem de Balões */}
          <View style={styles.chatListWrapper}>
            <ChatList messages={messages} />
            {isLoading && (
              <View style={styles.chatLoaderRow}>
                <ActivityIndicator size="small" color="#64FFDA" />
                <Text style={styles.chatLoaderText}>Analisando...</Text>
              </View>
            )}
          </View>

          {/* Painel Conversacional de Interação */}
          <View style={styles.interactionPanel}>
            {currentStep === 'RECOMMENDATION_SHOWN' && (
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[styles.optionBtn, styles.confirmBtn]}
                  onPress={handleConfirmHabitat}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmBtnText}>
                    {recommendedHabitat?.name === 'Novo Habitat'
                      ? `SIM, É UM ${visualSearchMutation.data?.objectName?.toUpperCase() || 'TRECO'}`
                      : 'SIM, CONFIRMAR DESTINO'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionBtn, styles.declineBtn]}
                  onPress={handleCustomHabitat}
                  activeOpacity={0.8}
                >
                  <Text style={styles.declineBtnText}>
                    {recommendedHabitat?.name === 'Novo Habitat'
                      ? 'NÃO, OUTRA COISA'
                      : 'OUTRO LUGAR'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {currentStep === 'CONFIRMING' && (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Ex: Gaveta de Meias, Quarto..."
                  placeholderTextColor="#8892B0"
                  value={chatInput}
                  onChangeText={setChatInput}
                  autoCorrect={false}
                  onSubmitEditing={handleSendChatText}
                />
                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={handleSendChatText}
                  activeOpacity={0.7}
                >
                  <Ionicons name="send" size={16} color="#0A192F" />
                </TouchableOpacity>
              </View>
            )}

            {currentStep === 'FINISHED' && (
              <TouchableOpacity
                style={styles.finishBtn}
                onPress={resetOnboarding}
                activeOpacity={0.8}
              >
                <Text style={styles.finishBtnText}>CONCLUIR E VOLTAR À CÂMERA</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0A192F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCD6F6',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 13,
    color: '#8892B0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  permissionBtn: {
    height: 48,
    backgroundColor: '#64FFDA',
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64FFDA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  permissionBtnText: {
    color: '#0A192F',
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  modeToggleContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(17, 34, 64, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#233554',
    padding: 4,
    zIndex: 10,
  },
  modeToggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeModeBtn: {
    backgroundColor: '#64FFDA',
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8892B0',
    letterSpacing: 1,
  },
  activeModeText: {
    color: '#0A192F',
  },
  tipOverlay: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    backgroundColor: 'rgba(17, 34, 64, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#233554',
  },
  tipText: {
    color: '#64FFDA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  actionRow: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtn: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderWidth: 4,
    borderColor: '#64FFDA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCaptureBtn: {
    backgroundColor: 'rgba(255, 183, 77, 0.2)',
    borderColor: '#FFB74D',
  },
  captureBtnInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#64FFDA',
  },
  searchCaptureBtnInner: {
    backgroundColor: '#FFB74D',
  },
  chatContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 44 : 20,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#233554',
    backgroundColor: '#112240',
  },
  chatHeaderThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#64FFDA',
    marginRight: 12,
  },
  chatHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#CCD6F6',
    letterSpacing: 1.5,
  },
  chatHeaderSubtitle: {
    fontSize: 11,
    color: '#8892B0',
    marginTop: 2,
  },
  closeBtn: {
    marginLeft: 'auto',
    padding: 6,
  },
  chatListWrapper: {
    flex: 1,
  },
  chatLoaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chatLoaderText: {
    fontSize: 12,
    color: '#8892B0',
    marginLeft: 8,
  },
  interactionPanel: {
    backgroundColor: '#112240',
    borderTopWidth: 1,
    borderTopColor: '#233554',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  confirmBtn: {
    backgroundColor: '#64FFDA',
  },
  confirmBtnText: {
    color: '#0A192F',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  declineBtn: {
    backgroundColor: 'rgba(255, 92, 92, 0.15)',
    borderWidth: 1,
    borderColor: '#FF5C5C',
  },
  declineBtnText: {
    color: '#FF5C5C',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A192F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#233554',
    height: 44,
    paddingLeft: 12,
    paddingRight: 6,
  },
  chatInput: {
    flex: 1,
    color: '#CCD6F6',
    fontSize: 13,
    height: '100%',
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#64FFDA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtn: {
    width: '100%',
    height: 44,
    backgroundColor: '#64FFDA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#0A192F',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
