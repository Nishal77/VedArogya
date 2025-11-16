import { View, Text, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function GuidanceScreen() {
  const insets = useSafeAreaInsets()
  const backgroundColor = '#F5F3EE'

  return (
    <View className="flex-1" style={{ backgroundColor, paddingTop: insets.top }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor }}
      >
        <Text
          className="mb-4 text-3xl font-bold"
          style={{
            color: '#111827',
            fontFamily: 'Satoshi-Medium',
          }}
        >
          Create & Add
        </Text>
        <Text
          className="text-base leading-6"
          style={{
            color: '#6B7280',
          }}
        >
          Log your health data, add notes, or create new entries.
        </Text>
      </ScrollView>
    </View>
  )
}
