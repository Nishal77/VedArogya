import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut 
} from 'lucide-react-native';
import { useAuth } from '../../../utils/AuthContext';
import { useRouter } from 'expo-router';

export default function OptionList() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.push('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuOptions = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update personal information & photo',
      icon: Heart,
      onPress: () => console.log('Edit Profile pressed'),
    },
    {
      id: 'health-records',
      title: 'Health Records',
      subtitle: 'View your medical history & reports',
      icon: FileText,
      onPress: () => console.log('Health Records pressed'),
    },
    {
      id: 'appointments',
      title: 'My Appointments',
      subtitle: 'Manage upcoming & past consultations',
      icon: Calendar,
      onPress: () => console.log('Appointments pressed'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Appointment & health reminders',
      icon: Bell,
      onPress: () => console.log('Notifications pressed'),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences & privacy',
      icon: Settings,
      onPress: () => console.log('Settings pressed'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQ, contact & troubleshooting',
      icon: HelpCircle,
      onPress: () => console.log('Help pressed'),
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: LogOut,
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8 }}
    >
      <View className="bg-white rounded-2xl  overflow-hidden">
        {menuOptions.map((option, index) => (
          <View key={option.id}>
            <TouchableOpacity
              className="flex-row items-center px-6 py-4 active:bg-gray-50"
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View className="w-6 h-6 items-center justify-center mr-4">
                <option.icon 
                  size={20} 
                  color={option.isDestructive ? '#EF4444' : '#374151'} 
                  strokeWidth={2}
                />
              </View>

              {/* Title and Subtitle */}
              <View className="flex-1 mr-3">
                <Text className={`text-base font-semibold ${
                  option.isDestructive ? 'text-red-500' : 'text-gray-900'
                }`}>
                  {option.title}
                </Text>
                <Text className={`text-sm ${
                  option.isDestructive ? 'text-red-400' : 'text-gray-500'
                }`}>
                  {option.subtitle}
                </Text>
              </View>

              {/* Arrow indicator (except for logout) */}
              {!option.isDestructive && (
                <View className="w-6 h-6 items-center justify-center">
                  <Text className="text-gray-400 text-lg">›</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Separator line (except for last item) */}
            {index < menuOptions.length - 1 && (
              <View className="h-px bg-gray-100 mx-6" />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
