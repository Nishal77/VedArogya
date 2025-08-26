import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../utils/AuthContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      // AuthWrapper will handle redirect to landing page
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const testKeyboard = () => {
    // Navigate to keyboard test (you can add this route later)
    Alert.alert(
      'Keyboard Test',
      'To test keyboard functionality, go to the login or signup page and tap on input fields. The keyboard should appear immediately.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-5">
        <View className="items-center">
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            Hello Home
          </Text>
          <Text className="text-lg text-gray-600 text-center mb-8">
            Welcome to VedArogya
          </Text>
          
          {user && (
            <View className="bg-gray-50 rounded-xl p-6 w-full max-w-sm mb-6">
              <Text className="text-sm text-gray-500 mb-2">Logged in as:</Text>
              <Text className="text-base font-medium text-gray-900">
                {user.email}
              </Text>
            </View>
          )}
          
          <View className="mt-8 space-y-4 w-full max-w-sm">
            <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <Text className="text-yellow-800 font-medium text-center">
                Your wellness journey starts here
              </Text>
            </View>
            
            {/* Keyboard Test Button */}
            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-xl items-center active:bg-blue-600 active:scale-95"
              activeOpacity={0.8}
              onPress={testKeyboard}
            >
              <Text className="text-white font-semibold text-base">
                Test Keyboard
              </Text>
            </TouchableOpacity>
            
            {/* Logout Button */}
            <TouchableOpacity
              className="bg-red-500 py-3 rounded-xl items-center active:bg-red-600 active:scale-95"
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold text-base">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
