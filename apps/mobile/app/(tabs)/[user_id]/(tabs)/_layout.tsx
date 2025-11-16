import { Tabs } from 'expo-router'
import { View, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePathname, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Circle } from 'react-native-svg'

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

// Custom Activity Icon Component
function ActivityIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}

// Custom Achievements Icon Component
function AchievementsIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="m9.8997,15.1642c4.9614-.879,6.1773-8.293,3.3653-13.4142-1.709,3.571-5.652,3.034-7.858,5.754-.654.806-1.158,1.901-1.158,3.082,0,1.577.779,2.972,1.972,3.816"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m2.75,16.25s4.598-1.265,7.5-6.5"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

// Custom Bubbles Icon Component
function BubblesIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.2 14.8a2 2 0 0 1 2 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx="18.5"
        cy="8.5"
        r="3.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle
        cx="7.5"
        cy="16.5"
        r="5.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle
        cx="7.5"
        cy="4.5"
        r="2.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}

// Custom Profile Icon Component
function ProfileIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle
        cx="9"
        cy="4.5"
        r="2.75"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.762,15.516c.86-.271,1.312-1.221,.947-2.045-.97-2.191-3.159-3.721-5.709-3.721s-4.739,1.53-5.709,3.721c-.365,.825,.087,1.774,.947,2.045,1.225,.386,2.846,.734,4.762,.734s3.537-.348,4.762-.734Z"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      name: 'home',
      route: 'home',
      isHome: true,
    },
    {
      name: 'analytics',
      route: 'analytics',
    },
    {
      name: 'guidance',
      route: 'guidance',
    },
    {
      name: 'chat',
      route: 'chat',
    },
    {
      name: 'profile',
      route: 'profile',
    },
  ]

  const getActiveTab = () => {
    if (
      pathname?.endsWith('/home') ||
      pathname?.endsWith('/') ||
      (!pathname?.includes('/analytics') &&
        !pathname?.includes('/guidance') &&
        !pathname?.includes('/chat') &&
        !pathname?.includes('/profile'))
    ) {
      return 'home'
    }
    if (pathname?.includes('/analytics')) return 'analytics'
    if (pathname?.includes('/guidance')) return 'guidance'
    if (pathname?.includes('/chat')) return 'chat'
    if (pathname?.includes('/profile')) return 'profile'
    return 'home'
  }

  const activeTab = getActiveTab()

  const handlePress = (tab: (typeof tabs)[0]) => {
    // Extract user_id from pathname like /(tabs)/user123/(tabs)/home
    const match = pathname?.match(/\(tabs\)\/([^/]+)\/\(tabs\)/)
    const userId = match ? match[1] : 'user123'

    router.push(`/(tabs)/${userId}/(tabs)/${tab.route}`)
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
          '#F7F3EC',
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
          marginBottom: 0,
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
          paddingTop: 20,
          paddingHorizontal: 20,
          backgroundColor: '#F7F3EC',
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
              activeTab === tab.route || (activeTab === 'home' && tab.isHome)
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
                {tab.name === 'home' ? (
                  <HomeIcon color={iconColor} size={26} />
                ) : tab.name === 'analytics' ? (
                  <ActivityIcon color={iconColor} size={26} />
                ) : tab.name === 'guidance' ? (
                  <AchievementsIcon color={iconColor} size={26} />
                ) : tab.name === 'chat' ? (
                  <BubblesIcon color={iconColor} size={26} />
                ) : tab.name === 'profile' ? (
                  <ProfileIcon color={iconColor} size={26} />
                ) : null}
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
        <Tabs.Screen name="home" />
        <Tabs.Screen name="analytics" />
        <Tabs.Screen name="guidance" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <CustomTabBar />
    </>
  )
}
