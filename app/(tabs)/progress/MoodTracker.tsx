// MoodTracker.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MoreHorizontal } from "lucide-react-native";

type MoodData = {
  day: string;
  mood: string;
  color: string;
  expression: string;
};

const MoodTracker: React.FC = () => {
  const moodData: MoodData[] = [
    {
      day: "Mon",
      mood: "Angry",
      color: "#EF4444", // Vibrant red
      expression: "😠"
    },
    {
      day: "Tue", 
      mood: "Shy",
      color: "#FCE7F3", // Light pink
      expression: "😳"
    },
    {
      day: "Wed",
      mood: "Angry",
      color: "#DBEAFE", // Light blue
      expression: "😤"
    },
    {
      day: "Thr",
      mood: "Distressed", 
      color: "#FCE7F3", // Light pink
      expression: "😰"
    },
    {
      day: "Fri",
      mood: "Happy",
      color: "#A7F3D0", // Bright lime green
      expression: "😉"
    }
  ];

  return (
    <View className="bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-black">
          Mood History
        </Text>
        <TouchableOpacity className="p-2">
          <MoreHorizontal size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Mood Icons Row */}
      <View className="flex-row justify-between">
        {moodData.map((mood, index) => (
          <View key={index} className="items-center">
            {/* Mood Icon Square */}
            <View 
              className="w-16 h-16 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: mood.color }}
            >
              <Text className="text-2xl">
                {mood.expression}
              </Text>
            </View>
            
            {/* Day Label */}
            <Text className="text-black text-sm font-medium">
              {mood.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MoodTracker;
