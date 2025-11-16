import { View, ScrollView, Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRef } from 'react'
import Header from './home/components/Header'
import Greeting from './home/components/Greeting'
import WearableTracking from './home/components/WearableTracking'
import TodaysAyurvedaAdvice from './home/components/TodaysAyurvedaAdvice'
import TodaysMedication from './home/components/TodaysMedication'
import DailyHealthCheckIn from './home/components/DailyHealthCheckIn'

export default function HomeScreen() {
  const backgroundColor = '#F5F3EE'
  const insets = useSafeAreaInsets()
  const scrollY = useRef(new Animated.Value(0)).current

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // BlurView doesn't support native driver
  )

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Header scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 100, // Space for bottom navbar
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor }}
      >
        <Greeting />
        <WearableTracking />
        <TodaysAyurvedaAdvice />
        <TodaysMedication />
        <DailyHealthCheckIn />
      </Animated.ScrollView>
    </View>
  )
}
