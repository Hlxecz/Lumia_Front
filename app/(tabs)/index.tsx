// app/(tabs)/index.tsx
import { useAuth } from '@/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedCharacter from '../../components/AnimatedCharacter';
import TimeBasedBackground from '../../components/TimeBasedBackground';
 
import { API_BASE_URL, API_ENDPOINTS } from '../../constants/api';
import { useUser } from '../../context/UserContext';

interface QuestionDto {
  questionId: number;
  questionText: string;
  questionType: string;
}
interface NewMessageResponseDto {
  hasNewMessage: boolean;
  newMessage: QuestionDto | null;
}
const icons = {
    shop: require('../../assets/images/shop_icon.png'),
    music: require('../../assets/images/music_icon.png'),
    settings: require('../../assets/images/set.png'),
    seed: require('../../assets/images/seeds.png'),
    Character_1: require('../../assets/images/Character_1.png'),
    Character_2_animated: require('../../assets/images/Character_2.gif'),
    Character_3_static: require('../../assets/images/Character_3.png'),
    Character_3_animated: require('../../assets/images/Character_3.gif'),
    shirtpink: require('../../assets/images/stand_Pink.gif'),
    shirtblue: require('../../assets/images/stand_Blue.gif'),
    shirtorange: require('../../assets/images/stand_Orange.gif'),
    shirtnormal: require('../../assets/images/Character_3.gif'),
    hat1: require('../../assets/images/hat1.png'),
    hat2: require('../../assets/images/hat2.png'),
    hat3: require('../../assets/images/hat3.png'),
    Character2_smile: require('../../assets/images/Character2_smile.gif'),
    hello_Normal: require('../../assets/images/hello_Normal.gif'),
    jump_Normal: require('../../assets/images/jump_Normal.gif'),
    sit_Normal: require('../../assets/images/sit_Normal.gif'),
    hello_Blue: require('../../assets/images/hello_Blue.gif'),
    jump_Blue: require('../../assets/images/jump_Blue.gif'),
    sit_Blue: require('../../assets/images/sit_Blue.gif'),
    hello_Pink: require('../../assets/images/hello_Pink.gif'),
    jump_Pink: require('../../assets/images/jump_Pink.gif'),
    sit_Pink: require('../../assets/images/sit_Pink.gif'),
    hello_Orange: require('../../assets/images/hello_Orange.gif'),
    jump_Orange: require('../../assets/images/jump_Orange.gif'),
    sit_Orange: require('../../assets/images/sit_Orange.gif'),
};

const NEXT_NOTIFICATION_TIMESTAMP_KEY = 'next_notification_timestamp';
const checkAndRescheduleNotification = async (token: string | null) => { /* 이전과 동일 */ };

