// ProgressGauge.tsx
import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

type Props = {
  value: number; // percentage 0–100
};

const ProgressGauge: React.FC<Props> = ({ value }) => {
  const size = 250; // chart size
  const strokeWidth = 15; // thick stroke for prominence
  const center = size / 2;
  const radius = size / 2 - strokeWidth;

  // Convert percentage → angle (start from bottom left, progress clockwise)
  const startAngle = -125; // Bottom left (Min)
  const endAngle = 135; // Bottom right (Max)
  const angleRange = endAngle - startAngle;
  const currentAngle = startAngle + (value / 100) * angleRange;

  // Create circular arc path
  const createArcPath = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Create filled arc path based on value
  const createFilledArcPath = () => {
    if (value <= 0) return "";
    
    // Start from bottom left (Min) and progress clockwise to current value
    const startAngle = -135; // Bottom left (Min)
    const endAngle = -135 + (value / 100) * 270; // Progress clockwise from Min
    
    return createArcPath(startAngle, endAngle);
  };

  // Determine the category and color based on value
  const getCategory = (val: number) => {
    if (val <= 33) return { text: "Low Intensity", color: "#4CAF50" };
    if (val <= 66) return { text: "Medium Intensity", color: "#FF9800" };
    return { text: "High Intensity", color: "#F44336" };
  };

  const category = getCategory(value);

  return (
    <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      {/* Circular Progress Gauge */}
      <View className="relative mb-6">
        <Svg width={size} height={size}>
          {/* Background arc (unfilled portion) - full track from Min to Max */}
          <Path
            d={createArcPath(-135, 135)}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Filled arc (active portion) - from Min to current value */}
          {value > 0 && (
            <Path
              d={createFilledArcPath()}
              stroke="#3B82F6"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          )}
          
          {/* Knob at current position */}
          {value > 0 && (
            <Circle
              cx={center + radius * Math.cos((currentAngle * Math.PI) / 180)}
              cy={center + radius * Math.sin((currentAngle * Math.PI) / 180)}
              r={12}
              fill="#3B82F6"
              stroke="#FFFFFF"
              strokeWidth={3}
            />
          )}
          
          {/* Min indicator dot (bottom left) */}
          <Circle
            cx={center + radius * Math.cos((-135 * Math.PI) / 180)}
            cy={center + radius * Math.sin((-135 * Math.PI) / 180)}
            r={4}
            fill="#000000"
          />
          
          {/* Max indicator dot (bottom right) */}
          <Circle
            cx={center + radius * Math.cos((135 * Math.PI) / 180)}
            cy={center + radius * Math.sin((135 * Math.PI) / 180)}
            r={4}
            fill="#000000"
          />
        </Svg>
        
        {/* Custom Center Content */}
        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
          {/* Main Value - 80% */}
          <Text className="text-4xl font-bold text-black mb-2">
            {value}%
          </Text>
          
          {/* Intensity Label */}
          <Text className="text-black text-base font-medium text-center">
            {category.text}
          </Text>
        </View>
      </View>

      {/* Min and Max Labels */}
      <View className="flex-row justify-between w-full px-8 mb-6">
        <View className="items-center">
          <Text className="text-black text-sm font-medium">Min</Text>
          <View className="w-2 h-2 bg-black rounded-full mt-1" />
        </View>
        <View className="items-center">
          <Text className="text-black text-sm font-medium">Max</Text>
          <View className="w-2 h-2 bg-black rounded-full mt-1" />
        </View>
      </View>
    </View>
  );
};

export default ProgressGauge;
