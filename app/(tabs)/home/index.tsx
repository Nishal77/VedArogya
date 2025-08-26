import React from 'react';
import { View, ScrollView } from 'react-native';
import Hero from './hero';
import Appointment from './appointment';
import Metrics from './metrics';

export default function Home() {
  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Hero />
        <Appointment />
        <Metrics />
        <View className="px-6 py-4">
          {/* Additional content will go here */}
        </View>
      </ScrollView>
    </View>
  );
}
