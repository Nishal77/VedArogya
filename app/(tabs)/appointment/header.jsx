import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AppointmentHeader() {
  const router = useRouter();

  const handleBackPress = () => {
    router.push('/(tabs)/home');
  };

  return (
    <View className="bg-white/90 px-6 py-3 flex-row items-center">
      {/* Back Button */}
      <TouchableOpacity 
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4"
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <ArrowLeft size={20} color="#374151" />
      </TouchableOpacity>
      
      {/* Center Title */}
      <Text className="flex-1 text-lg font-semibold text-gray-800 text-center">
       Schedule Appointment
      </Text>
      
      {/* Right side - empty for balance */}
      <View className="w-10" />
    </View>
  );
}
