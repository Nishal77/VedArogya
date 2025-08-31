// DigestionGauge.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Line, Circle, G } from "react-native-svg";

type DigestionLevel = 1 | 2 | 3;

const DigestionGauge: React.FC = () => {
  const [level] = useState<DigestionLevel>(2);

  const radius = 100;
  const strokeWidth = 20;

  // Semi-circle from 180° (left) → 0° (right)
  const startAngle = 180;
  const endAngle = 0;

  // Needle positions (inside semi-circle)
  const angleMap = { 1: 150, 2: 90, 3: 30 };
  const needleAngle = angleMap[level];

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
  };

  // Zone definitions
  const zones = [
    { start: 180, end: 120, color: "#EF4444" }, // Red (Poor)
    { start: 120, end: 60, color: "#F59E0B" },  // Yellow (Moderate)
    { start: 60, end: 0, color: "#10B981" },    // Green (Good)
  ];

  return (
    <View style={styles.container}>
      <Svg
        width={radius * 2 + 40}
        height={radius + 40}
        viewBox={`0 0 ${radius * 2 + 40} ${radius + 40}`}
      >
        <G x={radius + 20} y={radius + 20}>
          {/* Background Arc */}
          <Path
            d={describeArc(0, 0, radius, startAngle, endAngle)}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Zone Arcs */}
          {zones.map((zone, idx) => (
            <Path
              key={idx}
              d={describeArc(0, 0, radius, zone.start, zone.end)}
              stroke={zone.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          ))}

          {/* Needle */}
          <Line
            x1={0}
            y1={0}
            x2={radius * 0.75 * Math.cos((needleAngle * Math.PI) / 180)}
            y2={-radius * 0.75 * Math.sin((needleAngle * Math.PI) / 180)}
            stroke="#2563EB"
            strokeWidth="4"
          />

          {/* Needle center circle */}
          <Circle cx={0} cy={0} r={8} fill="white" stroke="#2563EB" strokeWidth="3" />
        </G>
      </Svg>

      {/* Labels */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {level === 1 ? "Poor Digestion" : level === 2 ? "Moderate Digestion" : "Good Digestion"}
        </Text>
        <Text style={styles.value}>
          {level === 1 ? "Weak" : level === 2 ? "Balanced" : "Strong"}
        </Text>
      </View>

      {/* Min / Max */}
      <View style={styles.rangeContainer}>
        <Text style={styles.rangeText}>0%</Text>
        <Text style={styles.rangeText}>100%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  labelContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },
  value: {
    fontSize: 20,
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 4,
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 12,
  },
  rangeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
});

export default DigestionGauge;
