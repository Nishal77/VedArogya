import { Tabs } from 'expo-router'
import { View, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path } from 'react-native-svg'

// Custom Home Icon Component
function HomeIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path
        d="M9 16V12.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M3.145 5.95L8.395 1.96C8.753 1.688 9.248 1.688 9.605 1.96L14.855 5.95C15.104 6.139 15.25 6.434 15.25 6.746V14.25C15.25 15.355 14.355 16.25 13.25 16.25H4.75C3.645 16.25 2.75 15.355 2.75 14.25V6.746C2.75 6.433 2.896 6.139 3.145 5.95Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}

function CustomTabBar() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      name: 'index',
      route: 'index',
      icon: 'home',
      iconOutline: 'home-outline',
      label: 'Home',
      isHome: true,
    },
    {
      name: 'monitor',
      route: 'monitor',
      icon: 'leaf',
      iconOutline: 'leaf-outline',
      label: 'Wellness',
    },
    {
      name: 'plus',
      route: 'plus',
      icon: 'trophy',
      iconOutline: 'trophy-outline',
      label: 'Achievements',
    },
    {
      name: 'video',
      route: 'video',
      icon: 'musical-notes',
      iconOutline: 'musical-notes-outline',
      label: 'Music',
    },
    {
      name: 'profile',
      route: 'profile',
      icon: 'list',
      iconOutline: 'list-outline',
      label: 'More',
    },
  ]

  const getActiveTab = () => {
    if (
      pathname?.endsWith('/index') ||
      pathname?.endsWith('/') ||
      (!pathname?.includes('/monitor') &&
        !pathname?.includes('/plus') &&
        !pathname?.includes('/video') &&
        !pathname?.includes('/profile'))
    ) {
      return 'index'
    }
    if (pathname?.includes('/monitor')) return 'monitor'
    if (pathname?.includes('/plus')) return 'plus'
    if (pathname?.includes('/video')) return 'video'
    if (pathname?.includes('/profile')) return 'profile'
    return 'index'
  }

  const activeTab = getActiveTab()

  const handlePress = (tab: (typeof tabs)[0]) => {
    // Extract user_id from pathname like /(tabs)/user123/(tabs)/index
    const match = pathname?.match(/\(tabs\)\/([^/]+)\/\(tabs\)/)
    const userId = match ? match[1] : 'user123'

    if (tab.route === 'index') {
      router.push(`/(tabs)/${userId}/(tabs)/`)
    } else {
      router.push(`/(tabs)/${userId}/(tabs)/${tab.route}`)
    }
  }

  const navbarHeight = 60 + insets.bottom
  const maskHeight = 90 // Increased for more pronounced fade

  return (
    <>
      {/* Premium Content Fade Mask Above Navbar */}
      <LinearGradient
        colors={[
          'rgba(245, 243, 238, 0)',
          'rgba(245, 243, 238, 0.2)',
          'rgba(245, 243, 238, 0.5)',
          'rgba(245, 243, 238, 0.8)',
          '#F5F3EE',
        ]}
        locations={[0, 0.3, 0.6, 0.85, 1]}
        style={{
          position: 'absolute',
          bottom: navbarHeight,
          left: 0,
          right: 0,
          height: maskHeight,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Navigation Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom,
          paddingTop: 16,
          paddingHorizontal: 20,
          backgroundColor: '#FAF9F6',
          zIndex: 2,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          {tabs.map((tab) => {
            const isActive =
              activeTab === tab.route || (activeTab === 'index' && tab.isHome)
            const iconColor = isActive ? '#111827' : '#9CA3AF'

            return (
              <TouchableOpacity
                key={tab.name}
                activeOpacity={0.7}
                onPress={() => handlePress(tab)}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                {tab.name === 'index' ? (
                  <HomeIcon color={iconColor} size={26} />
                ) : (
                  <Ionicons
                    name={isActive ? (tab.icon as any) : (tab.iconOutline as any)}
                    size={26}
                    color={iconColor}
                  />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </>
  )
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="heart"
          options={{
            title: 'Health',
          }}
        />
        <Tabs.Screen
          name="monitor"
          options={{
            title: 'Learn',
          }}
        />
        <Tabs.Screen
          name="plus"
          options={{
            title: 'Create',
          }}
        />
        <Tabs.Screen
          name="video"
          options={{
            title: 'Videos',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
      <CustomTabBar />
    </>
  )
}
