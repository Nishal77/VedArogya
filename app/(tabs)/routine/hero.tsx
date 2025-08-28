import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Hero() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(istTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="px-6 py-6 flex-row items-center justify-between">
      {/* Left Section - Text */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800 ">
        Dinacharya
        </Text>
        <Text className="text-xl font-bold text-gray-800">
        Your Daily Flow.
        </Text>
      </View>

      {/* Right Section - Live Time */}
      <View className="items-end">
        <Text className="text-sm text-gray-500 mb-1">IST</Text>
        <Text className="text-base font-semibold text-gray-700">
          {currentTime}
        </Text>
      </View>
    </View>
  );
}