const MainScreen: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isFetchingOnDemand, setIsFetchingOnDemand] = useState(false);
  const [characterSource, setCharacterSource] = useState(icons.Character_1);
  const [isShaking, setIsShaking] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const router = useRouter();
  const { token } = useAuth();
  const { user, isReady: isUserReady, fetchUserData } = useUser();

  const getIdleSource = () => {
    if (!user) return icons.Character_1;
    let idleSource = icons.Character_1;
    if (user.characterLevel === 2) { idleSource = icons.Character_2_animated; } 
    else if (user.characterLevel >= 3) { idleSource = icons.Character_3_animated; }
    const equippedShirt = user.equippedItems.find(item => item.type === 'shirt');
    if (equippedShirt && icons[equippedShirt.id as keyof typeof icons]) {
      idleSource = icons[equippedShirt.id as keyof typeof icons];
    }
    return idleSource;
  };

  useEffect(() => {
    if (isReacting || !user || !isUserReady) return;
    setCharacterSource(getIdleSource());
  }, [user, isReacting, isUserReady]);

  const fetchQuestion = useCallback(async (isManuallyTriggered = false) => { if (!token) { if (isManuallyTriggered) Alert.alert("오류", "로그인이 필요합니다."); setCurrentQuestion({ questionId: 0, questionText: "로그인하고 루미아와 대화해보세요!", questionType: "SYSTEM" }); return; } if (isManuallyTriggered) setIsLoadingQuestion(true); try { const response = await axios.get<NewMessageResponseDto>(`${API_BASE_URL}${API_ENDPOINTS.GET_QUESTION}`, { headers: { Authorization: `Bearer ${token}` } }); if (response.data && response.data.newMessage) { setCurrentQuestion(response.data.newMessage); setShowNewMessageIndicator(response.data.hasNewMessage); } else if (isManuallyTriggered) { Alert.alert("알림", "오늘은 더 이상 새로운 정기 질문이 없어요."); } } catch (error) { if (isManuallyTriggered) Alert.alert('오류', '질문을 가져오는 중 오류가 발생했습니다.'); } finally { if (isManuallyTriggered) setIsLoadingQuestion(false); } }, [token]);
  useFocusEffect(useCallback(() => { if (token) { fetchQuestion(false); checkAndRescheduleNotification(token); } }, [fetchQuestion, token]));
  const handleOnDemandQuestion = async () => { if (!token || isFetchingOnDemand) return; setIsFetchingOnDemand(true); try { const response = await axios.get<NewMessageResponseDto>(`${API_BASE_URL}${API_ENDPOINTS.GET_ON_DEMAND_QUESTION}`, { headers: { Authorization: `Bearer ${token}` } }); if (response.data && response.data.newMessage) { setCurrentQuestion(response.data.newMessage); setShowNewMessageIndicator(false); } } catch (error: any) { if (axios.isAxiosError(error) && error.response) { Alert.alert("알림", error.response.data); } else { Alert.alert("오류", "추가 질문을 가져오는 중 오류가 발생했습니다."); } } finally { setIsFetchingOnDemand(false); } };
  const handleSubmitAnswer = async () => { if (!userAnswer.trim()) { Alert.alert('알림', '답변을 입력해주세요.'); return; } if (!currentQuestion || !token) { Alert.alert('오류', '답변을 저장하기 위한 정보가 부족합니다.'); return; } setIsSubmittingAnswer(true); try { await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SAVE_ANSWER}`, { questionId: currentQuestion.questionId, content: userAnswer }, { headers: { Authorization: `Bearer ${token}` } }); Alert.alert('기록 완료!', '네 이야기가 기록되었어.'); setUserAnswer(''); setIsModalVisible(false); setCurrentQuestion(null); await fetchUserData(); } catch (error) { Alert.alert('오류', '답변 저장 중 오류가 발생했습니다.'); } finally { setIsSubmittingAnswer(false); } };
  const handleShopPress = () => { if (user && user.characterLevel >= 3) { router.push('/(tabs)/store'); } else { Alert.alert("상점 준비 중", "캐릭터가 최종 단계로 성장해야 상점을 이용할 수 있어요."); } };
  const handleHospitalPress = () => router.push('/healing');
  const handleSettingsPress = () => router.push('/settings');
  const handleCancelAnswer = () => { setUserAnswer(''); setIsModalVisible(false); };

  const handleCharacterPress = () => {
    if (isReacting) return;
    if (currentQuestion) {
        setIsModalVisible(true);
        setShowNewMessageIndicator(false);
        return;
    }
    if (!user) return;
    if (user.characterLevel === 1) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
    }
    
    setIsReacting(true);
    let reactionSource: any = null;
    if (user.characterLevel === 2) {
        reactionSource = icons.Character2_smile;
    } else if (user.characterLevel >= 3) {
        const equippedShirt = user.equippedItems.find(item => item.type === 'shirt');
        let reactionPool: string | any[] = [];
        if (equippedShirt) {
            if (equippedShirt.id === 'shirtblue') {
                reactionPool = [icons.hello_Blue, icons.jump_Blue, icons.sit_Blue];
            } else if (equippedShirt.id === 'shirtpink') {
                reactionPool = [icons.hello_Pink, icons.jump_Pink, icons.sit_Pink];
            } else if (equippedShirt.id === 'shirtorange') {
                reactionPool = [icons.hello_Orange, icons.jump_Orange, icons.sit_Orange];
            }
        } else {
              reactionPool = [icons.hello_Normal, icons.jump_Normal, icons.sit_Normal];
            }
        if (reactionPool.length > 0) {
            reactionSource = reactionPool[Math.floor(Math.random() * reactionPool.length)];
        }
    }
    if (reactionSource) {
        setCharacterSource(reactionSource);
        setTimeout(() => { setIsReacting(false); }, 2000);
    } else {
        setIsReacting(false);
    }
  };

  const renderCharacterContent = () => {
    let hatImageSource = null;
    if (user) {
        const equippedHat = user.equippedItems.find(item => item.type === 'hat');
        if (equippedHat && icons[equippedHat.id as keyof typeof icons]) {
            hatImageSource = icons[equippedHat.id as keyof typeof icons];
        }
    }
    return (
        <View style={styles.characterContainer}>
            <AnimatedCharacter 
                source={characterSource} 
                style={styles.characterImage} 
                onCharacterPress={handleCharacterPress}
                hatImage={hatImageSource}
                hatStyle={[styles.equippedItem, styles.hat]}
                isShaking={isShaking}
            />
            {showNewMessageIndicator && currentQuestion && (<TouchableOpacity style={styles.newMessageIconContainer} onPress={handleCharacterPress}><View style={styles.tempNewMessageIcon}><Text style={styles.tempNewMessageIconText}>!</Text></View></TouchableOpacity>)}
        </View>
    );
  };
  
  const renderMessageArea = () => {
    if ((isLoadingQuestion || !isUserReady) && !isModalVisible) { return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />; }
    if (showNewMessageIndicator && currentQuestion) {
        return (
            <TouchableOpacity style={styles.messagePromptContainer} onPress={handleCharacterPress}>
                <Text style={styles.messagePromptText}>새로운 이야기가 도착했어요!</Text>
                <Text style={styles.messagePromptHintText}>(캐릭터를 눌러 확인해보세요)</Text>
            </TouchableOpacity>
        );
    }
    if (currentQuestion && !isModalVisible) { return (<TouchableOpacity style={styles.questionBubble} onPress={handleCharacterPress}><Text style={styles.questionText}>{currentQuestion.questionText}</Text></TouchableOpacity>); }
    if (!currentQuestion && !isModalVisible) {
      return (
        <View style={styles.noQuestionContainer}>
          <Text style={styles.noQuestionText}>오늘은 어떤 이야기를 해볼까요?</Text>
          <TouchableOpacity
            style={styles.onDemandButton}
            onPress={handleOnDemandQuestion}
            disabled={isFetchingOnDemand}
          >
            {isFetchingOnDemand ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.onDemandButtonText}>다른 이야기 할래?</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <TimeBasedBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <View style={styles.headerLeft}><View style={styles.coinContainer}><View style={styles.coinContent}><Image source={icons.seed} style={styles.coinImage} /><Text style={styles.coinText}>{isUserReady ? user?.coins ?? '...' : '...'}</Text></View></View></View>
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={handleShopPress} style={styles.iconButton}><View style={styles.iconShadow}><Image source={icons.shop} style={styles.headerIcon} /></View></TouchableOpacity>
                <TouchableOpacity onPress={handleHospitalPress} style={styles.iconButton}><View style={styles.iconShadow}><Image source={icons.music} style={styles.headerIcon} /></View></TouchableOpacity>
               
                <TouchableOpacity onPress={handleSettingsPress} style={styles.iconButton}><View style={styles.iconShadow}><Image source={icons.settings} style={styles.headerIcon} /></View></TouchableOpacity>
            </View>
        </View>
        <View style={styles.content}><View style={styles.mainInteractionArea}>{renderCharacterContent()}{renderMessageArea()}</View></View>
        {isModalVisible && currentQuestion && (<View style={StyleSheet.absoluteFillObject} pointerEvents="auto"><Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={handleCancelAnswer}><TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => { if (!isSubmittingAnswer) { Keyboard.dismiss(); handleCancelAnswer(); } }}><TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}><View style={styles.modalContent}><Text style={styles.modalQuestionText}>{currentQuestion.questionText}</Text><TextInput style={styles.modalTextInput} placeholder="네 생각을 편하게 이야기해줘..." placeholderTextColor="#888" multiline numberOfLines={4} value={userAnswer} onChangeText={setUserAnswer} /><View style={styles.modalButtonContainer}><Button title="다음에 할래" onPress={handleCancelAnswer} color="#FF6347" /><View style={{ width: 20 }} /><Button title="마음 속에 담아둘게" onPress={handleSubmitAnswer} disabled={isSubmittingAnswer} /></View></View></TouchableWithoutFeedback></TouchableOpacity></Modal></View>)}
      </SafeAreaView>
    </TimeBasedBackground>
  );
};

// 기존 스타일에 onDemandButton 스타일 추가
const styles = StyleSheet.create({
  equippedItem: { position: 'absolute', width: 120, height: 120, zIndex: 3 },
  hat: { bottom: -45, right: -39, width: 200, height: 200, resizeMode: 'contain'},
  characterImage: { width: 120, height: 120, resizeMode: 'contain', zIndex: 2 },
  onDemandButton: { backgroundColor: '#1E88E5', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, marginTop: 10, },
  onDemandButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
  safeArea: { flex: 1, backgroundColor: 'transparent' }, 
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'android' ? 25 : 10, height: 60 }, 
  headerLeft: { flexDirection: 'row' }, 
  headerRight: { flexDirection: 'row', alignItems: 'center' }, 
  coinContainer: { backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginLeft: 15 }, 
  coinContent: { flexDirection: 'row', alignItems: 'center' }, 
  coinImage: { width: 18, height: 18, marginRight: 6 }, 
  coinText: { fontSize: 16, fontWeight: '600', color: '#333' }, 
  iconButton: { padding: 2, marginLeft: 10 }, 
  headerIcon: { width: 35, height: 35, resizeMode: 'contain' }, 
  iconShadow: { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 30, padding: 4 }, 
  content: { flex: 1, paddingBottom: 50 }, 
  mainInteractionArea: { flex: 1, alignItems: 'center', justifyContent: 'center' }, 
  characterContainer: { position: 'relative', alignItems: 'center', marginBottom: 10, marginTop: 320 }, 
  newMessageIconContainer: { position: 'absolute', top: -5, right: -5, zIndex: 4 }, 
  tempNewMessageIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' }, 
  tempNewMessageIconText: { color: 'white', fontWeight: 'bold', fontSize: 18 }, 
  messagePromptContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3.84, elevation: 3, marginHorizontal: 30, maxWidth: '90%', alignSelf: 'center' }, 
  messagePromptText: { fontSize: 17, fontWeight: '600', color: '#336699', textAlign: 'center' }, 
  messagePromptHintText: { fontSize: 13, color: '#555', textAlign: 'center', marginTop: 5 }, 
  questionBubble: { backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, marginHorizontal: 30, minHeight: 60, alignItems: 'center', justifyContent: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, maxWidth: '90%', alignSelf: 'center' }, 
  questionText: { fontSize: 16, color: '#333333', textAlign: 'center', lineHeight: 22 },
  noQuestionContainer: { alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: 15, marginHorizontal: 30, maxWidth: '90%', alignSelf: 'center' },
  noQuestionText: { fontSize: 17, color: '#527289', textAlign: 'center', marginBottom: 15 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.55)' }, 
  modalContent: { width: '90%', maxWidth: 380, backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 }, 
  modalQuestionText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 25, textAlign: 'center', lineHeight: 26 }, 
  modalTextInput: { width: '100%', minHeight: 100, maxHeight: 150, padding: 15, backgroundColor: '#F9F9F9', borderColor: '#D0D0D0', borderWidth: 1, borderRadius: 12, textAlignVertical: 'top', fontSize: 16, lineHeight: 22, color: '#333', marginBottom: 30 }, 
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});

export default MainScreen;
