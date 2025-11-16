import { View, Text, TouchableOpacity, Platform, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { useFonts } from 'expo-font'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import NotificationIcon from './NotificationIcon'

interface HeaderProps {
  scrollY?: any // Keep for compatibility but don't use
}

export default function Header({ scrollY }: HeaderProps = {}) {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const insets = useSafeAreaInsets()
  const [profileImageUrl, setProfileImageUrl] = useState('')
  
  // Reduced blur intensity for transparency
  const blurIntensity = Platform.OS === 'ios' ? 18 : 12

  // Load Satoshi font
  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  // Generate random profile image on mount
  useEffect(() => {
    const randomId = Math.floor(Math.random() * 70) + 1
    setProfileImageUrl(`https://i.pravatar.cc/150?img=${randomId}`)
  }, [])

  // Theme colors - darker text for better contrast
  const backgroundColor = '#F5F3EE'
  const textColor = '#11181C' // Slightly darker for better contrast
  const secondaryTextColor = '#6B7280'

  // Get current date
  const currentDate = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }
  const formattedDate = currentDate.toLocaleDateString('en-US', options)

  // Static header height - no scroll-based changes
  const headerHeight = Platform.OS === 'ios' ? insets.top + 80 : 80
  
  // Static values - no animations
  const paddingTop = Platform.OS === 'ios' ? insets.top + 12 : 16
  const paddingBottom = 16
  // Reduced gradient opacity by 12% (from 0.85 to 0.75)
  const gradientOpacity = 0.75
  const shadowOpacity = 0
  
  // Generate grain pattern data once
  const [grainPattern] = useState(() => {
    return Array.from({ length: 150 }, () => ({
      opacity: Math.random() * 0.3 + 0.1,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
  })

  return (
    <View
      style={{
        backgroundColor,
        paddingTop,
        overflow: 'hidden',
        height: headerHeight,
        position: 'relative',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: shadowOpacity,
        shadowRadius: 8,
        elevation: 0,
      }}
    >
      {/* Blur Background - Static intensity */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
        }}
      >
        <BlurView
          intensity={blurIntensity}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </View>

      {/* Gradient Overlay - Static opacity */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          opacity: gradientOpacity,
        }}
      >
        <LinearGradient
          colors={[
            'rgba(224, 208, 182, 0.77)', // Reduced by ~12%
            'rgba(224, 208, 182, 0.68)', // Reduced by ~12%
            'rgba(224, 208, 182, 0.57)', // Reduced by ~12%
            'rgba(224, 208, 182, 0.40)', // Reduced by ~12%
            'rgba(224, 208, 182, 0.22)', // Reduced by ~12%
            'rgba(224, 208, 182, 0)',
          ]}
          locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </View>

      {/* Soft Grain Texture Overlay - Subtle noise effect at 0.3% opacity */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          backgroundColor: 'transparent',
          opacity: 0.003,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Grain pattern using positioned dots */}
        {grainPattern.map((dot, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: 1.5,
              height: 1.5,
              backgroundColor: '#000',
              opacity: dot.opacity,
            }}
          />
        ))}
      </View>

      {/* Content Container */}
      <View 
        className="flex-row items-center justify-between px-6" 
        style={{ 
          position: 'relative', 
          zIndex: 1,
          paddingBottom,
        }}
      >
        {/* Left Section - Profile Picture */}
        <View 
          className="h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
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

        {/* Center Section - Greeting Text with Mandala Glow */}
        <View className="flex-1 items-center justify-center px-3" style={{ position: 'relative' }}>
          {/* Mandala Glow Behind Text */}
          <View
            style={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(224, 208, 182, 0.15)',
              opacity: 0.4,
              zIndex: 0,
            }}
          />
          <Text
            className="text-center text-xl font-medium"
            style={{
              fontFamily: fontsLoaded ? 'Satoshi-Medium' : undefined,
              fontWeight: '500',
              color: textColor,
              letterSpacing: -0.4,
              lineHeight: 26,
              position: 'relative',
              zIndex: 1,
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
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-12 w-12 items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.12,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <NotificationIcon size={18} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
