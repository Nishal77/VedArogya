import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import RoutineIcon from '../../../components/RoutineIcon';
import { Plus, Calendar, Clock, Target, TrendingUp, Heart, Brain, Leaf, Sun, Moon, Zap, Droplets, Star } from 'lucide-react-native';

// Custom Stomach Icon Component
const Stomach = ({ size = 20, color = 'white' }) => (
  <View style={{ width: size, height: size }}>
    <View style={{ 
      width: size, 
      height: size * 0.8, 
      borderRadius: size * 0.4, 
      backgroundColor: color,
      borderWidth: 1,
      borderColor: color === 'white' ? '#000' : 'transparent'
    }} />
  </View>
);

export default function RoutineScreen() {
  const [routineInput, setRoutineInput] = useState('');

  const wellnessCategories = [
    { title: 'Sleep', icon: Moon, color: 'bg-indigo-500', description: 'Sleep quality & duration' },
    { title: 'Digestion', icon: Stomach, color: 'bg-orange-500', description: 'Gut health & comfort' },
    { title: 'Bowels', icon: Leaf, color: 'bg-green-500', description: 'Regularity & health' },
    { title: 'Energy', icon: Zap, color: 'bg-yellow-500', description: 'Vitality & stamina' },
    { title: 'Mood', icon: Heart, color: 'bg-pink-500', description: 'Emotional wellbeing' },
    { title: 'Food & Water', icon: Droplets, color: 'bg-blue-500', description: 'Nutrition & hydration' },
    { title: 'Activity', icon: TrendingUp, color: 'bg-purple-500', description: 'Physical movement' },
    { title: 'Mind Calm', icon: Brain, color: 'bg-teal-500', description: 'Mental peace' },
    { title: 'Cycle Health', icon: Sun, color: 'bg-red-500', description: 'Hormonal balance' },
    { title: 'Dosha Balance', icon: Star, color: 'bg-amber-500', description: 'Ayurvedic harmony' }
  ];

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
            Daily Routine
          </Text>
          <Text className="text-lg text-gray-600">
            Track your wellness journey with personalized routines
          </Text>
        </View>

        {/* Input Section */}
        <View className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8 border border-purple-100">
          <View className="flex-row items-center mb-4">
            <Target size={24} color="#7C3AED" />
            <Text className="text-xl font-semibold text-gray-800 ml-3">
              Add New Routine
            </Text>
          </View>
          
          <TextInput
            value={routineInput}
            onChangeText={setRoutineInput}
            placeholder="e.g., Morning meditation, Evening walk, Herbal tea..."
            placeholderTextColor="#9CA3AF"
            className="bg-white rounded-xl px-4 py-4 text-gray-800 text-base border border-purple-200 focus:border-purple-400"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            className="bg-purple-600 rounded-xl py-3 px-6 mt-4 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Plus size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Add to Routine
            </Text>
          </TouchableOpacity>
        </View>

        {/* Wellness Categories Grid */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Wellness Categories
          </Text>
          
          <View className="flex-row flex-wrap justify-between">
            {wellnessCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className={`w-[48%] ${category.color} rounded-2xl p-4 mb-4 shadow-lg shadow-black/10`}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <category.icon size={24} color="white" />
                  <View className="w-2 h-2 bg-white rounded-full opacity-80" />
                </View>
                
                <Text className="text-white font-bold text-lg mb-1">
                  {category.title}
                </Text>
                
                <Text className="text-white/90 text-sm leading-4">
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border border-amber-100">
          <View className="flex-row items-center mb-4">
            <Clock size={24} color="#F59E0B" />
            <Text className="text-xl font-semibold text-gray-800 ml-3">
              Quick Actions
            </Text>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="flex-1 bg-amber-500 rounded-xl py-3 px-4 items-center"
              activeOpacity={0.8}
            >
              <Calendar size={20} color="white" />
              <Text className="text-white font-semibold text-sm mt-1">
                Morning
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-orange-500 rounded-xl py-3 px-4 items-center"
              activeOpacity={0.8}
            >
              <Sun size={20} color="white" />
              <Text className="text-white font-semibold text-sm mt-1">
                Afternoon
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-red-500 rounded-xl py-3 px-4 items-center"
              activeOpacity={0.8}
            >
              <Moon size={20} color="white" />
              <Text className="text-white font-semibold text-sm mt-1">
                Evening
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
          <View className="flex-row items-center mb-4">
            <TrendingUp size={24} color="#10B981" />
            <Text className="text-xl font-semibold text-gray-800 ml-3">
              This Week's Progress
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between bg-white rounded-xl p-4">
            <View>
              <Text className="text-2xl font-bold text-green-600">85%</Text>
              <Text className="text-gray-600 text-sm">Routine Completion</Text>
            </View>
            
            <View className="items-end">
              <Text className="text-lg font-semibold text-gray-800">6/7</Text>
              <Text className="text-gray-600 text-sm">Days Completed</Text>
            </View>
          </View>
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
