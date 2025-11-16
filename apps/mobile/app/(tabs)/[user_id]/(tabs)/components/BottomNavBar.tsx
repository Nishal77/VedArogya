import { View, TouchableOpacity, Text, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'

interface TabItem {
  name: string
  route: string
  icon: keyof typeof Ionicons.glyphMap
  label: string
  isCenter?: boolean
}

const tabs: TabItem[] = [
  { name: 'heart', route: '/heart', icon: 'heart-outline', label: 'Health' },
  { name: 'monitor', route: '/monitor', icon: 'tv-outline', label: 'Learn' },
  { name: 'plus', route: '/plus', icon: 'add', label: 'Create', isCenter: true },
  { name: 'video', route: '/video', icon: 'play-circle-outline', label: 'Videos' },
  { name: 'profile', route: '/profile', icon: 'person-outline', label: 'Profile' },
]

export default function BottomNavBar() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const pathname = usePathname()

  const getActiveTab = () => {
    if (pathname?.includes('/heart')) return 'heart'
    if (pathname?.includes('/monitor')) return 'monitor'
    if (pathname?.includes('/plus')) return 'plus'
    if (pathname?.includes('/video')) return 'video'
    if (pathname?.includes('/profile')) return 'profile'
    return 'index'
  }

  const activeTab = getActiveTab()

  const handlePress = (tab: TabItem) => {
    // Extract user_id from current pathname
    const userMatch = pathname?.match(/\/([^/]+)\/\(tabs\)/)
    const userPath = userMatch ? userMatch[1] : 'user123'

    if (tab.isCenter) {
      router.push(`/(tabs)/${userPath}/(tabs)/plus`)
    } else {
      router.push(`/(tabs)/${userPath}/(tabs)/${tab.name}`)
    }
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom,
        paddingTop: 12,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#1F2937',
          borderRadius: 28,
          paddingHorizontal: 8,
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'space-around',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 20,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        {tabs.map((tab, index) => {
          const isActive =
            activeTab === tab.name || (activeTab === 'index' && tab.name === 'heart')
          const isCenter = tab.isCenter

          if (isCenter) {
            return (
              <TouchableOpacity
                key={tab.name}
                activeOpacity={0.8}
                onPress={() => handlePress(tab)}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#8B5CF6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -24,
                  shadowColor: '#8B5CF6',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 12,
                  borderWidth: 3,
                  borderColor: '#1F2937',
                }}
              >
                <Ionicons name={tab.icon} size={28} color="#FFFFFF" />
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity
              key={tab.name}
              activeOpacity={0.7}
              onPress={() => handlePress(tab)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
              }}
            >
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive ? '#FFFFFF' : '#9CA3AF'}
              />
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 4,
                  color: isActive ? '#FFFFFF' : '#9CA3AF',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
