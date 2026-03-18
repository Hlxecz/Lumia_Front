// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen as ExpoSplashScreen, router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import { LogBox, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
LogBox.ignoreAllLogs();
ExpoSplashScreen.preventAutoHideAsync();
LogBox.ignoreAllLogs();
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: '#000000',
  }
});

function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      console.log('RootNavigation: onLayoutRootView - Auth loading complete, hiding splash screen.');
      await ExpoSplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timerId = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }, 0); 
      return () => clearTimeout(timerId);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>사용자 정보 확인 중...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ animation: 'none' }} />
        <Stack.Screen name="signup" options={{ animation: 'none' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  if (!loaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>폰트 로딩 중...</Text>
      </View>
    );
  }

  if (fontError && !loaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>폰트 로딩 실패! 앱을 시작할 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootNavigation />
          <StatusBar style="auto" />
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  );
}