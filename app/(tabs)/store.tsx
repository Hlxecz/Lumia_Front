// app/(tabs)/store.tsx 
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item, useUser } from '../../context/UserContext';

// UserContext와 동일한 아이템 목록을 사용합니다.
const allItems: Item[] = [
    { id: 'shirtpink', name: '핑크 셔츠', cost: 20, image: require('../../assets/images/shirtPink.png'), type: 'shirt' },
    { id: 'shirtblue', name: '블루 셔츠', cost: 20, image: require('../../assets/images/shirtBlue.png'), type: 'shirt' },
    { id: 'shirtorange', name: '오렌지 셔츠', cost: 20, image: require('../../assets/images/shirtOrange.png'), type: 'shirt' },
    { id: 'hat1', name: '기본 모자', cost: 10, image: require('../../assets/images/hat1.png'), type: 'hat' },
    { id: 'hat2', name: '리본 모자', cost: 10, image: require('../../assets/images/hat2.png'), type: 'hat' },
    { id: 'hat3', name: '꽃 모자', cost: 10, image: require('../../assets/images/hat3.png'), type: 'hat' },
];

export default function StoreScreen() {
  const { user, purchaseItem, equipItem, unequipItem, isReady } = useUser();
  const router = useRouter();
  const goHome = React.useCallback(() => {
    router.replace('/');
  }, [router]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        goHome();
        return true;
      });

      return () => subscription.remove();
    }, [goHome])
  );

  if (!isReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{marginTop: 50}}/>
      </SafeAreaView>
    );
  }
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goHome} style={styles.backButton}>
                <Text style={styles.backButtonText}>{'< 뒤로'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>상점</Text>
        </View>
        <Text style={styles.errorText}>사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.</Text>
      </SafeAreaView>
    )
  }

  const handlePurchase = async (item: Item) => {
    // UserContext의 purchaseItem 함수를 호출
    const success = await purchaseItem(item); 
    
    if (success) {
      equipItem(item); // 구매 성공 시 바로 착용
      Alert.alert('구매 완료', `${item.name}을(를) 구매하고 착용했습니다!`);
    }
    // 실패 시의 Alert는 purchaseItem 함수 내부에서 처리됩니다.
  };

  const renderItem = ({ item }: { item: Item }) => {
    const isEquipped = user.equippedItems.some(equipped => equipped.id === item.id);
    // UserContext에서 받아온 실제 구매 목록으로 확인하도록 수정
    const isPurchased = user.purchasedItems.some(purchased => purchased.id === item.id);

    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCost}>{item.cost} 코인</Text>
        </View>
        {isEquipped ? (
          <TouchableOpacity style={styles.unequipButton} onPress={() => unequipItem(item)}>
            <Text style={styles.buttonText}>벗기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, !isPurchased && user.coins < item.cost && { backgroundColor: '#ccc' }]} 
            onPress={() => isPurchased ? equipItem(item) : handlePurchase(item)}
            disabled={!isPurchased && user.coins < item.cost}
            >
            <Text style={styles.buttonText}>{isPurchased ? '착용하기' : '구매하기'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goHome} style={styles.backButton}>
             <Text style={styles.backButtonText}>{'< 뒤로'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>상점</Text>
        <Text style={styles.coins}>보유 코인: {user.coins}</Text>
      </View>
      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  coins: { fontSize: 16, color: 'gray', marginTop: 4, textAlign: 'center' },
  backButton: { position: 'absolute', top: 0, left: 0, padding: 22, zIndex: 1 },
  backButtonText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  listContent: { padding: 8 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, marginVertical: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  itemImage: { width: 60, height: 60, marginRight: 12, resizeMode: 'contain' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: '500' },
  itemCost: { fontSize: 14, color: '#888' },
  button: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  unequipButton: { backgroundColor: '#8E8E93', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  errorText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'red' },
});
