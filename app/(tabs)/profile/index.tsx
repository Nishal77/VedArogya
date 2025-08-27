import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../utils/AuthContext';
import { Settings, LogOut, Heart } from 'lucide-react-native';
import ProfileIcon from '../../../components/ProfileIcon';
import { BlurView } from 'expo-blur';

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
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Top Spacing to prevent status bar overlap */}
        <View className="h-4" />
        
        {/* Profile Header */}
        <View className="items-center py-8">
          <ProfileIcon size={80} color="#6B7280" />
          <Text className="text-2xl font-bold text-gray-800 mt-4 mb-2">
            {user?.user_metadata?.full_name || 'User'}
          </Text>
          <Text className="text-gray-600 text-lg">
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        {/* User Info Card */}
        {user && (
          <View className="bg-gray-50 rounded-xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <ProfileIcon size={20} color="#6B7280" />
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
      <View className="absolute bottom-16 left-0 right-0 h-1 z-40">
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
