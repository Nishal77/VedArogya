import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function MoodTracker() {
  // Mood tracking state
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');

  // Mood options with emojis and descriptions
  const moodOptions = [
    { emoji: '😊', label: 'Happy', description: 'Feeling great and positive' },
    { emoji: '😐', label: 'Neutral', description: 'Feeling balanced and calm' },
    { emoji: '😟', label: 'Worried', description: 'Feeling anxious or concerned' },
    { emoji: '😴', label: 'Tired', description: 'Feeling exhausted or sleepy' },
    { emoji: '😤', label: 'Stressed', description: 'Feeling overwhelmed' },
    { emoji: '🤗', label: 'Grateful', description: 'Feeling thankful and blessed' }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Happy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Neutral': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Worried': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Tired': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Stressed': return 'bg-red-100 text-red-800 border-red-300';
      case 'Grateful': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelColor = (level: number, type: 'stress' | 'energy') => {
    if (type === 'stress') {
      if (level <= 2) return 'bg-green-100 text-green-800 border-green-300';
      if (level <= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      return 'bg-red-100 text-red-800 border-red-300';
    } else {
      if (level >= 4) return 'bg-green-100 text-green-800 border-green-300';
      if (level >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getLevelDescription = (level: number, type: 'stress' | 'energy') => {
    if (type === 'stress') {
      if (level === 1) return 'Very Low';
      if (level === 2) return 'Low';
      if (level === 3) return 'Moderate';
      if (level === 4) return 'High';
      return 'Very High';
    } else {
      if (level === 1) return 'Very Low';
      if (level === 2) return 'Low';
      if (level === 3) return 'Moderate';
      if (level === 4) return 'High';
      return 'Very High';
    }
  };

  return (
    <View className="px-6 py-4">
      <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Mind & Mood (Manas)
            </Text>
            <Text className="text-sm text-gray-600">
              Track your emotional and mental state
            </Text>
          </View>
        </View>

        {/* Quick Mood Selection */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Quick Mood Check:</Text>
            {selectedMood && (
              <TouchableOpacity
                onPress={() => setSelectedMood(null)}
                className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center border border-purple-200"
                activeOpacity={0.7}
              >
                <Text className="text-purple-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <View className="flex-row flex-wrap justify-between">
              {moodOptions.map((mood) => (
                <TouchableOpacity
                  key={mood.label}
                  onPress={() => setSelectedMood(mood.label)}
                  className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                    selectedMood === mood.label 
                      ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'bg-white/80 border-purple-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{mood.emoji}</Text>
                    <Text className={`text-sm font-semibold text-center ${
                      selectedMood === mood.label ? 'text-purple-800' : 'text-gray-700'
                    }`}>
                      {mood.label}
                    </Text>
                    <Text className={`text-xs text-center mt-1 ${
                      selectedMood === mood.label ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {mood.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Stress Level Rating */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Stress Level (1-5):</Text>
            {stressLevel && (
              <TouchableOpacity
                onPress={() => setStressLevel(null)}
                className="w-8 h-8 bg-red-100 rounded-full items-center justify-center border border-red-200"
                activeOpacity={0.7}
              >
                <Text className="text-red-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
            <View className="flex-row justify-between">
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setStressLevel(level)}
                  className={`w-14 h-14 rounded-full border-2 items-center justify-center ${
                    stressLevel === level 
                      ? 'bg-red-500 border-red-600 shadow-lg shadow-red-500/30' 
                      : 'bg-white border-red-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-lg font-bold ${
                    stressLevel === level ? 'text-white' : 'text-gray-700'
                  }`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {stressLevel && (
              <View className="mt-3 pt-3 border-t border-red-200">
                <Text className={`text-center font-semibold ${getLevelColor(stressLevel, 'stress')} px-3 py-1 rounded-full`}>
                  {getLevelDescription(stressLevel, 'stress')} Stress
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Energy Level Rating */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Energy Level (1-5):</Text>
            {energyLevel && (
              <TouchableOpacity
                onPress={() => setEnergyLevel(null)}
                className="w-8 h-8 bg-green-100 rounded-full items-center justify-center border border-green-200"
                activeOpacity={0.7}
              >
                <Text className="text-green-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <View className="flex-row justify-between">
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setEnergyLevel(level)}
                  className={`w-14 h-14 rounded-full border-2 items-center justify-center ${
                    energyLevel === level 
                      ? 'bg-green-500 border-green-600 shadow-lg shadow-green-500/30' 
                      : 'bg-white border-green-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-lg font-bold ${
                    energyLevel === level ? 'text-white' : 'text-gray-700'
                  }`}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {energyLevel && (
              <View className="mt-3 pt-3 border-t border-green-200">
                <Text className={`text-center font-semibold ${getLevelColor(energyLevel, 'energy')} px-3 py-1 rounded-full`}>
                  {getLevelDescription(energyLevel, 'energy')} Energy
                </Text>
              </View>
            )}
          </View>
        </View>

     

        {/* Current Selection Display */}
        {(selectedMood || stressLevel !== null || energyLevel !== null || moodNote) && (
          <View className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <Text className="text-sm font-semibold text-purple-800 mb-2">Current Selection:</Text>
            <View className="space-y-2">
              {selectedMood && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Mood:</Text>
                  <Text className={`text-sm font-semibold ${getMoodColor(selectedMood)} px-2 py-1 rounded-full`}>
                    {selectedMood}
                  </Text>
                </View>
              )}
              {stressLevel !== null && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Stress:</Text>
                  <Text className={`text-sm font-semibold ${getLevelColor(stressLevel, 'stress')} px-2 py-1 rounded-full`}>
                    {stressLevel}/5 - {getLevelDescription(stressLevel, 'stress')}
                  </Text>
                </View>
              )}
              {energyLevel !== null && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Energy:</Text>
                  <Text className={`text-sm font-semibold ${getLevelColor(energyLevel, 'energy')} px-2 py-1 rounded-full`}>
                    {energyLevel}/5 - {getLevelDescription(energyLevel, 'energy')}
                  </Text>
                </View>
              )}
              
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
