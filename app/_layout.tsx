import { Stack } from "expo-router";
import "../global.css";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { testSupabaseConnection } from "../utils/supabase";

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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="landing" />
      <Stack.Screen name="about" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
