import { View, Text, TouchableOpacity, Platform, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useFonts } from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import NotificationIcon from './NotificationIcon'

export default function Header() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const insets = useSafeAreaInsets()
  const [profileImageUrl, setProfileImageUrl] = useState('')

  // Load Satoshi font
  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  // Generate random profile image on mount
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 70) + 1
    setProfileImageUrl(`https://i.pravatar.cc/150?img=${randomId}`)
  }, [])

  // Theme colors
  const backgroundColor = '#F5F3EE'
  const textColor = '#111827'
  const secondaryTextColor = '#6B7280'

  // Get current date
  const currentDate = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }
  const formattedDate = currentDate.toLocaleDateString('en-US', options)

  return (
    <View
      className="min-h-[48px]"
      style={{
        backgroundColor,
        paddingTop: Platform.OS === 'ios' ? insets.top + 12 : 16,
      }}
    >
      {/* Lime gradient background with smooth mask */}
      <LinearGradient
        colors={[
          '#84cc16',
          '#84cc16',
          'rgba(132, 204, 22, 0.7)',
          'rgba(132, 204, 22, 0.3)',
          'rgba(132, 204, 22, 0.1)',
          'rgba(132, 204, 22, 0)',
        ]}
        locations={[0, 0.15, 0.35, 0.55, 0.7, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? insets.top + 80 : 80,
        }}
      />
      <View className="flex-row items-center justify-between px-6 pb-4">
        {/* Left Section - Profile Picture */}
        <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white">
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={24} color={secondaryTextColor} />
          )}
        </View>

        {/* Center Section - Greeting Text */}
        <View className="flex-1 items-center justify-center px-3">
          <Text
            className="text-center text-xl font-medium"
            style={{
              fontFamily: fontsLoaded ? 'Satoshi-Medium' : undefined,
              fontWeight: '500',
              color: textColor,
              letterSpacing: -0.4,
              lineHeight: 26,
            }}
          >
            Hello, Sandra
          </Text>
          <Text
            className="text-center text-sm"
            style={{
              fontFamily: fontsLoaded ? 'Satoshi-Medium' : undefined,
              fontWeight: '400',
              color: secondaryTextColor,
              letterSpacing: 0.1,
              lineHeight: 20,
            }}
          >
            {formattedDate}
          </Text>
        </View>

        {/* Right Section - Notification Icon */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-12 w-12 items-center justify-center rounded-full bg-white"
        >
          <NotificationIcon size={18} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
