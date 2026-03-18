// context/UserContext.tsx
import axios from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { useAuth } from './AuthContext';

export interface Item {
  id: string;
  name: string;
  cost: number;
  image: any;
  type: 'hat' | 'shirt';
}

export interface User {
  id: string;
  name: string;
  coins: number;
  equippedItems: Item[];
  purchasedItems: Item[];
  characterLevel: number;
}

interface UserContextType {
  user: User | null;
  purchaseItem: (item: Item) => Promise<boolean>;
  equipItem: (item: Item) => void;
  unequipItem: (item: Item) => void;
  isReady: boolean;
  fetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const allItems: Item[] = [
    { id: 'shirtpink', name: '핑크 셔츠', cost: 20, image: require('../assets/images/shirtPink.png'), type: 'shirt' },
    { id: 'shirtblue', name: '블루 셔츠', cost: 20, image: require('../assets/images/shirtBlue.png'), type: 'shirt' },
    { id: 'shirtorange', name: '오렌지 셔츠', cost: 20, image: require('../assets/images/shirtOrange.png'), type: 'shirt' },
    { id: 'hat1', name: '기본 모자', cost: 10, image: require('../assets/images/hat1.png'), type: 'hat' },
    { id: 'hat2', name: '리본 모자', cost: 10, image: require('../assets/images/hat2.png'), type: 'hat' },
    { id: 'hat3', name: '꽃 모자', cost: 10, image: require('../assets/images/hat3.png'), type: 'hat' },
];

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (token) {
      setIsReady(false);
      try {
        const response = await axios.get(API_BASE_URL + API_ENDPOINTS.GET_USER_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile = response.data;
        
        const equippedItems = (profile.equippedItems || [])
          .map((itemName: string) => allItems.find(item => item.name === itemName))
          .filter((item: Item | undefined): item is Item => !!item);
        
        const purchasedItems = (profile.purchasedItems || [])
          .map((itemName: string) => allItems.find(item => item.name === itemName))
          .filter((item: Item | undefined): item is Item => !!item);
          
        setUser({
          id: profile.loginId,
          name: profile.username,
          coins: profile.coin,
          equippedItems: equippedItems,
          purchasedItems: purchasedItems,
          characterLevel: profile.characterLevel,
        });
      } catch (e) {
        console.error("Failed to fetch user data for UserContext", e);
        setUser(null);
      } finally {
          setIsReady(true);
      }
    } else {
      setUser(null);
      setIsReady(true);
    }
  }, [token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const saveEquippedItems = async (newEquippedItems: Item[]) => {
      if(!token) return;
      const itemNames = newEquippedItems.map(item => item.name);
      try {
        await axios.put(API_BASE_URL + API_ENDPOINTS.UPDATE_EQUIPPED_ITEMS, 
            { equippedItems: itemNames },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchUserData();
      } catch (e) {
          console.error("Failed to save equipped items", e);
          Alert.alert("오류", "아이템 착용 상태 저장에 실패했습니다.");
          await fetchUserData();
      }
  };

  const purchaseItem = async (item: Item): Promise<boolean> => {
    if (!token || !user) return false;
    if (user.coins < item.cost) {
        Alert.alert("코인 부족", "코인이 부족하여 아이템을 구매할 수 없습니다.");
        return false;
    }
    try {
        await axios.post(
            API_BASE_URL + API_ENDPOINTS.PURCHASE_ITEM,
            { itemId: item.id, itemName: item.name, cost: item.cost },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchUserData();
        return true;
    } catch (error: any) {
        console.error("Failed to purchase item:", error.response?.data || error.message);
        Alert.alert("구매 실패", error.response?.data || "아이템 구매 중 오류가 발생했습니다.");
        return false;
    }
  };

  const equipItem = (itemToEquip: Item) => {
    if (!user) return;
    const newEquippedItems = user.equippedItems.filter(item => item.type !== itemToEquip.type);
    newEquippedItems.push(itemToEquip);
    saveEquippedItems(newEquippedItems);
  };

  const unequipItem = (itemToUnequip: Item) => {
    if (!user) return;
    const newEquippedItems = user.equippedItems.filter(item => item.id !== itemToUnequip.id);
    saveEquippedItems(newEquippedItems);
  };
  
  return (
    <UserContext.Provider value={{ user, purchaseItem, equipItem, unequipItem, isReady, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};