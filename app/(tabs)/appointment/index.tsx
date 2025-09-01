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
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Doctor Profile Hero */}
        <AppointmentHero />
        
        {/* Date Picker */}
        <View>
          <AppointmentDates 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        </View>
        
        {/* Time Selection */}
        <View>
          <AppointmentTimes 
            selectedTime={selectedTime} 
            onTimeSelect={setSelectedTime} 
          />
        </View>

        {/* Notes Input */}
        <View>
          <NotesInput 
            notes={notes} 
            onNotesChange={setNotes} 
          />
        </View>

        {/* Recent Appointments */}
        <View>
          <AppointmentsList />
        </View>
      </ScrollView>

      {/* Simple bottom spacing for the Book Appointment button */}
      <View className="h-20" />
    </SafeAreaView>
  );
}
