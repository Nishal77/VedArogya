import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Newspaper } from 'lucide-react-native';

interface HeaderProps {
  onClearConversation?: () => void;
}

export default function Header({ onClearConversation }: HeaderProps) {
  const router = useRouter();

  const handleNewsPress = () => {
    // Navigate to news section
    router.push('/(tabs)/ai/news');
  };

  const handleBackPress = () => {
    // Navigate to home page
    router.push('/(tabs)/home');
  };

  return (
    <View className="w-full flex-row items-center justify-between px-6 py-4 bg-white">
      {/* Left Side - Arrow Icon */}
      <TouchableOpacity
        testID="back-button"
        onPress={handleBackPress}
        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
        activeOpacity={0.7}
      >
        <ArrowLeft size={24} color="#000000" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Center - Title */}
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold text-gray-900">
          AyushMitra
        </Text>
      </View>

      {/* Right Side - News Text Box */}
      <TouchableOpacity
        testID="news-button"
        onPress={handleNewsPress}
        className="flex-row items-center px-3 py-2 bg-gray-100 rounded-full"
        activeOpacity={0.7}
        style={{ minWidth: 60, justifyContent: 'center' }}
      >
        <Newspaper size={20} color="#2563EB" strokeWidth={2.2} style={{ marginRight: 6 }} />
        <Text className="text-blue-700 font-semibold text-base">News</Text>
      </TouchableOpacity>
    </View>
  );
}
