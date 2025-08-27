import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, Mic, Bell } from 'lucide-react-native';
import { useAuth } from '../../../utils/AuthContext';

export default function Hero() {
  const { user } = useAuth();

  // Default image from Supabase storage
  const defaultImageUrl = 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/ayverdha.jpeg';

  return (
    <View className="px-6 pt-8 pb-6">
      {/* Profile and Greeting Section */}
      <View className="flex-row items-center justify-between mb-6">
        {/* Left Side - Profile and Greeting */}
        <View className="flex-row items-center flex-1">
          {/* Profile Picture */}
          <View className="w-12 h-12 rounded-full mr-4 overflow-hidden">
            <Image 
              source={{ 
                uri: user?.user_metadata?.avatar_url || defaultImageUrl 
              }}
              className="w-12 h-12 rounded-full"
              defaultSource={{ uri: defaultImageUrl }}
              resizeMode="cover"
            />
          </View>
          
          {/* Greeting Text */}
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-0">
              Hi, {user?.user_metadata?.full_name || 'User'}!
            </Text>
            <Text className="text-base text-gray-600">
              How are you today?
            </Text>
          </View>
        </View>

        {/* Right Side - Bell Icon */}
        <TouchableOpacity className="bg-gray-100 rounded-xl p-3 ml-4">
          <Bell size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* AI Search Input */}
      <View className="bg-gray-50 rounded-2xl p-4 flex-row items-center">
        <Search size={20} color="#6B7280" className="mr-3" />
        <TextInput
          placeholder="Ask AI about your wellness..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-gray-800 text-base ml-2"
        />
        <Mic size={20} color="#6B7280" />
      </View>
    </View>
  );
}
