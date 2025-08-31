import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import Hero from './hero';
import RoutineInput from './routineinput';
import SubmitButton from './submitButton';
import DigestionTracker from './digestiontracker';
import MoodTracker from './moodtracker';
import EnvironmentTracker from './environmenttracker';
import SleepTracker from './sleeptracker';

export default function RoutineScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle success - could navigate to success screen or show toast
      console.log('Routine submitted successfully!');
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Fixed Header */}
      <View className="bg-white border-b border-gray-100">
        <Header />
      </View>

    
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
                  {/* Routine Input Section */}
          <RoutineInput />
          
          {/* Digestion Tracker Section */}
          <DigestionTracker />
          
          {/* Mood Tracker Section */}
          <MoodTracker />
          
          {/* Environment Tracker Section */}
          <EnvironmentTracker />
          
          {/* Sleep Tracker Section */}
          <SleepTracker />
          
          {/* Additional content will go here */}
       
      </ScrollView>

      {/* Submit Button - Replaces Bottom Navbar */}
      <SubmitButton onPress={handleSubmit} isLoading={isSubmitting} />
    </SafeAreaView>
  );
}
