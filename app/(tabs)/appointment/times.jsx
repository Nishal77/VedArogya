import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function AppointmentTimes() {
  const [selectedTime, setSelectedTime] = useState('9:00 AM');

  // Generate time slots from 9:00 AM to 1:00 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const timeSlots = [];
    
    // Add 9:00 AM to 12:30 PM slots
    for (let hour = 9; hour <= 12; hour++) {
      // Add full hour slot
      const displayHour = hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      
      timeSlots.push({
        time: `${displayHour}:00 ${ampm}`,
        value: `${hour}:00`
      });
      
      // Add half hour slot for all hours including 12:30 PM
      if (hour <= 12) {
        timeSlots.push({
          time: `${displayHour}:30 ${ampm}`,
          value: `${hour}:30`
        });
      }
    }
    
    // Add 1:00 PM slot
    timeSlots.push({
      time: '1:00 PM',
      value: '13:00'
    });
    
    return timeSlots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <View className="px-6 py-4">
      {/* Time Selection Header */}
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Time
      </Text>
      
      {/* Time Slots Grid with Scrolling */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {timeSlots.map((slot, index) => {
            const isSelected = selectedTime === slot.time;
            
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleTimeSelect(slot.time)}
                className={`w-[30%] mb-3 rounded-xl py-3 px-2 items-center ${
                  isSelected 
                    ? 'bg-white border-2 border-red-500' 
                    : 'bg-white border border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-medium ${
                  isSelected ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
