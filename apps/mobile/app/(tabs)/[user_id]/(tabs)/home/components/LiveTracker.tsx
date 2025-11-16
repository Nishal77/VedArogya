import { Text, View, Animated, Easing, Dimensions } from 'react-native'
import { useFonts } from 'expo-font'
import { useEffect, useRef, useState } from 'react'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function LiveTracker() {
  const textColor = '#111827'
  const secondaryTextColor = '#6B7280'
  const bgColor = '#FEE2E2' // Light pink/peach background

  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  // Responsive sizing
  const cardPadding = Math.max(10, Math.min(14, SCREEN_WIDTH * 0.037))
  const fontSize = Math.max(13, Math.min(15, SCREEN_WIDTH * 0.035))
  const indicatorSize = Math.max(6, Math.min(8, SCREEN_WIDTH * 0.021))

  // Animated values for blinking and pulsing effects
  const blinkAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  // Sample health messages with priority
  const healthMessages = [
    {
      message: 'Your stress is trending slightly high.',
      priority: 'high',
      actionRequired: true,
    },
    {
      message: 'Your heart rate is within optimal range.',
      priority: 'high',
      actionRequired: true,
    },
    {
      message: 'Your body temperature is balanced.',
      priority: 'normal',
      actionRequired: false,
    },
    {
      message: 'Your sleep quality is improving.',
      priority: 'normal',
      actionRequired: false,
    },
  ]

  // Current message to display
  const currentMessage = healthMessages[currentMessageIndex]

  // Smooth blinking and pulsing animation for live indicator
  useEffect(() => {
    // Opacity animation (blink)
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.4,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )

    // Scale animation (pulse)
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )

    blinkAnimation.start()
    pulseAnimation.start()

    return () => {
      blinkAnimation.stop()
      pulseAnimation.stop()
    }
  }, [blinkAnim, scaleAnim])

  // Rotate messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % healthMessages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!fontsLoaded) {
    return null
  }

  // Determine background color based on alert status
  const cardBgColor = currentMessage.actionRequired
    ? '#FFF5EB' // Very light warm peach background for alerts
    : '#FAFAF9' // Very light beige background for normal

  return (
    <View className="mb-3 w-full">
      {/* Live Health Ticker Card */}
      <View
        className="rounded-2xl"
        style={{
          backgroundColor: cardBgColor,
          paddingHorizontal: cardPadding,
          paddingVertical: cardPadding - 2,
        }}
      >
        {/* Current Message Display */}
        <View className="flex-row items-center">
          <Animated.View
            style={{
              opacity: blinkAnim,
              marginRight: 10,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                width: indicatorSize,
                height: indicatorSize,
                borderRadius: indicatorSize / 2,
                backgroundColor: '#22C55E',
              }}
            />
          </Animated.View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="flex-1"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: textColor,
              fontSize: fontSize,
              lineHeight: fontSize * 1.4,
              letterSpacing: -0.2,
            }}
          >
            {currentMessage.message}
            {currentMessage.actionRequired && (
              <Text
                style={{
                  fontFamily: 'Satoshi-Medium',
                  fontWeight: '600',
                  color: '#EF4444',
                  letterSpacing: 0.2,
                }}
              >
                {' Alert'}
              </Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  )
}
