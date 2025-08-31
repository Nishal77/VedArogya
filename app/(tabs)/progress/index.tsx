import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import ProgressHeader from './header';
import ProgressSubheading from './subheading';
import ProgressGauge from './ProgressGauge';
import MoodTracker from './MoodTracker';
import Water from './Water';
import Sleep from './Sleep';
import MealPortions from './MealPortions';
import DigestionQuality from './DigestionQuality';

export default function Progress() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Fixed Header */}
      <View className="h-2" />
      <ProgressHeader />
      
      {/* Fixed Subheading */}
      <ProgressSubheading />
      
      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Intensity Gauge with 80% */}
        <View className="py-0 mx-6">
          <ProgressGauge value={80} />
        </View>

        {/* Mood Tracker */}
        <View className="py-0 mx-6">
          <MoodTracker />
        </View>

        {/* Water Intake Tracker */}
        <View className="py-0 mx-6">
          <Water />
        </View>

        {/* Sleep Pattern Tracker */}
        <View className="py-0 mx-6">
          <Sleep />
        </View>

        {/* Meal Portions Tracker */}
        <View className="py-0 mx-6">
          <MealPortions />
        </View>

        {/* Digestion Quality Tracker */}
        <View className="py-0 mx-6">
          <DigestionQuality />
        </View>
        
        {/* Progress Section */}
        <View className="px-6 py-8">
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Progress Section
          </Text>
        </View>
      </ScrollView>

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
