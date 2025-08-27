import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function AboutPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1">
      <Image
        source={require('../assets/images/about.jpeg')}
        style={{
          width: width,
          height: height,
          resizeMode: 'cover'
        }}
      />
      
      {/* Back Button */}
      <SafeAreaView className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center p-4">
          {/* Back button removed */}
        </View>
      </SafeAreaView>
      
      <View className="absolute bottom-24 left-0 right-0 px-6">
        <Text className="text-white text-4xl font-bold drop-shadow-2xl mb-8">
          Discover Balance Through Your Unique Dosha Journey
        </Text>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-1 bg-[#F4B400] rounded-full mr-2"></View>
            <View className="w-4 h-1 bg-[#F4B400]/40 rounded-full"></View>
          </View>
          
          <TouchableOpacity 
            className="bg-[#F4B400] w-20 h-20 rounded-full items-center justify-center shadow-lg active:bg-[#6e8c00] active:scale-95 transition-all duration-200"
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text className="text-black text-3xl font-bold">→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
