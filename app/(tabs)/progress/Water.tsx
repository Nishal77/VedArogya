// Water.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import Svg, { Rect, Line, Text as SvgText, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

type WaterData = {
  day: string;
  consumed: number; // in liters
  target: number; // in liters
};

const Water: React.FC = () => {
  const waterData: WaterData[] = [
    { day: "Mon", consumed: 2.5, target: 4 },
    { day: "Tue", consumed: 3.2, target: 4 },
    { day: "Wed", consumed: 1.8, target: 4 },
    { day: "Thu", consumed: 3.8, target: 4 },
    { day: "Fri", consumed: 2.9, target: 4 },
    { day: "Sat", consumed: 4.1, target: 4 },
    { day: "Sun", consumed: 3.5, target: 4 },
  ];

  // Animation values - fixed initialization
  const animatedValues = useRef<Animated.Value[]>([]);
  const fadeAnim = useRef(new Animated.Value(0));

  // Initialize animation values
  React.useEffect(() => {
    animatedValues.current = waterData.map(() => new Animated.Value(0));
  }, []);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim.current, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Staggered bar fill animation
    if (animatedValues.current.length > 0) {
      const animations = animatedValues.current.map((_, index) =>
        Animated.timing(animatedValues.current[index], {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: false,
        })
      );

      Animated.stagger(100, animations).start();
    }
  }, []);

  // Optimized chart dimensions - compact and fits all days
  const containerWidth = 380; // Reduced container width
  const chartWidth = containerWidth - 40; // Minimal padding
  const chartHeight = 220; // Reduced height for compact design
  const barWidth = 26; // Smaller bars to fit all days
  const barSpacing = 10; // Minimal spacing between bars
  const maxValue = 16; // Maximum value on Y-axis
  const padding = 35; // Reduced padding for better space usage

  // Calculate total width needed for bars
  const totalBarsWidth = waterData.length * barWidth + (waterData.length - 1) * barSpacing;
  const availableWidth = chartWidth - padding * 2;
  
  // Adjust spacing if needed to fit all bars
  const adjustedBarSpacing = totalBarsWidth <= availableWidth 
    ? barSpacing 
    : (availableWidth - waterData.length * barWidth) / (waterData.length - 1);

  // Calculate positions
  const getBarHeight = (value: number) => {
    return (value / maxValue) * (chartHeight - padding * 2);
  };

  const getBarY = (value: number) => {
    return chartHeight - padding - getBarHeight(value);
  };

  // Get water color based on consumption level
  const getWaterColor = (consumed: number, target: number) => {
    const percentage = (consumed / target) * 100;
    if (percentage >= 100) {
      return "#1E40AF"; // Dark blue for target achieved
    } else if (percentage >= 75) {
      return "#3B82F6"; // Bright blue for close to target
    } else if (percentage >= 50) {
      return "#60A5FA"; // Medium blue for moderate consumption
    } else {
      return "#93C5FD"; // Light blue for low consumption
    }
  };

  return (
    <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
      {/* Compact Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Daily Water Intake
        </Text>
        <Text className="text-gray-600 text-sm">
          Track your daily water consumption (Target: 4L per day)
        </Text>
      </View>

      {/* Compact Chart Container */}
      <View className="items-center" style={{ width: containerWidth }}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Define gradients for beautiful water effect */}
          <Defs>
            <LinearGradient id="waterGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
              <Stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="waterGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="waterGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#1E40AF" stopOpacity="1" />
              <Stop offset="100%" stopColor="#1E3A8A" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Y-axis labels with minimal spacing */}
          {[16, 14, 12, 10, 8, 6, 4, 2, 0].map((value) => {
            const y = chartHeight - padding - (value / maxValue) * (chartHeight - padding * 2);
            return (
              <SvgText
                key={value}
                x={8}
                y={y + 4}
                fontSize="10"
                fill="#6B7280"
                textAnchor="end"
                fontWeight="500"
              >
                {value}L
              </SvgText>
            );
          })}

          {/* Y-axis line - closer to bars */}
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#D1D5DB"
            strokeWidth="1"
          />

          {/* X-axis line */}
          <Line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#D1D5DB"
            strokeWidth="1"
          />

          {/* Compact Water bars */}
          {waterData.map((data, index) => {
            const x = padding + index * (barWidth + adjustedBarSpacing);
            const barHeight = getBarHeight(data.consumed);
            const barY = getBarY(data.consumed);
            const waterColor = getWaterColor(data.consumed, data.target);

            return (
              <View key={index}>
                {/* Compact background bar (empty glass) */}
                <Rect
                  x={x}
                  y={padding}
                  width={barWidth}
                  height={chartHeight - padding * 2}
                  fill="#F9FAFB"
                  rx={4}
                  ry={4}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />

                {/* Beautiful water fill with gradient - Animated */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: x,
                    top: barY,
                    width: barWidth,
                    height: barHeight,
                    backgroundColor: waterColor,
                    borderRadius: 4,
                    opacity: animatedValues.current[index] || 0,
                    transform: [{
                      scaleY: (animatedValues.current[index] || new Animated.Value(0)).interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }],
                    // Add beautiful shadow effect
                    shadowColor: waterColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                />

                {/* Water surface highlight for realistic effect */}
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: x + 2,
                    top: barY + 2,
                    width: barWidth - 4,
                    height: 3,
                    backgroundColor: '#FFFFFF',
                    opacity: 0.4,
                    borderRadius: 2,
                    transform: [{
                      scaleY: (animatedValues.current[index] || new Animated.Value(0)).interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      })
                    }]
                  }}
                />

                {/* Day label - positioned to fit inside */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - padding + 18}
                  fontSize="10"
                  fill="#374151"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {data.day}
                </SvgText>

                {/* Value label above bar */}
                <SvgText
                  x={x + barWidth / 2}
                  y={barY - 6}
                  fontSize="9"
                  fill="#1E40AF"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {data.consumed}L
                </SvgText>
              </View>
            );
          })}
        </Svg>

        {/* Compact Legend */}
        <View className="flex-row items-center justify-center mt-6 space-x-6">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <Text className="text-xs text-gray-700 font-medium">Consumed</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-gray-100 rounded mr-2 border border-gray-300" />
            <Text className="text-xs text-gray-700 font-medium">Empty Glass</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Water;
