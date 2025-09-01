import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Calendar, Clock, User, Phone, Mail, Trash2 } from 'lucide-react-native';
import { getUserAppointments, cancelAppointment, deleteAppointment } from '../../../utils/appointmentService';
import { AppointmentWithUser } from '../../../utils/appointmentService';
import { useAppointment } from '../../../utils/AppointmentContext';

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<AppointmentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshTrigger } = useAppointment();

  const loadAppointments = async () => {
    try {
      const result = await getUserAppointments();
      if (result.success) {
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

  // Listen for refresh trigger from context
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadAppointments();
    }
  }, [refreshTrigger]);

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelAppointment(appointmentId);
            if (result.success) {
              Alert.alert('Success', 'Appointment cancelled successfully.');
              loadAppointments(); // Reload the list
            } else {
              Alert.alert('Error', result.error || 'Failed to cancel appointment.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Loading appointments...</Text>
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Calendar size={48} color="#9CA3AF" className="mb-4" />
        <Text className="text-xl font-semibold text-gray-800 mb-2">
          No Appointments
        </Text>
        <Text className="text-gray-600 text-center">
          You haven't booked any appointments yet. Book your first appointment to get started.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">
            My Appointments
          </Text>
          <View className="bg-gray-100 rounded-full px-3 py-1">
            <Text className="text-sm font-medium text-gray-600">
              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        {appointments.map((appointment) => (
          <View key={appointment.id} className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            {/* Header with Status */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  <Text className="text-sm font-semibold text-gray-800">
                    Appointment #{appointment.id.slice(0, 8)}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">
                  Booked on {formatDate(appointment.created_at)}
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-full ${getStatusColor(appointment.status)}`}>
                <Text className="text-xs font-semibold">
                  {getStatusText(appointment.status)}
                </Text>
              </View>
            </View>

            {/* Appointment Details */}
            <View className="bg-gray-100 rounded-lg p-3 mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-3 border border-gray-100">
                    <Calendar size={16} color="#3B82F6" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500 font-medium">Date</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {formatDate(appointment.appointment_date)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-8 h-8 items-center justify-center mr-3 bg-green-100 rounded-lg border border-green-100 ">
                    <Clock size={16} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-xs text-gray-500 font-medium">Time</Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {formatTime(appointment.appointment_time)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* User Details */}
            <View className="bg-gray-50 rounded-lg p-3 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center mr-2">
                  <User size={12} color="#6B7280" />
                </View>
                <Text className="text-sm font-semibold text-gray-800">Patient Details</Text>
              </View>
              
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 font-medium">Name:</Text>
                  <Text className="text-sm font-semibold text-gray-800 ml-2">{appointment.user_name || 'N/A'}</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 font-medium">Phone:</Text>
                  <Text className="text-sm font-semibold text-gray-800 ml-2">{appointment.user_phone || 'N/A'}</Text>
                </View>
                
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-600 font-medium">Email:</Text>
                  <Text className="text-sm font-semibold text-gray-800 ml-2">{appointment.user_email || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Notes */}
            {appointment.notes && (
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-5 h-5 bg-yellow-100 rounded items-center justify-center mr-2">
                    <Text className="text-yellow-600 text-xs font-bold">📝</Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-800">Additional Notes</Text>
                </View>
                <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <Text className="text-gray-700 text-sm leading-5">
                    {appointment.notes}
                  </Text>
                </View>
              </View>
            )}

            {/* Actions */}
            {appointment.status === 'pending' && (
              <TouchableOpacity
                onPress={() => handleCancelAppointment(appointment.id)}
                className="flex-row items-center justify-center bg-red-50 border border-red-200 rounded-lg py-3"
                activeOpacity={0.7}
              >
                <View className="w-5 h-5 bg-red-100 rounded items-center justify-center mr-2">
                  <Trash2 size={12} color="#DC2626" />
                </View>
                <Text className="text-red-600 font-semibold text-sm">Cancel Appointment</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
