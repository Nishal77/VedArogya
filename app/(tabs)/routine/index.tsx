import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import Hero from './hero';
import RoutineInput from './routineinput';
import SubmitButton from './submitButton';

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
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Routine Input Section */}
        <RoutineInput />
        
        {/* Additional content will go here */}
        <View className="px-6 py-4">
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">
              More routine features coming soon...
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button - Replaces Bottom Navbar */}
      <SubmitButton onPress={handleSubmit} isLoading={isSubmitting} />
    </SafeAreaView>
  );
}
