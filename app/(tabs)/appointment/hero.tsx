import React from 'react';
import { View, Text, Image } from 'react-native';
import { Briefcase, Star, Users } from 'lucide-react-native';

export default function AppointmentHero() {
  return (
    <View className="px-6 py-4">
      {/* Doctor Profile Card */}
      <View className="bg-white rounded-2xl shadow-lg shadow-gray-200 p-6">
        {/* Online Status Badge */}
        <View className="absolute top-4 left-4 bg-green-50 rounded-lg px-3 py-1 flex-row items-center">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          <Text className="text-green-700 text-sm font-medium">Online</Text>
        </View>

        {/* Profile Picture */}
        <View className="items-center mb-4">
          <View className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-1">
            <View className="w-full h-full rounded-full bg-white overflow-hidden">
              <Image
                source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/doctor.jpeg' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Doctor Name and Specialization */}
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">
          Dr. Ashok Seth
          </Text>
          <Text className="text-base text-gray-600">
          Kayachikitsa Vaidya
          </Text>
        </View>

        {/* Key Metrics */}
        <View className="flex-row justify-around">
          {/* Experience */}
          <View className="items-center">
            <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mb-2">
              <Briefcase size={20} color="#6B7280" />
            </View>
            <Text className="text-lg font-bold text-gray-800">12 years</Text>
            <Text className="text-sm text-gray-500">Experience</Text>
          </View>

          {/* Rating */}
          <View className="items-center">
            <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mb-2">
              <Star size={20} color="#6B7280" />
            </View>
            <Text className="text-lg font-bold text-gray-800">4.2</Text>
            <Text className="text-sm text-gray-500">Rating</Text>
          </View>

          {/* Patients */}
          <View className="items-center">
            <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mb-2">
              <Users size={20} color="#6B7280" />
            </View>
            <Text className="text-lg font-bold text-gray-800">1500+</Text>
            <Text className="text-sm text-gray-500">Patients</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
