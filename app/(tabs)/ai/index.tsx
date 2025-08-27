import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import AIInput from './aiinput';

export default function AIScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Top Spacing to prevent status bar overlap */}
        <View className="h-4" />
        
        {/* Header Section */}
        <View className="mt-6 mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            AI Assistant
          </Text>
          <Text className="text-lg text-gray-600">
            Your personal wellness companion powered by AI
          </Text>
        </View>

        {/* AI Features Grid */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            What can I help you with?
          </Text>
          
          <View className="space-y-4">
            {/* Health Analysis */}
            <View className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-semibold text-blue-800">Health Analysis</Text>
                <View className="w-3 h-3 bg-blue-500 rounded-full" />
              </View>
              <Text className="text-blue-700 text-base">
                Get personalized health insights and recommendations based on your symptoms
              </Text>
            </View>

            {/* Diet Planning */}
            <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-semibold text-green-800">Diet Planning</Text>
                <View className="w-3 h-3 bg-green-500 rounded-full" />
              </View>
              <Text className="text-green-700 text-base">
                Receive customized meal plans and nutrition advice for your dosha type
              </Text>
            </View>

            {/* Wellness Tips */}
            <View className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-semibold text-purple-800">Wellness Tips</Text>
                <View className="w-3 h-3 bg-purple-500 rounded-full" />
              </View>
              <Text className="text-purple-700 text-base">
                Daily wellness practices and lifestyle recommendations for optimal health
              </Text>
            </View>

            {/* Symptom Checker */}
            <View className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-semibold text-orange-800">Symptom Checker</Text>
                <View className="w-3 h-3 bg-orange-500 rounded-full" />
              </View>
              <Text className="text-orange-700 text-base">
                Understand your symptoms and get preliminary health assessments
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Conversations */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Recent Conversations
          </Text>
          
          <View className="space-y-3">
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-800 font-medium mb-1">"What foods are good for Pitta dosha?"</Text>
              <Text className="text-gray-600 text-sm">2 hours ago</Text>
            </View>
            
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-800 font-medium mb-1">"How to improve my sleep quality naturally?"</Text>
              <Text className="text-gray-600 text-sm">1 day ago</Text>
            </View>
            
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-800 font-medium mb-1">"Best morning routine for Vata constitution"</Text>
              <Text className="text-gray-600 text-sm">3 days ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Input Component */}
      <AIInput />
      
      {/* Bottom Blur Effect - Seamless Smooth Transition */}
      <View className="absolute bottom-24 left-0 right-0 h-2 z-40">
        <BlurView 
          intensity={40} 
          tint="light"
          className="flex-1"
        />
        {/* Seamless gradient overlay - no hard edges */}
        <View className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/25 via-white/15 to-transparent" />
      </View>
      
      {/* Second Layer - Seamless Medium Blur */}
      <View className="absolute bottom-20 left-0 right-0 h-2 z-40">
        <BlurView 
          intensity={20} 
          tint="light"
          className="flex-1"
        />
        {/* Seamless medium blur - smooth transition */}
        <View className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/12 via-white/6 to-transparent" />
      </View>
      
      {/* Third Layer - Seamless Subtle Blur */}
      <View className="absolute bottom-16 left-0 right-0 h-1 z-40">
        <BlurView 
          intensity={0} 
          tint="light"
          className="flex-1"
        />
        {/* Completely transparent - no visible lines */}
        <View className="absolute inset-0 bg-transparent" />
      </View>
    </SafeAreaView>
  );
}
