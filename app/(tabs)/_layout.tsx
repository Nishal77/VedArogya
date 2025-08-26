import { Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import HomeIcon from '../../components/HomeIcon';
import CalendarIcon from '../../components/CalendarIcon';
import AIIcon from '../../components/AIIcon';
import RoutineIcon from '../../components/RoutineIcon';
import ProfileIcon from '../../components/ProfileIcon';
import { useRouter, usePathname } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'home',
      icon: HomeIcon,
      route: '/(tabs)/home',
    },
    {
      name: 'appointment',
      icon: CalendarIcon,
      route: '/(tabs)/appointment',
    },
    {
      name: 'ai',
      icon: AIIcon,
      route: '/(tabs)/ai',
    },
    {
      name: 'routine',
      icon: RoutineIcon,
      route: '/(tabs)/routine',
    },
    {
      name: 'profile',
      icon: ProfileIcon,
      route: '/(tabs)/profile',
    },
  ];

  const isActive = (route: string) => {
    // Check if the current pathname matches the tab route
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
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}>
        <Tabs.Screen 
          name="home" 
          options={{ title: '' }}
        />
        <Tabs.Screen 
          name="appointment" 
          options={{ title: '' }}
        />
        <Tabs.Screen 
          name="ai" 
          options={{ title: '' }}
        />
        <Tabs.Screen 
          name="routine" 
          options={{ title: '' }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{ title: '' }}
        />
      </Tabs>
      
      {/* Custom Bottom Navigation */}
      <View className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <View className="bg-white rounded-full shadow-2xl shadow-black/25 border border-gray-100 px-8 py-3 min-w-[320px]">
          <View className="flex-row items-center justify-between">
            {tabs.map((tab) => {
              const isTabActive = isActive(tab.route);
              const IconComponent = tab.icon;
              
              return (
                <TouchableOpacity
                  key={tab.name}
                  className={`items-center justify-center p-3 rounded-full transition-all duration-300 ${
                    isTabActive ? 'bg-blue-500 shadow-lg scale-105' : 'hover:bg-gray-50'
                  }`}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.8}
                >
                  <IconComponent 
                    size={22} 
                    color={isTabActive ? '#FFFFFF' : '#9CA3AF'} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
