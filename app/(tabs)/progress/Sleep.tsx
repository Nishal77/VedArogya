// Sleep.tsx
import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const Sleep: React.FC = () => {
  const sleepData = [
    {
      value: 6.5,
      label: "Mon",
      dataPointText: "6.5h"
    },
    {
      value: 7.2,
      label: "Tue",
      dataPointText: "7.2h"
    },
    {
      value: 5.8,
      label: "Wed",
      dataPointText: "5.8h"
    },
    {
      value: 6.9,
      label: "Thu",
      dataPointText: "6.9h"
    },
    {
      value: 7.5,
      label: "Fri",
      dataPointText: "7.5h"
    },
    {
      value: 9.2,
      label: "Sat",
      dataPointText: "9.2h"
    },
    {
      value: 8.8,
      label: "Sun",
      dataPointText: "8.8h"
    },
  ];

  const declineData = [
    { value: 7.0, label: "Mon", dataPointText: "7.0h" },
    { value: 6.8, label: "Tue", dataPointText: "6.8h" },
    { value: 6.5, label: "Wed", dataPointText: "6.5h" },
    { value: 6.2, label: "Thu", dataPointText: "6.2h" },
    { value: 5.9, label: "Fri", dataPointText: "5.9h" },
    { value: 6.1, label: "Sat", dataPointText: "6.1h" },
    { value: 6.3, label: "Sun", dataPointText: "6.3h" },
  ];

  return (
    <View className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Sleep Tracking
        </Text>
        <Text className="text-gray-600 text-sm">
          Track your daily sleep hours and sleep decline trend
        </Text>
      </View>

      {/* First Line Chart - Actual Sleep (Blue) */}
      <View className="items-center mb-4">
        <LineChart
          data={sleepData}
          width={300}
          height={220}
          yAxisLabelWidth={30}
          yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#374151', fontSize: 10, fontWeight: '600' }}
          yAxisColor="#D1D5DB"
          xAxisColor="#D1D5DB"
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisTextNumberOfLines={1}
          yAxisLabelSuffix="h"
          xAxisLabelsVerticalShift={8}
          yAxisExtraHeight={20}
          yAxisLabelPrefix=""
          hideRules={false}
          rulesType="solid"
          rulesColor="#F3F4F6"
          rulesThickness={1}
          initialSpacing={20}
          endSpacing={20}
          spacing={40}
          thickness={3}
          color="#3B82F6"
          dataPointsColor="#3B82F6"
          dataPointsRadius={6}
          curved={true}
          showVerticalLines={false}
          verticalLinesColor="#F3F4F6"
          verticalLinesThickness={1}
          verticalLinesStrokeDashArray={[2, 2]}
          maxValue={14}
          noOfSections={7}
          backgroundColor="transparent"
        />
      </View>

      {/* Second Line Chart - Sleep Decline (Amber) */}
      <View className="items-center">
        <LineChart
          data={declineData}
          width={300}
          height={220}
          yAxisLabelWidth={30}
          yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#374151', fontSize: 10, fontWeight: '600' }}
          yAxisColor="#D1D5DB"
          xAxisColor="#D1D5DB"
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisTextNumberOfLines={1}
          yAxisLabelSuffix="h"
          xAxisLabelsVerticalShift={8}
          yAxisExtraHeight={20}
          yAxisLabelPrefix=""
          hideRules={false}
          rulesType="solid"
          rulesColor="#F3F4F6"
          rulesThickness={1}
          initialSpacing={20}
          endSpacing={20}
          spacing={40}
          thickness={3}
          color="#F59E0B"
          dataPointsColor="#F59E0B"
          dataPointsRadius={6}
          curved={true}
          showVerticalLines={false}
          verticalLinesColor="#F3F4F6"
          verticalLinesThickness={1}
          verticalLinesStrokeDashArray={[2, 2]}
          maxValue={14}
          noOfSections={7}
          backgroundColor="transparent"
        />
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-center mt-6 space-x-6">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <Text className="text-xs text-gray-700 font-medium">Actual Sleep</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-amber-500 rounded-full mr-2" />
          <Text className="text-xs text-gray-700 font-medium">Sleep Decline</Text>
        </View>
      </View>

      {/* Sleep Analysis */}
      <View className="mt-4 p-4 bg-gray-50 rounded-xl">
        <Text className="text-sm font-semibold text-gray-800 mb-2 text-center">
          Weekly Sleep Analysis
        </Text>
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-xs text-gray-600">Best Day</Text>
            <Text className="text-sm font-bold text-green-600">Saturday</Text>
            <Text className="text-xs text-gray-500">9.2 hours</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-600">Sleep Trend</Text>
            <Text className="text-sm font-bold text-amber-600">Declining</Text>
            <Text className="text-xs text-gray-500">-0.7h avg</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-600">Avg Sleep</Text>
            <Text className="text-sm font-bold text-blue-600">7.4 hours</Text>
            <Text className="text-xs text-gray-500">Below 8h target</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Sleep;
