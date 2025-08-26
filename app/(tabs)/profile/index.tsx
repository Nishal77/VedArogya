import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../utils/AuthContext';
import { User, Settings, LogOut, Heart } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5">
        <View className="py-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4">
              <User size={32} color="#F4B400" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">Profile</Text>
            <Text className="text-gray-600 text-center">Your wellness profile</Text>
          </View>

          {/* User Info Card */}
          {user && (
            <View className="bg-gray-50 rounded-xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <User size={20} color="#6B7280" />
                <Text className="text-gray-500 ml-2 font-medium">Account Info</Text>
              </View>
              <Text className="text-sm text-gray-500 mb-1">Email</Text>
              <Text className="text-base font-medium text-gray-900 mb-4">
                {user.email}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">User ID</Text>
              <Text className="text-sm text-gray-700 font-mono">
                {user.id}
              </Text>
            </View>
          )}

          {/* Profile Options */}
          <View className="space-y-3 mb-6">
            <TouchableOpacity className="bg-white border border-gray-200 rounded-xl p-4 flex-row items-center">
              <Settings size={20} color="#6B7280" />
              <Text className="text-gray-900 font-medium ml-3 flex-1">Settings</Text>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-gray-200 rounded-xl p-4 flex-row items-center">
              <Heart size={20} color="#6B7280" />
              <Text className="text-gray-900 font-medium ml-3 flex-1">Wellness Data</Text>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity 
            className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
