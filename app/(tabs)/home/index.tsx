import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import Hero from './hero';
import Appointment from './appointment';
import Metrics from './metrics';
import TodoList from './todolist';

export default function Home() {
  const handleConsultPress = () => {
    // Navigate to appointment screen or open consultation modal
    console.log('Consult button pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Top Spacing to prevent status bar overlap */}
        <View className="h-4" />
        
        <Hero />
        <Appointment />
        <Metrics />
        <TodoList />
        <View className="px-6 py-4">
          {/* Additional content will go here */}
        </View>
      </ScrollView>
      
      {/* Floating Appointment Button - Above Bottom Navbar */}
      <View className="absolute bottom-28 right-6 z-50 mb-2">
        <TouchableOpacity
          onPress={handleConsultPress}
          className="items-center"
          activeOpacity={0.8}
        >
          {/* Main Button with Shadow */}
          <View className="w-16 h-16 bg-black rounded-full items-center justify-center border border-gray-200">
            <Calendar size={28} color="white" strokeWidth={2.5} />
          </View>
          
          {/* Subtle Glow Effect */}
          <View className="absolute inset-0 w-16 h-16 bg-gray-100 rounded-full opacity-30 blur-sm" />
        </TouchableOpacity>
      </View>
      
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
      <View className="absolute bottom-16 left-0 h-1 z-40">
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
