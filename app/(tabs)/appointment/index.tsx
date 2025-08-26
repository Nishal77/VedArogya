import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import CalendarIcon from '../../../components/CalendarIcon';

export default function AppointmentScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-1 px-6 py-8 pb-20">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Appointments</Text>
          <Text className="text-gray-600 text-base">Schedule and manage your wellness sessions</Text>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          <CalendarIcon size={64} color="#F4B400" />
          <Text className="text-xl font-semibold text-gray-800 mb-2 mt-4">Coming Soon</Text>
          <Text className="text-gray-500 text-center text-base">
            Appointment booking and management features will be available soon.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
