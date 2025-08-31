// MoodTracker.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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
    },
    {
      day: "Sat",
      mood: "Excited",
      color: "#FEF3C7", // Light yellow
      expression: "🤩"
    },
    {
      day: "Sun",
      mood: "Relaxed",
      color: "#E0E7FF", // Light indigo
      expression: "😌"
    }
  ];

  return (
    <View className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-black">
          Mood History
        </Text>
        <TouchableOpacity className="p-2">
          <MoreHorizontal size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrolling Mood Icons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="flex-1"
      >
        <View className="flex-row space-x-4">
          {moodData.map((mood, index) => (
            <View key={index} className="items-center min-w-[70px]">
              {/* Mood Icon Square */}
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center mb-2 shadow-sm"
                style={{ 
                  backgroundColor: mood.color,
                  shadowColor: mood.color,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text className="text-2xl">
                  {mood.expression}
                </Text>
              </View>
              
              {/* Day Label */}
              <Text className="text-black text-sm font-semibold text-center">
                {mood.day}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MoodTracker;
