import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { ArrowUpRight, Cross, Phone, Star, Calendar, Clock, User, Plus, AlertCircle } from 'lucide-react-native';
import { getUserAppointments, AppointmentWithUser, debugUserData } from '../../../utils/appointmentService';
import { useRouter, useFocusEffect } from 'expo-router';

export default function Appointment() {
  const [appointments, setAppointments] = useState<AppointmentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadAppointments = async () => {
    try {
      console.log('Loading appointments...');
      
      // Debug user data first
      await debugUserData();
      
      const result = await getUserAppointments();
      console.log('Appointments result:', result);
      
      if (result.success) {
        console.log('Appointments loaded:', result.data?.length || 0, 'appointments');
        setAppointments(result.data || []);
      } else {
        console.error('Failed to load appointments:', result.error);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Refresh appointments when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home appointment screen focused, refreshing appointments...');
      loadAppointments();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // Convert "09:00:00" to "9:00 AM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleBookNewAppointment = () => {
    router.push('/(tabs)/appointment');
  };

  return (
    <View className="px-6 pb-4">
      {/* Header Section */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-gray-900">
          My Appointments
        </Text>
        <TouchableOpacity 
          onPress={handleBookNewAppointment}
          className="flex-row items-center bg-[#F4B400] rounded-full px-4 py-2"
          activeOpacity={0.8}
        >
          <Plus size={16} color="#000" className="mr-1" />
          <Text className="text-black font-semibold text-sm">
            Book New
          </Text>
        </TouchableOpacity>
      </View>



      {/* Appointments List */}
      {loading ? (
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 items-center">
          <Text className="text-gray-600">Loading appointments...</Text>
        </View>
      ) : appointments.length === 0 ? (
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <View className="items-center">
            <Calendar size={48} color="#9CA3AF" className="mb-4" />
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              No Appointments
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              You haven't booked any appointments yet.
            </Text>
            <TouchableOpacity 
              onPress={handleBookNewAppointment}
              className="bg-[#F4B400] rounded-full px-6 py-3"
              activeOpacity={0.8}
            >
              <Text className="text-black font-semibold">
                Book Your First Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {appointments.slice(0, 1).map((appointment, index) => (
            <View key={appointment.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
              <View className="flex-row items-start">
                {/* Doctor Profile Picture */}
                <View className="relative mr-4">
                  <Image
                    source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/doctor.jpeg' }}
                    className="w-16 h-16 rounded-xl"
                    defaultSource={require('../../../assets/images/ayurvedic.png')}
                  />
                  <View className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white ${
                    appointment.status === 'confirmed' ? 'bg-green-600' :
                    appointment.status === 'completed' ? 'bg-blue-600' :
                    appointment.status === 'cancelled' ? 'bg-red-600' :
                    'bg-yellow-600'
                  }`}>
                    <View className="w-2 h-2 bg-white rounded-full" />
                  </View>
                </View>

                {/* Appointment Details */}
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-gray-500 text-sm">
                      {formatDate(appointment.appointment_date)}
                    </Text>
                    <View className={`ml-2 px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      <Text className="text-xs font-medium">
                        {getStatusText(appointment.status)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-lg font-bold text-gray-900">
                    Dr. Ashok Seth
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Kayachikitsa Vaidya
                  </Text>
                  
                  {/* Patient Info */}
                  {appointment.user_name && (
                    <View className="flex-row items-center mt-2">
                      <User size={12} color="#6B7280" className="mr-1" />
                      <Text className="text-gray-600 text-xs">
                        {appointment.user_name}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Time and Navigation */}
                <View className="items-end">
                  <View className="bg-gray-100 rounded-lg px-3 py-1 mb-2">
                    <Text className="text-gray-700 text-sm font-medium">
                      {formatTime(appointment.appointment_time)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => router.push('/(tabs)/appointment')}
                    className="flex-row items-center bg-gray-100 rounded-full px-3 py-2"
                    activeOpacity={0.7}
                  >
                    <ArrowUpRight size={16} color="#3B82F6" />
                    <Text className="ml-1 text-blue-600 text-sm font-medium">View</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notes Section */}
              {appointment.notes && (
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-start">
                    <AlertCircle size={14} color="#F59E0B" className="mr-2 mt-0.5" />
                    <Text className="text-gray-600 text-sm flex-1">
                      {appointment.notes}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Show More Button */}
          {appointments.length > 1 && (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/appointment')}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 text-center font-medium">
                View All {appointments.length} Appointments
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}
