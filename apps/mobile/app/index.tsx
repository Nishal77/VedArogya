import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'
import Svg, { Path } from 'react-native-svg'

const { width, height } = Dimensions.get('window')
const imageHeight = height * 0.6

export default function GetStartedScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const handleGetStarted = () => {
    router.push('/info1')
  }

  // Dynamic colors based on theme
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#D1D5DB' : '#4B5563'
  const svgStrokeColor = isDark ? '#FFFFFF' : '#111827'
  const progressDotColor = isDark ? '#4B5563' : '#D1D5DB'

  // Gradient colors for dark mode
  const gradientColors: string[] = isDark
    ? [
        'rgba(0, 0, 0, 0)',
        'rgba(0, 0, 0, 0.15)',
        'rgba(0, 0, 0, 0.4)',
        'rgba(0, 0, 0, 0.7)',
        'rgba(0, 0, 0, 0.9)',
        'rgba(0, 0, 0, 1)',
      ]
    : [
        'rgba(255, 255, 255, 0)',
        'rgba(255, 255, 255, 0.15)',
        'rgba(255, 255, 255, 0.4)',
        'rgba(255, 255, 255, 0.7)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 255, 255, 1)',
      ]

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      {/* Image Section - 60% Height with CSS-like mask */}
      <View style={{ width, height: imageHeight }} className="relative overflow-hidden">
        <Image
          source={require('@/assets/images/getstarted1.jpeg')}
          style={{ width, height: imageHeight }}
          contentFit="cover"
        />
        {/* CSS Mask Effect - Smooth gradient fade from transparent to background */}
        <LinearGradient
          colors={gradientColors as any}
          locations={[0, 0.2, 0.45, 0.7, 0.9, 1]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: imageHeight * 0.3,
            width: width,
          }}
          pointerEvents="none"
        />
      </View>

      {/* Content Section - No scrolling */}
      <View className="flex-1" style={{ paddingHorizontal: 24 }}>
        {/* Logo and Brand Name */}
        <View className="mb-5 flex-row items-center" style={{ marginTop: 20 }}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728z"
              stroke={svgStrokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16.243 7.757a6 6 0 0 0 -8.486 0"
              stroke={svgStrokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text
            className="ml-2 text-xl font-bold tracking-tight"
            style={{ color: textColor }}
          >
            VedArogya
          </Text>
        </View>

        {/* Welcome Text - Left Aligned */}
        <View className="items-start">
          <Text
            className="mb-2 text-4xl font-extrabold leading-tight tracking-tight"
            style={{ color: textColor }}
          >
            Own Your Health,
          </Text>
          <View className="mb-3 flex-row flex-wrap">
            <Text
              className="text-4xl font-extrabold leading-tight tracking-tight"
              style={{ color: textColor }}
            >
              Shape{' '}
            </Text>
            <Text className="text-4xl font-extrabold leading-tight tracking-tight text-orange-500">
              Your Life.
            </Text>
          </View>
          <Text
            className="mb-5 max-w-sm text-base leading-6"
            style={{ color: secondaryTextColor }}
          >
            From wellness goals to mindful living, your journey to better health begins to
            thrive.
          </Text>

          {/* Progress Indicator */}
          <View className="mb-2 flex-row items-center gap-2">
            <View className="h-1 w-8 rounded-full bg-blue-600" />
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: progressDotColor }}
            />
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: progressDotColor }}
            />
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: progressDotColor }}
            />
          </View>
        </View>

        {/* Get Started Button - Minimal spacing from progress */}
        <View style={{ marginTop: 20, paddingBottom: 20 }}>
          <TouchableOpacity
            onPress={handleGetStarted}
            className="w-full rounded-2xl bg-blue-600"
            activeOpacity={0.85}
            style={{
              paddingVertical: 16,
              elevation: 10,
            }}
          >
            <Text className="text-center text-lg font-bold tracking-wide text-white">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
