import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function Header() {
  const router = useRouter();

  const handleBack = () => {
    // Navigate to home page
    router.push('/(tabs)/home');
  };

  return (
    <View className="w-full flex-row items-center justify-between px-6 py-4 bg-white">
      {/* Left Side - Back Button */}
      <TouchableOpacity
        testID="back-button"
        onPress={handleBack}
        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
        activeOpacity={0.7}
      >
        <ArrowLeft size={24} color="black" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Center - Title */}
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold text-gray-900">
          Profile
        </Text>
      </View>

      {/* Right Side - Empty for balance */}
      <View className="w-12 h-12" />
    </View>
  );
}
