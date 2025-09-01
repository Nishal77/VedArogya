import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function AppointmentDates({ selectedDate, onDateSelect }) {

  // Generate 6 dates: today + 5 future dates
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const dates = generateDates();

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const formatDate = (date) => {
    return date.getDate().toString();
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isDayAfterTomorrow = (date) => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return date.toDateString() === dayAfterTomorrow.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (date) => {
    onDateSelect(date);
  };

  return (
    <View className="px-6 py-4">
      {/* Date Picker Header with Timing on same line */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          Select Date
        </Text>
        
        {/* Doctor's Timing */}
        <View className="flex-row items-center bg-gray-50 rounded-lg px-3 py-2">
          <Clock size={16} color="#000000" className="ml-2" />
          <View style={{ width: 3 }} />
          <Text className="text-black text-sm font-medium">
            Available: 9:00 AM - 1:00 PM
          </Text>
        </View>
      </View>
      
      {/* Horizontal Scrollable Date Picker - 6 dates */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {dates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isTomorrowDate = isTomorrow(date);
          const isDayAfterTomorrowDate = isDayAfterTomorrow(date);
          const isDateSelected = isSelected(date);
          
          // Only enable today, tomorrow, and day after tomorrow (3 active dates)
          const isEnabled = isTodayDate || isTomorrowDate || isDayAfterTomorrowDate;
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => isEnabled && handleDateSelect(date)}
              disabled={!isEnabled}
              className={`mr-4 rounded-xl p-4 min-w-[60px] items-center ${
                isDateSelected && isEnabled
                  ? 'bg-[#F4B400]' 
                  : isEnabled
                    ? 'bg-white border border-gray-200'
                    : 'bg-gray-100 border border-gray-200'
              }`}
              activeOpacity={isEnabled ? 0.7 : 1}
            >
              {/* Day of Week */}
              <Text className={`text-sm font-medium mb-1 ${
                isDateSelected && isEnabled ? 'text-black' : isEnabled ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {formatDay(date)}
              </Text>
              
              {/* Date Number */}
              <Text className={`text-xl font-bold mb-1 ${
                isDateSelected && isEnabled ? 'text-black' : isEnabled ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {formatDate(date)}
              </Text>
              
              {/* Month */}
              <Text className={`text-xs font-medium ${
                isDateSelected && isEnabled ? 'text-black' : isEnabled ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {formatMonth(date)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
