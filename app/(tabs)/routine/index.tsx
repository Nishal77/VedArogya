import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import Hero from './hero';
import RoutineInput from './routineinput';
import SubmitButton from './submitButton';
import SleepInput, { SleepInputRef } from './SleepInput';
import DigestionTracker from './digestiontracker';
import MoodTracker from './moodtracker';
import EnvironmentTracker from './environmenttracker';
import { useRoutine } from '../../../utils/RoutineContext';

export default function RoutineScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveSleepData, refreshTodayRoutine } = useRoutine();
  
  // Refs to access data from child components
  const sleepInputRef = useRef<SleepInputRef>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Collect sleep data from SleepInput component
    let sleepData = null;
    if (sleepInputRef.current) {
      sleepData = sleepInputRef.current.getSleepData();
    }

    // Validate that we have at least some data to save
    if (!sleepData || Object.keys(sleepData).length === 0) {
      Alert.alert('No Data', 'Please add at least one piece of routine information before submitting.');
      return;
    }

    // Check if we have meaningful data (not just empty values)
    const hasValidData = Object.values(sleepData).some(value => 
      value !== null && value !== undefined && value !== ''
    );

    if (!hasValidData) {
      Alert.alert('No Data', 'Please add at least one piece of routine information before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save sleep data if available
      if (sleepData && Object.keys(sleepData).length > 0) {
        console.log('Saving sleep data:', sleepData);
        await saveSleepData(sleepData);
      }

      // TODO: Collect data from other components (DigestionTracker, MoodTracker, etc.)
      // const digestionData = digestionTrackerRef.current?.getData();
      // const moodData = moodTrackerRef.current?.getData();
      // const environmentData = environmentTrackerRef.current?.getData();

      // Refresh all routine data to ensure latest information is saved
      await refreshTodayRoutine();
      
      // Clear the sleep form to show empty state (page refresh effect)
      if (sleepInputRef.current) {
        sleepInputRef.current.clearForm();
      }
      
      // Show success message
      Alert.alert(
        'Success!', 
        'Your daily routine has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally refresh the page or navigate
              console.log('Routine submitted successfully!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting routine:', error);
      Alert.alert('Error', 'Failed to submit routine. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Sleep Input Section */}
        <View className="px-4 pt-4">
          <SleepInput ref={sleepInputRef} />
        </View>
        
        {/* Routine Input Section */}
        <View className="px-4">
          <RoutineInput />
        </View>
        
        {/* Digestion Tracker Section */}
        <View className="px-4">
          <DigestionTracker />
        </View>
        
        {/* Mood Tracker Section */}
        <View className="px-4">
          <MoodTracker />
        </View>
        
        {/* Environment Tracker Section */}
        <View className="px-4">
          <EnvironmentTracker />
        </View>
      </ScrollView>

      {/* Submit Button - Replaces Bottom Navbar */}
      <SubmitButton onPress={handleSubmit} isLoading={isSubmitting} />
    </SafeAreaView>
  );
}
