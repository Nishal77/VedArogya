import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { bookAppointment, prepareAppointmentData } from './appointmentService';

interface AppointmentContextType {
  isBooking: boolean;
  handleBookAppointment: (selectedDate: Date, selectedTime: string, notes?: string) => Promise<void>;
  refreshAppointments: () => void;
  refreshTrigger: number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [isBooking, setIsBooking] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshAppointments = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBookAppointment = async (selectedDate: Date, selectedTime: string, notes?: string) => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time for your appointment.');
      return;
    }

    setIsBooking(true);

    try {
      // Prepare appointment data
      const appointmentData = prepareAppointmentData(selectedDate, selectedTime, notes);

      // Book appointment
      const result = await bookAppointment(appointmentData);

      if (result.success) {
        // Trigger refresh of appointments
        refreshAppointments();
        
        Alert.alert(
          'Appointment Booked!',
          `Your appointment has been successfully booked for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Booking Failed', result.error || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <AppointmentContext.Provider value={{ isBooking, handleBookAppointment, refreshAppointments, refreshTrigger }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}
