import { Text, View } from 'react-native'
import { useFonts } from 'expo-font'
import { useMemo } from 'react'
import LiveTracker from './LiveTracker'

export default function Greeting() {
  const textColor = '#111827'

  const [fontsLoaded] = useFonts({
    'PPEditorialNew-Regular': require('@/assets/fonts/PPEditorialNew-Ultralight-BF644b21500d0c0.otf'),
  })

  // Get time-based greeting based on current hour in local timezone
  const greeting = useMemo(() => {
    const currentHour = new Date().getHours()

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning'
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good afternoon'
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good evening'
    } else {
      return 'Good night'
    }
  }, [])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View className="mb-4">
      <Text
        className="mb-6 text-[32px] leading-[40px]"
        style={{
          fontFamily: 'PPEditorialNew-Regular',
          color: textColor,
          letterSpacing: -0.6,
        }}
      >
        {greeting}, How are you feeling today?
      </Text>
      <LiveTracker />
    </View>
  )
}
