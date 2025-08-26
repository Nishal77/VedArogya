import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Bell, Search, Mic } from 'lucide-react-native';
import { useAuth } from '../../../utils/AuthContext';

export default function Hero() {
  const { user } = useAuth();

  return (
    <View className="bg-white px-6 pt-12 pb-8">
      {/* Header Section */}
      <View className="flex-row items-center justify-between mb-6">
        {/* User Greeting */}
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-gray-200 rounded-full mr-4 items-center justify-center">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
              className="w-12 h-12 rounded-full"
              defaultSource={require('../../../assets/images/ayurvedic.png')}
            />
          </View>
          <View className="flex-1">
            <Text className="text-black text-xl font-bold mb-1">
              Hi, {user?.user_metadata?.full_name || 'User'}!
            </Text>
            <Text className="text-gray-600 text-base">
              How are you today?
            </Text>
          </View>
        </View>

        {/* Notifications Icon */}
        <TouchableOpacity className="bg-gray-100 rounded-xl p-3 ml-4">
          <Bell size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* AI Search Bar */}
      <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 flex-row items-center shadow-sm">
        <Search size={20} color="#9CA3AF" className="mr-3" />
        <TextInput
          className="flex-1 text-gray-800 text-base ml-2"
          placeholder="Ask AI about your wellness..."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity className="bg-gray-200 rounded-full p-2 ml-2">
          <Mic size={18} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
