import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import Svg, { Path, G } from 'react-native-svg';
import { useAppointment } from '../../utils/AppointmentContext';

// Custom Home Icon Component using the home button image
const HomeIcon = ({ size = 24, color = '#000000' }) => (
  <Image 
    source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/home-button.png' }}
    style={{ 
      width: size, 
      height: size,
      tintColor: color 
    }}
    resizeMode="contain"
  />
);

// Custom Routine Icon Component using the checklist image
const RoutineIcon = ({ size = 24, color = '#000000' }) => (
  <Image 
    source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/checklist.png' }}
    style={{ 
      width: size, 
      height: size,
      tintColor: color 
    }}
    resizeMode="contain"
  />
);

// Custom Bot Icon Component using the bot image
const BotIcon = ({ size = 24, color = '#000000' }) => (
  <Image 
    source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/bot.png' }}
    style={{ 
      width: size, 
      height: size,
      tintColor: color 
    }}
    resizeMode="contain"
  />
);

// Custom Progress Icon Component using the bar chart image
const ProgressIcon = ({ size = 24, color = '#000000' }) => (
  <Image 
    source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/bar-chart.png' }}
    style={{ 
      width: size, 
      height: size,
      tintColor: color 
    }}
    resizeMode="contain"
  />
);

// Custom User Icon Component using the user image
const UserIcon = ({ size = 24, color = '#000000' }) => (
  <Image 
    source={{ uri: 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/user.png' }}
    style={{ 
      width: size, 
      height: size,
      tintColor: color 
    }}
    resizeMode="contain"
  />
);

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { isBooking, handleBookAppointment } = useAppointment();

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const handleTabPress = (route: string) => {
    router.push(route);
  };

  // Check if we're on specific screens to hide bottom navigation
  const isOnAIScreen = pathname === '/(tabs)/ai' || 
                       pathname.includes('/ai') || 
                       pathname.endsWith('/ai') ||
                       pathname === '/ai';
  
  const isOnRoutineScreen = pathname === '/(tabs)/routine' || 
                            pathname.includes('/routine') || 
                            pathname.endsWith('/routine') ||
                            pathname === '/routine';

  const isOnAppointmentScreen = pathname === '/(tabs)/appointment' || 
                                pathname.includes('/appointment') || 
                                pathname.endsWith('/appointment') ||
                                pathname === '/appointment';
  
  const shouldHideNavbar = isOnAIScreen || isOnRoutineScreen || isOnAppointmentScreen;
  
  // Debug: Log the current pathname to understand the routing
  console.log('Current pathname:', pathname);
  console.log('Is on AI screen:', isOnAIScreen);
  console.log('Is on Routine screen:', isOnRoutineScreen);
  console.log('Is on Appointment screen:', isOnAppointmentScreen);
  console.log('Navigation bar should be visible:', !shouldHideNavbar);

  return (
    <View className="flex-1 bg-white">
      {/* Main Content Area */}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="home" />
          <Tabs.Screen name="appointment" />
          <Tabs.Screen name="ai" />
          <Tabs.Screen name="routine" />
          <Tabs.Screen name="progress" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>

      {/* Custom Bottom Navigation Bar - Hidden on specific screens */}
      {!shouldHideNavbar && (
        <View className="absolute bottom-0 left-0 right-0 mx-4 mb-6 z-50">
          <View className="bg-white rounded-full shadow-2xl shadow-black/30 py-4 px-6">
            <View className="flex-row items-center justify-around">
              {/* Home Tab */}
              <TouchableOpacity 
                className="items-center"
                activeOpacity={0.7}
                onPress={() => handleTabPress('/(tabs)/home')}
              >
                <HomeIcon size={24} color={isActive('/(tabs)/home') ? '#7C3AED' : 'rgba(0, 0, 0, 0.4)'} />
                <Text className={`text-xs font-semibold mt-2 ${isActive('/(tabs)/home') ? 'text-purple-600' : 'text-gray-500'}`}>
                  Home
                </Text>
              </TouchableOpacity>

              {/* Routine Tab */}
              <TouchableOpacity 
                className="items-center"
                activeOpacity={0.7}
                onPress={() => handleTabPress('/(tabs)/routine')}
              >
                <RoutineIcon size={24} color={isActive('/(tabs)/routine') ? '#7C3AED' : 'rgba(0, 0, 0, 0.4)'} />
                <Text className={`text-xs font-semibold mt-2 ${isActive('/(tabs)/routine') ? 'text-purple-600' : 'text-gray-500'}`}>
                  Routine
                </Text>
              </TouchableOpacity>

              {/* Central AI Button */}
              <TouchableOpacity 
                className="w-14 h-14 bg-[#F4B400] rounded-full items-center justify-center shadow-lg shadow-[#F4B400]-600/40 "
                activeOpacity={0.5}
                onPress={() => handleTabPress('/(tabs)/ai')}
              >
                <BotIcon size={26} color="black" />
              </TouchableOpacity>

              {/* Progress Tab */}
              <TouchableOpacity 
                className="items-center"
                activeOpacity={0.7}
                onPress={() => handleTabPress('/(tabs)/progress')}
              >
                <ProgressIcon size={24} color={isActive('/(tabs)/progress') ? '#7C3AED' : 'rgba(0, 0, 0, 0.4)'} />
                <Text className={`text-xs font-semibold mt-2 ${isActive('/(tabs)/progress') ? 'text-purple-600' : 'text-gray-500'}`}>
                  Progress
                </Text>
              </TouchableOpacity>

              {/* Profile Tab */}
              <TouchableOpacity 
                className="items-center"
                activeOpacity={0.7}
                onPress={() => handleTabPress('/(tabs)/profile')}
              >
                <UserIcon size={24} color={isActive('/(tabs)/profile') ? '#7C3AED' : 'rgba(0, 0, 0, 0.4)'} />
                <Text className={`text-xs font-semibold mt-2 ${isActive('/(tabs)/profile') ? 'text-purple-600' : 'text-gray-500'}`}>
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Book Appointment Button - Shown only on appointment screen */}
      {isOnAppointmentScreen && (
        <View className="absolute bottom-0 left-0 right-0 mx-4 mb-6 z-50">
          <TouchableOpacity 
            className={`rounded-full py-4 px-8 mb-3 ${
              isBooking ? 'bg-gray-300' : 'bg-[#F4B400]'
            }`}
            activeOpacity={0.8}
            disabled={isBooking}
            onPress={() => {
              // Get the current appointment data from the appointment screen
              const appointmentData = (global as any).appointmentData;
              if (appointmentData) {
                handleBookAppointment(appointmentData.selectedDate, appointmentData.selectedTime, appointmentData.notes);
              } else {
                console.log('No appointment data available');
              }
            }}
          >
            {isBooking ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#000" className="mr-2" />
                <Text className="text-black text-lg font-bold text-center">
                  Booking...
                </Text>
              </View>
            ) : (
              <Text className="text-black text-lg font-bold text-center">
                Book Appointment
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
