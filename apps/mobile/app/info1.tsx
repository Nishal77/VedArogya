import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

const { width, height } = Dimensions.get('window')
const imageHeight = height * 0.5

export default function Info1Screen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'

  const handleSkip = () => {
    router.replace('/(tabs)')
  }

  const handleNext = () => {
    router.push('/info2')
  }

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      {/* Image Section - Upper Half */}
      <View
        style={{
          width,
          height: imageHeight,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 60,
        }}
      >
        <Image
          source={require('@/assets/images/info1home.png')}
          style={{
            width: width * 0.9,
            height: imageHeight * 0.85,
            borderRadius: 20,
          }}
          contentFit="cover"
        />
      </View>

      {/* Content Section */}
      <View className="flex-1" style={{ paddingHorizontal: 24 }}>
        {/* Top Section - Pagination and Text */}
        <View style={{ marginTop: 20 }}>
          {/* Pagination Dots */}
          <View className="flex-row items-center justify-center gap-2">
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: '#2563EB' }}
            />
            <View
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: '#D1D5DB',
                borderWidth: 1,
                borderColor: '#9CA3AF',
              }}
            />
            <View
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: '#D1D5DB',
                borderWidth: 1,
                borderColor: '#9CA3AF',
              }}
            />
          </View>

          {/* Title and Description - Positioned directly below pagination */}
          <View style={{ marginTop: 24 }}>
            <Text
              className="mb-2 text-center text-5xl font-semibold"
              style={{ color: textColor }}
            >
              Experience Ayurveda That Understands You
            </Text>
            <Text
              className="px-4 text-center text-xl leading-6"
              style={{ color: secondaryTextColor }}
            >
              Dosha Analysis, Daily Guidance, Real Health Support
            </Text>
          </View>
        </View>

        {/* Bottom Navigation Buttons - Pushed to bottom */}
        <View
          className="flex-row items-center justify-between"
          style={{ marginTop: 'auto', paddingBottom: 40, paddingTop: 20 }}
        >
          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.7}
            style={{ paddingVertical: 12, paddingHorizontal: 20 }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: secondaryTextColor }}
            >
              SKIP
            </Text>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="rounded-full bg-blue-600"
            activeOpacity={0.85}
            style={{
              paddingVertical: 14,
              paddingHorizontal: 32,
              elevation: 4,
              shadowColor: '#2563EB',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          >
            <Text className="text-base font-bold tracking-wide text-white">NEXT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
