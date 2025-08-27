import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import Svg, { Path, G } from 'react-native-svg';

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

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const handleTabPress = (route: string) => {
    router.push(route);
  };

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
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>

      {/* Custom Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 mx-4 mb-6">
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
              onPress={() => handleTabPress('/(tabs)/appointment')}
            >
              <ProgressIcon size={24} color={isActive('/(tabs)/appointment') ? '#7C3AED' : 'rgba(0, 0, 0, 0.4)'} />
              <Text className={`text-xs font-semibold mt-2 ${isActive('/(tabs)/appointment') ? 'text-purple-600' : 'text-gray-500'}`}>
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
    </View>
  );
}
