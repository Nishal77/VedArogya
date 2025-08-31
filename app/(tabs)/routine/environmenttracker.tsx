import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

export default function EnvironmentTracker() {
  // Environment tracking state
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedStressTriggers, setSelectedStressTriggers] = useState<string[]>([]);
  const [travelLocation, setTravelLocation] = useState('');
  const [journeyType, setJourneyType] = useState<string | null>(null);
  const [journeyDuration, setJourneyDuration] = useState<string | null>(null);

  // Weather options
  const weatherOptions = [
    { label: 'Sunny', emoji: '☀️', description: 'Clear and bright weather' },
    { label: 'Rainy', emoji: '🌧️', description: 'Wet and cloudy conditions' },
    { label: 'Cold', emoji: '❄️', description: 'Low temperature weather' },
    { label: 'Cloudy', emoji: '☁️', description: 'Overcast conditions' },
    { label: 'Windy', emoji: '💨', description: 'Strong wind conditions' },
    { label: 'Humid', emoji: '💧', description: 'High humidity levels' }
  ];

  // Stress trigger options
  const stressTriggerOptions = [
    { label: 'Travel', emoji: '✈️', description: 'Commuting or journey stress' },
    { label: 'Work Pressure', emoji: '💼', description: 'Job-related stress' },
    { label: 'Noise', emoji: '🔊', description: 'Loud environment stress' },
    { label: 'Crowds', emoji: '👥', description: 'Busy or crowded places' },
    { label: 'Traffic', emoji: '🚗', description: 'Road congestion stress' },
    { label: 'Weather Change', emoji: '🌦️', description: 'Sudden weather shifts' }
  ];

  // Journey type options
  const journeyTypeOptions = [
    { label: 'Short Trip', emoji: '🚶', description: 'Local travel < 1 hour' },
    { label: 'Medium Journey', emoji: '🚌', description: 'Regional travel 1-4 hours' },
    { label: 'Long Journey', emoji: '✈️', description: 'Distant travel > 4 hours' },
    { label: 'International', emoji: '🌍', description: 'Cross-border travel' }
  ];

  // Journey duration options
  const journeyDurationOptions = [
    { label: 'Few Hours', emoji: '⏰', description: '2-6 hours' },
    { label: 'Half Day', emoji: '🌅', description: '6-12 hours' },
    { label: 'Full Day', emoji: '🌞', description: '12-24 hours' },
    { label: 'Multi-day', emoji: '📅', description: 'More than 1 day' }
  ];

  const getWeatherColor = (weather: string) => {
    switch (weather) {
      case 'Sunny': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Rainy': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cold': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'Cloudy': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Windy': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Humid': return 'bg-teal-100 text-teal-800 border-teal-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStressTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'Travel': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Work Pressure': return 'bg-red-100 text-red-800 border-red-300';
      case 'Noise': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Crowds': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Traffic': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Weather Change': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getJourneyColor = (type: string) => {
    switch (type) {
      case 'Short Trip': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium Journey': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Long Journey': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'International': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const toggleStressTrigger = (trigger: string) => {
    if (selectedStressTriggers.includes(trigger)) {
      setSelectedStressTriggers(selectedStressTriggers.filter(t => t !== trigger));
    } else {
      setSelectedStressTriggers([...selectedStressTriggers, trigger]);
    }
  };

  return (
    <View className="px-6 py-4">
      <View className="bg-white rounded-2xl p-4 border border-gray-200">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Environment & Surroundings
            </Text>
            <Text className="text-sm text-gray-600">
              Track your environmental factors and travel
            </Text>
          </View>
        </View>

        {/* Quick Environment Check - Minimum Essential Options */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Quick Environment Check:</Text>
          <View className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                onPress={() => setSelectedWeather(selectedWeather === 'Sunny' ? null : 'Sunny')}
                className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                  selectedWeather === 'Sunny' 
                    ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/80 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="items-center">
                  <Text className="text-3xl mb-2">☀️</Text>
                  <Text className={`text-sm font-semibold text-center ${
                    selectedWeather === 'Sunny' ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    Good Weather
                  </Text>
                  <Text className={`text-xs text-center mt-1 ${
                    selectedWeather === 'Sunny' ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Clear & pleasant
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelectedWeather(selectedWeather === 'Rainy' ? null : 'Rainy')}
                className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                  selectedWeather === 'Rainy' 
                    ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'bg-white/80 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="items-center">
                  <Text className="text-3xl mb-2">🌧️</Text>
                  <Text className={`text-sm font-semibold text-center ${
                    selectedWeather === 'Rainy' ? 'text-blue-800' : 'text-gray-700'
                  }`}>
                    Bad Weather
                  </Text>
                  <Text className={`text-xs text-center mt-1 ${
                    selectedWeather === 'Rainy' ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Rainy & cloudy
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleStressTrigger('Work Pressure')}
                className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                  selectedStressTriggers.includes('Work Pressure')
                    ? 'bg-white border-red-500 shadow-lg shadow-red-500/20' 
                    : 'bg-white/80 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="items-center">
                  <Text className="text-3xl mb-2">💼</Text>
                  <Text className={`text-sm font-semibold text-center ${
                    selectedStressTriggers.includes('Work Pressure') ? 'text-red-800' : 'text-gray-700'
                  }`}>
                    Work Stress
                  </Text>
                  <Text className={`text-xs text-center mt-1 ${
                    selectedStressTriggers.includes('Work Pressure') ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Job pressure
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleStressTrigger('Travel')}
                className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                  selectedStressTriggers.includes('Travel')
                    ? 'bg-white border-red-500 shadow-lg shadow-red-500/20' 
                    : 'bg-white/80 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="items-center">
                  <Text className="text-3xl mb-2">✈️</Text>
                  <Text className={`text-sm font-semibold text-center ${
                    selectedStressTriggers.includes('Travel') ? 'text-red-800' : 'text-gray-700'
                  }`}>
                    Travel Stress
                  </Text>
                  <Text className={`text-xs text-center mt-1 ${
                    selectedStressTriggers.includes('Travel') ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    Commuting stress
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Weather Selection */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Weather Conditions:</Text>
            {selectedWeather && (
              <TouchableOpacity
                onPress={() => setSelectedWeather(null)}
                className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center border border-blue-200"
                activeOpacity={0.7}
              >
                <Text className="text-blue-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <View className="flex-row flex-wrap justify-between">
              {weatherOptions.map((weather) => (
                <TouchableOpacity
                  key={weather.label}
                  onPress={() => setSelectedWeather(weather.label)}
                  className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                    selectedWeather === weather.label 
                      ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'bg-white/80 border-blue-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{weather.emoji}</Text>
                    <Text className={`text-sm font-semibold text-center ${
                      selectedWeather === weather.label ? 'text-blue-800' : 'text-gray-700'
                    }`}>
                      {weather.label}
                    </Text>
                    <Text className={`text-xs text-center mt-1 ${
                      selectedWeather === weather.label ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {weather.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Stress Triggers Selection */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Stress Triggers:</Text>
            {selectedStressTriggers.length > 0 && (
              <TouchableOpacity
                onPress={() => setSelectedStressTriggers([])}
                className="w-8 h-8 bg-red-100 rounded-full items-center justify-center border border-red-200"
                activeOpacity={0.7}
              >
                <Text className="text-red-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
            <View className="flex-row flex-wrap justify-between">
              {stressTriggerOptions.map((trigger) => (
                <TouchableOpacity
                  key={trigger.label}
                  onPress={() => toggleStressTrigger(trigger.label)}
                  className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                    selectedStressTriggers.includes(trigger.label)
                      ? 'bg-white border-red-500 shadow-lg shadow-red-500/20' 
                      : 'bg-white/80 border-red-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{trigger.emoji}</Text>
                    <Text className={`text-sm font-semibold text-center ${
                      selectedStressTriggers.includes(trigger.label) ? 'text-red-800' : 'text-gray-700'
                    }`}>
                      {trigger.label}
                    </Text>
                    <Text className={`text-xs text-center mt-1 ${
                      selectedStressTriggers.includes(trigger.label) ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {trigger.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Travel Location Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Where did you visit/travel?</Text>
          <TextInput
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 text-gray-700 text-base"
            placeholder="Enter city, place, or destination..."
            placeholderTextColor="#6B7280"
            value={travelLocation}
            onChangeText={setTravelLocation}
            returnKeyType="done"
          />
        </View>

        {/* Journey Type Selection */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Journey Type:</Text>
            {journeyType && (
              <TouchableOpacity
                onPress={() => setJourneyType(null)}
                className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center border border-purple-200"
                activeOpacity={0.7}
              >
                <Text className="text-purple-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <View className="flex-row flex-wrap justify-between">
              {journeyTypeOptions.map((journey) => (
                <TouchableOpacity
                  key={journey.label}
                  onPress={() => setJourneyType(journey.label)}
                  className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                    journeyType === journey.label 
                      ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'bg-white/80 border-purple-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{journey.emoji}</Text>
                    <Text className={`text-sm font-semibold text-center ${
                      journeyType === journey.label ? 'text-purple-800' : 'text-gray-700'
                    }`}>
                      {journey.label}
                    </Text>
                    <Text className={`text-xs text-center mt-1 ${
                      journeyType === journey.label ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {journey.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Journey Duration Selection */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Journey Duration:</Text>
            {journeyDuration && (
              <TouchableOpacity
                onPress={() => setJourneyDuration(null)}
                className="w-8 h-8 bg-indigo-100 rounded-full items-center justify-center border border-indigo-200"
                activeOpacity={0.7}
              >
                <Text className="text-indigo-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
            <View className="flex-row flex-wrap justify-between">
              {journeyDurationOptions.map((duration) => (
                <TouchableOpacity
                  key={duration.label}
                  onPress={() => setJourneyDuration(duration.label)}
                  className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                    journeyDuration === duration.label 
                      ? 'bg-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/80 border-indigo-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{duration.emoji}</Text>
                    <Text className={`text-sm font-semibold text-center ${
                      journeyDuration === duration.label ? 'text-indigo-800' : 'text-gray-700'
                    }`}>
                      {duration.label}
                    </Text>
                    <Text className={`text-xs text-center mt-1 ${
                      journeyDuration === duration.label ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {duration.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Current Selection Display */}
        {(selectedWeather || selectedStressTriggers.length > 0 || travelLocation || journeyType || journeyDuration) && (
          <View className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <Text className="text-sm font-semibold text-blue-800 mb-2">Current Selection:</Text>
            <View className="space-y-2">
              {selectedWeather && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Weather:</Text>
                  <Text className={`text-sm font-semibold ${getWeatherColor(selectedWeather)} px-2 py-1 rounded-full`}>
                    {selectedWeather}
                  </Text>
                </View>
              )}
              {selectedStressTriggers.length > 0 && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Stress Triggers:</Text>
                  <View className="flex-row flex-wrap">
                    {selectedStressTriggers.map((trigger) => (
                      <Text key={trigger} className={`text-sm font-semibold ${getStressTriggerColor(trigger)} px-2 py-1 rounded-full mr-2 mb-1`}>
                        {trigger}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              {travelLocation && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Location:</Text>
                  <Text className="text-sm font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {travelLocation}
                  </Text>
                </View>
              )}
              {journeyType && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Journey Type:</Text>
                  <Text className={`text-sm font-semibold ${getJourneyColor(journeyType)} px-2 py-1 rounded-full`}>
                    {journeyType}
                  </Text>
                </View>
              )}
              {journeyDuration && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Duration:</Text>
                  <Text className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {journeyDuration}
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
