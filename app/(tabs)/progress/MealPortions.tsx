// MealPortions.tsx
import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const MealPortions: React.FC = () => {
  const mealData = [
    {
      value: 40,
      text: "Small",
      color: "#EF4444", // Red for small portions
      textColor: "#FFFFFF",
      textSize: 12,
      fontWeight: "600",
    },
    {
      value: 50,
      text: "Normal",
      color: "#10B981", // Green for normal portions
      textColor: "#FFFFFF",
      textSize: 12,
      fontWeight: "600",
    },
    {
      value: 10,
      text: "Large",
      color: "#F59E0B", // Amber for large portions
      textColor: "#FFFFFF",
      textSize: 12,
      fontWeight: "600",
    },
  ];

  const renderDot = (color: string, text: string, percentage: number) => (
    <View className="flex-row items-center mb-3">
      <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: color }} />
      <Text className="text-gray-700 font-medium flex-1">{text}</Text>
      <Text className="text-gray-900 font-bold text-lg">{percentage}%</Text>
    </View>
  );

  return (
    <View className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Meal Portions
        </Text>
        <Text className="text-gray-600 text-sm">
          Track your daily food portion habits and eating patterns
        </Text>
      </View>

      {/* Chart Container */}
      <View className="items-center mb-6">
        <View className="relative">
          {/* Pie Chart */}
          <PieChart
            data={mealData}
            donut
            showText={false}
            textColor="black"
            textSize={12}
            radius={80}
            innerRadius={50}
            centerLabelComponent={() => (
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-800">Total</Text>
                <Text className="text-lg text-gray-600">100%</Text>
              </View>
            )}
          />
          
          {/* Chart Overlay Info */}
          <View className="absolute -bottom-2 left-0 right-0 items-center">
            <View className="bg-white px-3 py-1 rounded-full border border-gray-200">
              <Text className="text-xs text-gray-600 font-medium">
                Weekly Average
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-800 mb-3 text-center">
          Portion Distribution
        </Text>
        {renderDot("#EF4444", "Small Portions", 40)}
        {renderDot("#10B981", "Normal Portions", 50)}
        {renderDot("#F59E0B", "Large Portions", 10)}
      </View>

      {/* Insights */}
      <View className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <Text className="text-sm font-semibold text-blue-800 mb-2 text-center">
          🍽️ Food Habits Insights
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-xs text-blue-700">
              <Text className="font-semibold">50% Normal:</Text> You're mostly eating balanced portions
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            <Text className="text-xs text-blue-700">
              <Text className="font-semibold">40% Small:</Text> Consider if you're eating enough
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
            <Text className="text-xs text-blue-700">
              <Text className="font-semibold">10% Large:</Text> Occasional overeating is normal
            </Text>
          </View>
        </View>
      </View>

      {/* Weekly Summary */}
      <View className="mt-4 p-4 bg-gray-50 rounded-xl">
        <Text className="text-sm font-semibold text-gray-800 mb-3 text-center">
          Weekly Portion Summary
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-xs text-gray-600">Most Common</Text>
            <Text className="text-sm font-bold text-green-600">Normal</Text>
            <Text className="text-xs text-gray-500">50% of meals</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-600">Portion Trend</Text>
            <Text className="text-sm font-bold text-blue-600">Balanced</Text>
            <Text className="text-xs text-gray-500">Good variety</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-600">Goal</Text>
            <Text className="text-sm font-bold text-indigo-600">60% Normal</Text>
            <Text className="text-xs text-gray-500">Increase normal</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MealPortions;
