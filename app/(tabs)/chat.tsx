import character from '@/assets/images/chat_Image.png';
import TimeBasedBackground from '@/components/TimeBasedBackground';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ChatApiResponse = {
  reply?: string;
  message?: string;
  content?: string;
  assistantMessage?: string;
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

const DEFAULT_MESSAGE = '안녕하세요. 오늘 어떤 이야기를 해볼까요?';

const ChatScreen = () => {
  const { token } = useAuth();
  const inputRef = useRef<TextInput>(null);
  const [botMessage, setBotMessage] = useState(DEFAULT_MESSAGE);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const resolveAssistantMessage = (data: ChatApiResponse) => {
    return (
      data.reply?.trim() ||
      data.assistantMessage?.trim() ||
      data.content?.trim() ||
      data.choices?.[0]?.message?.content?.trim() ||
      '지금은 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.'
    );
  };

  const handleSend = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || loading) {
      return;
    }

    setUserInput('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      const response = await axios.post<ChatApiResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.CHAT_COMPLETIONS}`,
        { message: trimmedInput },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      setBotMessage(resolveAssistantMessage(response.data));
    } catch (error: any) {
      const status = error.response?.status;
      const message =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message;

      if (status === 404) {
        setBotMessage(
          '채팅 백엔드가 아직 연결되지 않았어요. 서버에 /api/chat/completions 엔드포인트를 만들어 주세요.'
        );
        return;
      }

      if (status === 401) {
        Alert.alert('로그인 필요', '채팅 기능을 사용하려면 다시 로그인해 주세요.');
      }

      setBotMessage(
        message || '채팅 요청 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handlePlusPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TimeBasedBackground>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.transparentHeaderSpacer} />

        <View style={styles.content}>
          <View style={styles.fixedCharacterWrapper} pointerEvents="none">
            <Image source={character} style={styles.botImageLarge} />
          </View>

          <View style={styles.messageContainerAdjusted}>
            <View style={styles.botBubble}>
              {loading ? (
                <ActivityIndicator size="small" color="#555" />
              ) : (
                <Text style={styles.botText}>{botMessage}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputArea}>
              <TouchableOpacity
                style={styles.plusButton}
                onPress={handlePlusPress}
              >
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>

              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={userInput}
                onChangeText={setUserInput}
                placeholder="메시지를 입력하세요"
                multiline
                placeholderTextColor="#d1d5db"
              />

              <TouchableOpacity
                style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={loading}
              >
                <Text style={styles.sendButtonText}>전송</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TimeBasedBackground>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  transparentHeaderSpacer: {
    height: Platform.OS === 'ios' ? 80 : 35,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  fixedCharacterWrapper: {
    position: 'absolute',
    top: 173,
    left: 200,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  messageContainerAdjusted: {
    marginTop: 90,
    alignItems: 'center',
    paddingHorizontal: 20,
    right: 10,
    zIndex: 11,
  },
  botImageLarge: {
    width: 84,
    height: 114,
  },
  botBubble: {
    backgroundColor: 'rgba(230, 230, 250, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    maxWidth: '80%',
    marginBottom: 8,
  },
  botText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 30,
    marginHorizontal: 10,
    marginBottom: 120,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  plusText: {
    fontSize: 20,
    color: 'white',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 8,
    zIndex: 11,
  },
  sendButton: {
    minWidth: 52,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ChatScreen;
