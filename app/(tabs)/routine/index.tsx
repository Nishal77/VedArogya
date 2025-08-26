import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import RoutineIcon from '../../../components/RoutineIcon';

export default function RoutineScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-1 px-6 py-8 pb-20">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Daily Routine</Text>
          <Text className="text-gray-600 text-base">Track your wellness habits and daily practices</Text>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          <RoutineIcon size={64} color="#F4B400" />
          <Text className="text-xl font-semibold text-gray-800 mb-2 mt-4">Coming Soon</Text>
          <Text className="text-gray-500 text-center text-base">
            Daily routine tracking and wellness habit management will be available soon.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
