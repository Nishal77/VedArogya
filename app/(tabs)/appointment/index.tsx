import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import AppointmentHeader from './header';
import AppointmentHero from './hero';
import AppointmentDates from './dates';
import AppointmentTimes from './times';
import NotesInput from './NotesInput';
import AppointmentsList from './AppointmentsList';

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [notes, setNotes] = useState('');

  // Expose selected values for the layout button to use
  useEffect(() => {
    // Store the selected values in a simple object that can be accessed
    (global as any).appointmentData = {
      selectedDate,
      selectedTime,
      notes
    };
  }, [selectedDate, selectedTime, notes]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Fixed Header */}
      <View className="h-2" />
      <AppointmentHeader />
      
      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Doctor Profile Hero */}
        <AppointmentHero />
        
        {/* Date Picker */}
        <AppointmentDates 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
        
        {/* Time Selection */}
        <AppointmentTimes 
          selectedTime={selectedTime} 
          onTimeSelect={setSelectedTime} 
        />

        {/* Notes Input */}
        <NotesInput 
          notes={notes} 
          onNotesChange={setNotes} 
        />

        {/* Recent Appointment */}
        <AppointmentsList />
      </ScrollView>



      {/* Bottom Blur Effect - Seamless Smooth Transition */}
      <View className="absolute bottom-24 left-0 right-0 h-2 z-40">
        <BlurView 
          intensity={40} 
          tint="light"
          className="flex-1"
        />
        {/* Seamless gradient overlay - no hard edges */}
        <View className="absolute inset-0 bg-gradient-to-t from-white/40 via-white/25 via-white/15 to-transparent" />
      </View>
      
      {/* Second Layer - Seamless Medium Blur */}
      <View className="absolute bottom-20 left-0 right-0 h-2 z-40">
        <BlurView 
          intensity={20} 
          tint="light"
          className="flex-1"
        />
        {/* Seamless medium blur - smooth transition */}
        <View className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/12 via-white/6 to-transparent" />
      </View>
      
      {/* Third Layer - Seamless Subtle Blur */}
      <View className="absolute bottom-16 left-0 h-1 z-40">
        <BlurView 
          intensity={0} 
          tint="light"
          className="flex-1"
        />
        {/* Completely transparent - no visible lines */}
        <View className="absolute inset-0 bg-transparent" />
      </View>
    </SafeAreaView>
  );
}
