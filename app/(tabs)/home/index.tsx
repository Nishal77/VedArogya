import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import Hero from './hero';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Content Section - White Background */}
        <View className="flex-1 bg-white px-6 py-6">
          {/* Additional content will go here */}
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-lg text-center">
              Welcome to your wellness dashboard
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
