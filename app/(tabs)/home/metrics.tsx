import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Footprints, Droplets, Flame, Bed, Zap } from 'lucide-react-native';

interface DayItem {
  day: string;
  date: string;
  isActive: boolean;
}

export default function Metrics() {
  // Get today's date and calculate the week
  const today = new Date();
  const todayDate = today.getDate();
  const todayDay = today.getDay();

  // Calculate dates for the week (3 days before, today, 3 days after)
  const getDateForDay = (offset: number) => {
    const date = new Date(today);
    date.setDate(todayDate + offset);
    return date;
  };

  const days: DayItem[] = [
    {
      day: getDateForDay(-3).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(-3).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(-2).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(-2).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(-1).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(-1).getDate().toString(),
      isActive: false
    },
    {
      day: today.toLocaleDateString('en-US', { weekday: 'short' }),
      date: todayDate.toString(),
      isActive: true
    },
    {
      day: getDateForDay(1).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(1).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(2).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(2).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(3).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(3).getDate().toString(),
      isActive: false
    }
  ];

  const [selectedDay, setSelectedDay] = useState(3); // Today is at index 3

  const handleDayPress = (index: number) => {
    setSelectedDay(index);
  };

  return (
    <View className="px-6 pb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-gray-900">
          Daily Metrics
        </Text>
        <Text className="text-blue-600 text-base font-medium">
          View All
        </Text>
      </View>

      {/* Date Selector and Calorie Tracker Card */}
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        {/* Date Selector */}
        <View className="flex-row justify-between mb-6">
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDayPress(index)}
              className={`items-center justify-center ${day.isActive
                  ? 'bg-lime-400 px-3 py-2 rounded-full'
                  : 'bg-gray-200 px-3 py-2 rounded-full'
                }`}
              activeOpacity={0.8}
            >
              <Text className={`text-xs font-medium ${day.isActive ? 'text-white' : 'text-gray-700'
                }`}>
                {day.day}
              </Text>
              <View className={`w-6 h-6 rounded-full items-center justify-center mt-1 ${day.isActive ? 'bg-white' : 'bg-white'
                }`}>
                {day.isActive ? (
                  <View className="w-2 h-2 bg-lime-400 rounded-full" />
                ) : (
                  <Text className="text-xs font-medium text-gray-700">
                    {day.date}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calorie Tracker */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Flame size={20} color="#374151" />
            <Text className="text-gray-700 text-base ml-2 font-medium">
              Calories left
            </Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">
            1,250
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="mt-3">
          <View className="h-2 bg-gray-200 rounded-full">
            <View className="h-2 bg-lime-400 rounded-full w-[65%]" />
          </View>
        </View>
      </View>

      {/* Original Metrics Cards */}
      <View className="flex-row justify-between">
        {/* Sleep Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Bed size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
                Sleep               </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                7hr 20min
              </Text>
              <View className="flex-row items-center mt-1">
                {/* <View className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" /> */}
                <Text className="text-green-700 text-sm font-semibold">
                  Deep – Kapha
                </Text>
                <Text className="bg-white">🔻</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Water Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Bed size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
                Drink water    </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
               12 glasses
              </Text>
              <View className="flex-row items-center mt-1">
                {/* <View className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" /> */}
                <Text className="text-green-700 text-sm font-semibold">
                  Hydrated – Kapha
                </Text>
                <Text className="text-green-500">🔻</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/*  Tracking Cards */}
      <View className="flex-row justify-between mt-4">
        {/* Energy Level Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Zap size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
                Energy Level
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                78%
              </Text>
              <Text className="text-green-700 text-sm font-semibold">
                High – Pitta
              </Text>
            </View>
            {/* <View className="w-16 h-16">
              <View className="w-16 h-16 rounded-full border-4 border-gray-200 items-center justify-center">
                <View className="w-12 h-12 rounded-full bg-lime-400 items-center justify-center">
                  <Text className="text-white text-xs font-bold">85%</Text>
                </View>
              </View>
            </View> */}
          </View>
        </View>

        {/* Digestion Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Text className="text-lg">🍚</Text>
              </View>
              <Text className="text-gray-600 text-sm font-medium">
              Digestion
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
               69%
              </Text>
              <Text className="text-green-600 font-semibold text-sm">
              Low — Vata Agni Weak
              </Text>
            </View>
            {/* <View className="w-16 h-16">
              <View className="w-16 h-16 rounded-full border-4 border-gray-200 items-center justify-center">
                <View className="w-12 h-12 rounded-full bg-orange-500 items-center justify-center">
                  <Text className="text-white text-xs font-bold">75%</Text>
                </View>
              </View>
            </View> */}
          </View>
        </View>
      </View>

      {/* Period Tracker */}
      <View className="w-full bg-white rounded-2xl p-4 border border-gray-300 mt-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Period Tracker
          </Text>
          <Text className="text-red-600 text-base font-medium">
            Ongoing - 4 days
          </Text>
        </View>
        <View className="flex-row justify-between">
          {Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            const isOngoing = index < 4; // First 4 days are ongoing
            
            return (
              <View key={index} className="items-center">
                <View className={`w-12 h-12 rounded-lg border-2 items-center justify-center mb-2 ${
                  isOngoing 
                    ? 'bg-red-500 border-red-500' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <Text className={`text-xs font-medium ${
                    isOngoing ? 'text-white' : 'text-gray-700'
                  }`}>
                    {date.getDate()}
                  </Text>
                </View>
                <Text className={`text-xs font-medium ${
                  isOngoing ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
