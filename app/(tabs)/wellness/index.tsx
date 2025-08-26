import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Activity, Calendar, TrendingUp, BookOpen } from 'lucide-react-native';

export default function WellnessScreen() {
  const wellnessData = [
    {
      id: 1,
      title: 'Daily Wellness Score',
      value: '85',
      unit: '/100',
      icon: Heart,
      color: 'bg-green-100',
      textColor: 'text-green-800',
    },
    {
      id: 2,
      title: 'Activity Level',
      value: 'Moderate',
      unit: '',
      icon: Activity,
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    {
      id: 3,
      title: 'Sleep Quality',
      value: '7.5',
      unit: 'hrs',
      icon: Calendar,
      color: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
  ];

  const wellnessTips = [
    'Drink 8 glasses of water daily',
    'Practice 15 minutes of meditation',
    'Take a 30-minute walk',
    'Get 7-8 hours of sleep',
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5">
        <View className="py-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
              <Heart size={32} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Wellness</Text>
            <Text className="text-gray-600 text-center">Your wellness journey</Text>
          </View>

          {/* Wellness Stats */}
          <View className="space-y-4 mb-8">
            {wellnessData.map((item) => (
              <View key={item.id} className={`${item.color} rounded-xl p-6`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <item.icon size={24} color="#6B7280" />
                    <Text className="text-gray-700 font-medium ml-3">{item.title}</Text>
                  </View>
                  <View className="items-end">
                    <Text className={`text-2xl font-bold ${item.textColor}`}>
                      {item.value}
                    </Text>
                    <Text className={`text-sm ${item.textColor}`}>{item.unit}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Wellness Tips */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <BookOpen size={20} color="#6B7280" />
              <Text className="text-gray-900 font-semibold ml-2">Daily Wellness Tips</Text>
            </View>
            <View className="space-y-3">
              {wellnessTips.map((tip, index) => (
                <View key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <Text className="text-yellow-800 text-center">{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <TouchableOpacity className="bg-green-500 rounded-xl p-4 items-center">
              <TrendingUp size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold mt-2">Track Progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-blue-500 rounded-xl p-4 items-center">
              <Activity size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold mt-2">Start Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
