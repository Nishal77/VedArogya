import { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ProgressSubheading() {
  const isDailyRef = useRef(true);
  const keyRef = useRef(0);

  const handleDailyPress = () => {
    isDailyRef.current = true;
    keyRef.current += 1;
  };

  const handleWeeklyPress = () => {
    isDailyRef.current = false;
    keyRef.current += 1;
  };

  return (
    <View key={keyRef.current} className="px-6 py-4 bg-white">
      <View className="flex-row items-center justify-between">
        {/* Left Side - Dynamic Text */}
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {isDailyRef.current ? "Today's Wellness" : "Weekly Wellness"}
          </Text>
          <Text className="text-sm text-gray-600">
            {isDailyRef.current ? "Track your wellness journey" : "Overall trend this week"}
          </Text>
        </View>

        {/* Right Side - Toggle Buttons */}
        <View className="flex-row bg-gray-100 rounded-full p-1">
          {/* Daily Button */}
          <TouchableOpacity
            onPress={handleDailyPress}
            className={`px-4 py-2 rounded-full ${
              isDailyRef.current
                ? 'bg-white shadow-sm'
                : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                isDailyRef.current
                  ? 'text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Daily
            </Text>
          </TouchableOpacity>

          {/* Weekly Button */}
          <TouchableOpacity
            onPress={handleWeeklyPress}
            className={`px-4 py-2 rounded-full ${
              !isDailyRef.current
                ? 'bg-white shadow-sm'
                : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                !isDailyRef.current
                  ? 'text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
