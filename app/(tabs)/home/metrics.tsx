import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Footprints, Droplets, Flame } from 'lucide-react-native';

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
              className={`items-center justify-center ${
                day.isActive 
                  ? 'bg-lime-400 px-3 py-2 rounded-full' 
                  : 'bg-gray-200 px-3 py-2 rounded-full'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-xs font-medium ${
                day.isActive ? 'text-white' : 'text-gray-700'
              }`}>
                {day.day}
              </Text>
              <View className={`w-6 h-6 rounded-full items-center justify-center mt-1 ${
                day.isActive ? 'bg-white' : 'bg-white'
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
        {/* Steps Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Step to walk
            </Text>
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Footprints size={20} color="#F97316" />
            </View>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-3xl font-bold text-gray-900">
              5,500
            </Text>
            <Text className="text-base text-gray-500 ml-2">
              steps
            </Text>
          </View>
        </View>

        {/* Water Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Drink Water
            </Text>
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Droplets size={20} color="#3B82F6" />
            </View>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-3xl font-bold text-gray-900">
              12
            </Text>
            <Text className="text-base text-gray-500 ml-2">
              glass
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
