import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH - 48 // Full width minus padding

export default function DailyAyurvedaGuidance() {
  const textColor = '#111827'
  const secondaryTextColor = '#6B7280'
  const insets = useSafeAreaInsets()
  const [isExpanded, setIsExpanded] = useState(false)

  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  // Example personalized message
  const guidanceMessage =
    'Your body feels slightly warm today. Cooling drinks and gentle movement may help balance your energy.'

  // Detailed dosha insights
  const doshaInsights = {
    currentState: 'Pitta Dosha',
    description:
      'Your body is showing signs of increased Pitta (fire element), which can manifest as warmth, intensity, or slight inflammation.',
    recommendations: [
      {
        title: 'Cooling Foods',
        items: [
          'Cucumber water with mint',
          'Coconut water',
          'Sweet fruits like melons and grapes',
          'Leafy green vegetables',
        ],
      },
      {
        title: 'Gentle Movement',
        items: [
          'Morning yoga or stretching',
          'Evening walks in nature',
          'Swimming or water activities',
          'Meditation and deep breathing',
        ],
      },
      {
        title: 'Lifestyle Tips',
        items: [
          'Avoid excessive heat and sun exposure',
          'Maintain regular meal times',
          'Get adequate rest and sleep',
          'Practice mindfulness and stress reduction',
        ],
      },
    ],
    balance: 'Moderate',
    nextCheck: 'Check again tomorrow for updated guidance',
  }

  return (
    <View className="mb-6 mt-8">
      <Text
        className="mb-2 text-[24px]"
        style={{
          fontFamily: 'Satoshi-Medium',
          fontWeight: '500',
          color: textColor,
          letterSpacing: -0.4,
        }}
      >
        Daily Ayurveda Guidance
      </Text>
      <Text
        className="mb-6 text-base leading-6"
        style={{
          fontFamily: 'Satoshi-Medium',
          color: secondaryTextColor,
          letterSpacing: 0.2,
        }}
      >
        Personalized insights based on your body's current state.
      </Text>

      {/* Premium Guidance Card */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => setIsExpanded(true)}
        style={{
          width: CARD_WIDTH,
        }}
      >
        <LinearGradient
          colors={['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D']}
          locations={[0, 0.3, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            padding: 24,
            paddingTop: 28,
            paddingBottom: 28,
            shadowColor: '#D97706',
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
            borderWidth: 1,
            borderColor: 'rgba(217, 119, 6, 0.1)',
          }}
        >
          {/* Header */}
          <View className="mb-6">
            <Text
              className="text-lg"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '600',
                color: textColor,
                letterSpacing: -0.2,
              }}
            >
              Today's Guidance
            </Text>
          </View>

          {/* Message */}
          <Text
            className="mb-6 text-base leading-7"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '400',
              color: textColor,
              lineHeight: 26,
              letterSpacing: -0.1,
            }}
          >
            {guidanceMessage}
          </Text>

          {/* Arrow indicator */}
          <View className="flex-row items-center">
            <View
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <Ionicons name="arrow-forward" size={18} color="#D97706" />
            </View>
            <Text
              className="ml-3 text-sm"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '600',
                color: '#D97706',
                letterSpacing: 0.2,
              }}
            >
              View detailed insights
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Detailed Dosha Insights Modal */}
      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsExpanded(false)}
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <View
            className="flex-1 rounded-t-[32px] bg-white"
            style={{
              marginTop: Platform.OS === 'ios' ? insets.top + 50 : 80,
              paddingTop: Platform.OS === 'ios' ? insets.top + 24 : 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            {/* Header */}
            <View
              className="flex-row items-center justify-between border-b px-6 pb-5"
              style={{ borderColor: '#F3F4F6' }}
            >
              <View className="flex-1 flex-row items-center">
                <LinearGradient
                  colors={['#FEF3C7', '#FDE68A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    shadowColor: '#D97706',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="leaf" size={24} color="#D97706" />
                </LinearGradient>
                <Text
                  className="ml-3 text-xl"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '600',
                    color: textColor,
                    letterSpacing: -0.4,
                  }}
                >
                  Ayurveda Insights
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsExpanded(false)}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{
                  backgroundColor: '#F9FAFB',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="close" size={22} color={textColor} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Current State */}
              <LinearGradient
                colors={['#FFFBEB', '#FEF3C7', '#FDE68A']}
                locations={[0, 0.5, 1]}
                className="mb-6 rounded-3xl p-6"
                style={{
                  shadowColor: '#D97706',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(217, 119, 6, 0.1)',
                }}
              >
                <Text
                  className="mb-3 text-xs"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '600',
                    color: '#D97706',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Current State
                </Text>
                <Text
                  className="mb-3 text-3xl"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '700',
                    color: textColor,
                    letterSpacing: -0.5,
                  }}
                >
                  {doshaInsights.currentState}
                </Text>
                <Text
                  className="text-base leading-7"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '400',
                    color: textColor,
                    lineHeight: 26,
                    letterSpacing: -0.1,
                  }}
                >
                  {doshaInsights.description}
                </Text>
              </LinearGradient>

              {/* Recommendations */}
              {doshaInsights.recommendations.map((section, index) => (
                <View
                  key={index}
                  className="mb-6"
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: '#F3F4F6',
                  }}
                >
                  <View className="mb-4 flex-row items-center">
                    <View
                      className="mr-3 h-6 w-1 rounded-full"
                      style={{ backgroundColor: '#D97706' }}
                    />
                    <Text
                      className="flex-1 text-lg"
                      style={{
                        fontFamily: 'Satoshi-Medium',
                        fontWeight: '600',
                        color: textColor,
                        letterSpacing: -0.3,
                      }}
                    >
                      {section.title}
                    </Text>
                  </View>
                  {section.items.map((item, itemIndex) => (
                    <View key={itemIndex} className="mb-3 flex-row items-start">
                      <View
                        className="mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-full"
                        style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)' }}
                      >
                        <View
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: '#D97706' }}
                        />
                      </View>
                      <Text
                        className="flex-1 text-base leading-7"
                        style={{
                          fontFamily: 'Satoshi-Medium',
                          fontWeight: '400',
                          color: textColor,
                          lineHeight: 26,
                          letterSpacing: -0.1,
                        }}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}

              {/* Balance Status */}
              <LinearGradient
                colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
                locations={[0, 0.5, 1]}
                className="mb-6 rounded-3xl p-6"
                style={{
                  shadowColor: '#16A34A',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(22, 163, 74, 0.1)',
                }}
              >
                <Text
                  className="mb-3 text-xs"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '600',
                    color: '#16A34A',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Balance Status
                </Text>
                <Text
                  className="mb-3 text-2xl"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '700',
                    color: '#16A34A',
                    letterSpacing: -0.4,
                  }}
                >
                  {doshaInsights.balance}
                </Text>
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '400',
                    color: secondaryTextColor,
                    letterSpacing: 0.1,
                  }}
                >
                  {doshaInsights.nextCheck}
                </Text>
              </LinearGradient>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
