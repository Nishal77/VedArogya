import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Brain } from 'lucide-react-native';
import HomeIcon from '../../components/HomeIcon';
import CalendarIcon from '../../components/CalendarIcon';
import AIIcon from '../../components/AIIcon';
import RoutineIcon from '../../components/RoutineIcon';
import ProfileIcon from '../../components/ProfileIcon';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { route: '/(tabs)/home', icon: HomeIcon, label: 'Home' },
    { route: '/(tabs)/appointment', icon: CalendarIcon, label: 'Analytics' },
    { route: '/(tabs)/ai', icon: AIIcon, label: 'AI' },
    { route: '/(tabs)/routine', icon: RoutineIcon, label: 'Chat' },
    { route: '/(tabs)/profile', icon: ProfileIcon, label: 'Profile' }
  ];

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const handleTabPress = (route: string) => {
    router.push(route);
  };

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      >
        <Tabs.Screen name="home" options={{ title: '' }} />
        <Tabs.Screen name="appointment" options={{ title: '' }} />
        <Tabs.Screen name="ai" options={{ title: '' }} />
        <Tabs.Screen name="routine" options={{ title: '' }} />
        <Tabs.Screen name="profile" options={{ title: '' }} />
      </Tabs>

      {/* Custom Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-50">
        <View className="bg-white rounded-t-3xl shadow-2xl shadow-black/25 border-t border-gray-100 px-6 py-6">
          <View className="flex-row items-center justify-between">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              const isTabActive = isActive(tab.route);
              
              if (index === 2) {
                // Central AI Action Button
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleTabPress(tab.route)}
                    className="items-center -mt-8"
                  >
                    <View className="w-16 h-16 bg-[#F4B400] rounded-full items-center justify-center shadow-lg border border-black">
                      <Brain size={24} color="white" />
                    </View>
                    <Text className="text-black text-xs font-medium mt-2">
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleTabPress(tab.route)}
                  className="items-center flex-1"
                >
                  <IconComponent 
                    size={24} 
                    color={isTabActive ? "#000000" : "#6B7280"} 
                  />
                  <Text className={`text-xs font-medium mt-1 ${
                    isTabActive ? 'text-black' : 'text-gray-500'
                  }`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
