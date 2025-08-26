import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ArrowUpRight, Star } from 'lucide-react-native';

export default function Appointment() {
  return (
    <View className="px-6 pb-4">
      {/* Header Section */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-gray-900">
          My Appointments
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-600 text-base font-medium">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointment Card */}
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <View className="flex-row items-start">
          {/* Doctor Profile Picture */}
          <View className="relative mr-4">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face' }}
              className="w-16 h-16 rounded-xl"
              defaultSource={require('../../../assets/images/ayurvedic.png')}
            />
            <View className="absolute -bottom-1 -right-1 bg-orange-400 rounded-full p-1 border-2 border-white">
              <Star size={12} color="white" fill="white" />
            </View>
          </View>

          {/* Appointment Details */}
          <View className="flex-1">
            <Text className="text-gray-500 text-sm mb-1">
              May 15 2025
            </Text>
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Dr. Nathan Hale
            </Text>
            <Text className="text-gray-500 text-sm">
              Cardiologist - 12 Yrs Exp
            </Text>
          </View>

          {/* Time and Navigation */}
          <View className="items-end">
            <View className="bg-gray-100 rounded-lg px-3 py-1 mb-2">
              <Text className="text-gray-700 text-sm font-medium">
                03:30 am
              </Text>
            </View>
            <TouchableOpacity className="bg-gray-100 rounded-full p-2">
              <ArrowUpRight size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
