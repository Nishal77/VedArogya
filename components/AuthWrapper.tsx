import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../utils/AuthContext';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    
    // Define public pages that don't require authentication
    const publicPages = ['landing', 'about', 'index'];
    const currentPage = segments[0];

    if (!user && !inAuthGroup && !publicPages.includes(currentPage)) {
      // User is not authenticated and not in auth group or public pages, redirect to landing
      router.replace('/landing');
    } else if (user && inAuthGroup) {
      // User is authenticated but in auth group, redirect to home page
      router.replace('/(tabs)/home');
    } else if (user && !inTabsGroup && !inAuthGroup && !publicPages.includes(currentPage)) {
      // User is authenticated but not in tabs, auth, or public pages, redirect to home page
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#F4B400" />
      </View>
    );
  }

  return <>{children}</>;
}
