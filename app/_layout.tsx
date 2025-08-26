import { Stack } from "expo-router";
import "../global.css";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { testSupabaseConnection } from "../utils/supabase";
import { AuthProvider } from "../utils/AuthContext";
import AuthWrapper from "../components/AuthWrapper";

// Ignore specific warnings that are not critical
LogBox.ignoreLogs([
  'Warning: "shadow*" style props are deprecated. Use "boxShadow".',
  '[expo-av]: Expo AV has been deprecated',
  'The `punycode` module is deprecated'
]);

export default function RootLayout() {
  useEffect(() => {
    // Test Supabase connection on app start
    const testConnection = async () => {
      try {
        await testSupabaseConnection();
      } catch (error) {
        console.warn('Supabase connection test skipped:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <AuthProvider>
      <AuthWrapper>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="landing" options={{ title: 'Landing' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
          <Stack.Screen name="(auth)" options={{ title: 'Authentication' }} />
          <Stack.Screen name="(tabs)" options={{ title: 'Main App' }} />
        </Stack>
      </AuthWrapper>
    </AuthProvider>
  );
}
