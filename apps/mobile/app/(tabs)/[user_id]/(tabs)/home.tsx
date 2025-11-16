import { View, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from './home/components/Header'
import Greeting from './home/components/Greeting'
import WearableTracking from './home/components/WearableTracking'
import TodaysMedication from './home/components/TodaysMedication'
import DailyAyurvedaGuidance from './home/components/DailyAyurvedaGuidance'
import DailyHealthCheckIn from './home/components/DailyHealthCheckIn'

export default function HomeScreen() {
  const backgroundColor = '#F5F3EE'
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Header />
      <ScrollView
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
        <TodaysMedication />
        <WearableTracking />
        <DailyAyurvedaGuidance />
        <DailyHealthCheckIn />
      </ScrollView>
    </View>
  )
}
