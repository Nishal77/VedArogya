import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, Heart, Star, Home, User, Settings } from 'lucide-react-native';

export default function IconDemo() {
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Lucide Icons Demo
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row items-center space-x-4">
          <Camera size={24} color="#8DB600" />
          <Text className="text-gray-700">Camera Icon</Text>
        </View>
        
        <View className="flex-row items-center space-x-4">
          <Heart size={24} color="#F4B400" />
          <Text className="text-gray-700">Heart Icon</Text>
        </View>
        
        <View className="flex-row items-center space-x-4">
          <Star size={24} color="#2F6E39" />
          <Text className="text-gray-700">Star Icon</Text>
        </View>
        
        <View className="flex-row items-center space-x-4">
          <Home size={24} color="#8DB600" />
          <Text className="text-gray-700">Home Icon</Text>
        </View>
        
        <View className="flex-row items-center space-x-4">
          <User size={24} color="#F4B400" />
          <Text className="text-gray-700">User Icon</Text>
        </View>
        
        <View className="flex-row items-center space-x-4">
          <Settings size={24} color="#2F6E39" />
          <Text className="text-gray-700">Settings Icon</Text>
        </View>
      </View>
      
      <View className="mt-8">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Available Icons:
        </Text>
        <Text className="text-gray-600 leading-6">
          • Camera, Heart, Star, Home, User, Settings{'\n'}
          • Plus, Minus, Check, X, Arrow Right, Arrow Left{'\n'}
          • Search, Filter, Edit, Trash, Download, Upload{'\n'}
          • And many more at lucide.dev
        </Text>
      </View>
    </View>
  );
}
