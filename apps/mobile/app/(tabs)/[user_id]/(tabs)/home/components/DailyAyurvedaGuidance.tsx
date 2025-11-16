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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Responsive size calculations
const CARD_WIDTH = SCREEN_WIDTH - 48 // Full width minus padding
const CARD_PADDING = Math.max(12, Math.min(16, SCREEN_WIDTH * 0.038))
const CARD_TEXT_WIDTH = CARD_WIDTH - CARD_PADDING * 2 // Text area width for full cards

const getResponsiveSize = {
  // Base sizes scaled by screen width (using 375 as base iPhone width)
  scale: (size: number) => (SCREEN_WIDTH / 375) * size,
  // Scale by height for vertical spacing
  scaleHeight: (size: number) => (SCREEN_HEIGHT / 812) * size,
  // Font sizes that adapt to card width (more accurate for text fitting)
  fontSize: {
    // Section header
    sectionHeader: Math.max(20, Math.min(26, SCREEN_WIDTH * 0.068)),
    sectionSubheader: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.045)),
    // Card title
    cardTitle: Math.max(16, Math.min(20, CARD_TEXT_WIDTH * 0.05)),
    // Card body text
    cardBody: Math.max(14, Math.min(18, CARD_TEXT_WIDTH * 0.037)),
    // Card link text
    cardLink: Math.max(12, Math.min(15, CARD_TEXT_WIDTH * 0.032)),
    // Modal header
    modalHeader: Math.max(18, Math.min(22, SCREEN_WIDTH * 0.058)),
    // Modal large title
    modalLargeTitle: Math.max(24, Math.min(32, SCREEN_WIDTH * 0.085)),
    // Modal body
    modalBody: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.045)),
    // Modal section title
    modalSectionTitle: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.053)),
    // Modal small text
    modalSmall: Math.max(10, Math.min(13, SCREEN_WIDTH * 0.028)),
    // Modal label (uppercase)
    modalLabel: Math.max(9, Math.min(12, SCREEN_WIDTH * 0.025)),
    // Modal balance title
    modalBalanceTitle: Math.max(20, Math.min(26, SCREEN_WIDTH * 0.068)),
  },
  // Icon sizes
  icon: {
    card: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.05)),
    modal: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.062)),
    close: Math.max(18, Math.min(22, SCREEN_WIDTH * 0.055)),
  },
  // Spacing
  spacing: {
    cardPadding: CARD_PADDING,
    cardPaddingLarge: Math.max(20, Math.min(28, SCREEN_WIDTH * 0.075)),
    modalPadding: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
  },
}

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

  const headerFontSize = getResponsiveSize.fontSize.sectionHeader
  const subheaderFontSize = getResponsiveSize.fontSize.sectionSubheader
  const cardTitleFontSize = getResponsiveSize.fontSize.cardTitle
  const cardBodyFontSize = getResponsiveSize.fontSize.cardBody
  const cardLinkFontSize = getResponsiveSize.fontSize.cardLink
  const cardPadding = getResponsiveSize.spacing.cardPaddingLarge
  const cardIconSize = getResponsiveSize.icon.card
  const cardIconContainerSize = Math.max(28, Math.min(32, SCREEN_WIDTH * 0.085))

  return (
    <View className="mb-6 mt-8">
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          fontFamily: 'Satoshi-Medium',
          fontWeight: '600',
          color: textColor,
          fontSize: headerFontSize,
          marginBottom: getResponsiveSize.scaleHeight(8),
          lineHeight: headerFontSize * 1.2,
          letterSpacing: -0.3,
        }}
      >
        Today's Dosha Guidance
      </Text>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          fontFamily: 'Satoshi-Medium',
          fontWeight: '400',
          color: secondaryTextColor,
          fontSize: subheaderFontSize,
          marginBottom: getResponsiveSize.scaleHeight(24),
          lineHeight: subheaderFontSize * 1.4,
          letterSpacing: 0.1,
        }}
      >
        Quick entries for a clearer day.
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
            borderRadius: getResponsiveSize.scale(24),
            padding: cardPadding,
            paddingTop: cardPadding + 4,
            paddingBottom: cardPadding + 4,
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
          <View style={{ marginBottom: getResponsiveSize.scaleHeight(24) }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '600',
                color: textColor,
                fontSize: cardTitleFontSize,
                lineHeight: cardTitleFontSize * 1.3,
                letterSpacing: -0.2,
              }}
            >
              Today's Guidance
            </Text>
          </View>

          {/* Message */}
          <Text
            numberOfLines={4}
            ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '400',
              color: textColor,
              fontSize: cardBodyFontSize,
              marginBottom: getResponsiveSize.scaleHeight(24),
              lineHeight: cardBodyFontSize * 1.5,
              letterSpacing: -0.1,
            }}
          >
            {guidanceMessage}
          </Text>

          {/* Arrow indicator */}
          <View className="flex-row items-center">
            <View
              style={{
                width: cardIconContainerSize,
                height: cardIconContainerSize,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: cardIconContainerSize / 2,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <Ionicons name="arrow-forward" size={cardIconSize} color="#D97706" />
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '600',
                color: '#D97706',
                fontSize: cardLinkFontSize,
                marginLeft: 12,
                lineHeight: cardLinkFontSize * 1.3,
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
              className="flex-row items-center justify-between border-b"
              style={{
                borderColor: 'rgba(0, 0, 0, 0.08)', // Light visible border
                paddingHorizontal: getResponsiveSize.spacing.modalPadding,
                paddingBottom: getResponsiveSize.scaleHeight(20),
              }}
            >
              <View className="flex-1 flex-row items-center">
                <LinearGradient
                  colors={['#FEF3C7', '#FDE68A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: Math.max(44, Math.min(48, SCREEN_WIDTH * 0.128)),
                    height: Math.max(44, Math.min(48, SCREEN_WIDTH * 0.128)),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: getResponsiveSize.scale(16),
                    shadowColor: '#D97706',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Ionicons
                    name="leaf"
                    size={getResponsiveSize.icon.modal}
                    color="#D97706"
                  />
                </LinearGradient>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '600',
                    color: textColor,
                    fontSize: getResponsiveSize.fontSize.modalHeader,
                    marginLeft: 12,
                    lineHeight: getResponsiveSize.fontSize.modalHeader * 1.2,
                    letterSpacing: -0.4,
                  }}
                >
                  Ayurveda Insights
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsExpanded(false)}
                style={{
                  width: Math.max(36, Math.min(40, SCREEN_WIDTH * 0.107)),
                  height: Math.max(36, Math.min(40, SCREEN_WIDTH * 0.107)),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: Math.max(36, Math.min(40, SCREEN_WIDTH * 0.107)) / 2,
                  backgroundColor: '#F9FAFB',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="close"
                  size={getResponsiveSize.icon.close}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{
                padding: getResponsiveSize.spacing.modalPadding,
                paddingBottom: getResponsiveSize.scaleHeight(40),
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Current State */}
              <LinearGradient
                colors={['#FFFBEB', '#FEF3C7', '#FDE68A']}
                locations={[0, 0.5, 1]}
                style={{
                  marginBottom: getResponsiveSize.scaleHeight(24),
                  borderRadius: getResponsiveSize.scale(24),
                  padding: getResponsiveSize.spacing.modalPadding,
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
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '600',
                    color: '#D97706',
                    fontSize: getResponsiveSize.fontSize.modalLabel,
                    marginBottom: getResponsiveSize.scaleHeight(12),
                    textTransform: 'uppercase',
                    lineHeight: getResponsiveSize.fontSize.modalLabel * 1.3,
                    letterSpacing: 1,
                  }}
                >
                  Current State
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '700',
                    color: textColor,
                    fontSize: getResponsiveSize.fontSize.modalLargeTitle,
                    marginBottom: getResponsiveSize.scaleHeight(12),
                    lineHeight: getResponsiveSize.fontSize.modalLargeTitle * 1.2,
                    letterSpacing: -0.5,
                  }}
                >
                  {doshaInsights.currentState}
                </Text>
                <Text
                  numberOfLines={5}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '400',
                    color: textColor,
                    fontSize: getResponsiveSize.fontSize.modalBody,
                    lineHeight: getResponsiveSize.fontSize.modalBody * 1.5,
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
                  style={{
                    marginBottom: getResponsiveSize.scaleHeight(24),
                    backgroundColor: '#FAFAFA',
                    borderRadius: getResponsiveSize.scale(20),
                    padding: getResponsiveSize.spacing.modalPadding,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.08)', // Light visible border
                  }}
                >
                  <View className="mb-4 flex-row items-center">
                    <View
                      style={{
                        width: 4,
                        height: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
                        borderRadius: 2,
                        marginRight: 12,
                        backgroundColor: '#D97706',
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontFamily: 'Satoshi-Medium',
                        fontWeight: '600',
                        color: textColor,
                        fontSize: getResponsiveSize.fontSize.modalSectionTitle,
                        flex: 1,
                        lineHeight: getResponsiveSize.fontSize.modalSectionTitle * 1.3,
                        letterSpacing: -0.3,
                      }}
                    >
                      {section.title}
                    </Text>
                  </View>
                  {section.items.map((item, itemIndex) => (
                    <View
                      key={itemIndex}
                      className="flex-row items-start"
                      style={{ marginBottom: getResponsiveSize.scaleHeight(12) }}
                    >
                      <View
                        style={{
                          width: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
                          height: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
                          marginRight: 12,
                          marginTop: 2,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius:
                            Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)) / 2,
                          backgroundColor: 'rgba(217, 119, 6, 0.1)',
                        }}
                      >
                        <View
                          style={{
                            width: Math.max(6, Math.min(8, SCREEN_WIDTH * 0.021)),
                            height: Math.max(6, Math.min(8, SCREEN_WIDTH * 0.021)),
                            borderRadius:
                              Math.max(6, Math.min(8, SCREEN_WIDTH * 0.021)) / 2,
                            backgroundColor: '#D97706',
                          }}
                        />
                      </View>
                      <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={{
                          fontFamily: 'Satoshi-Medium',
                          fontWeight: '400',
                          color: textColor,
                          fontSize: getResponsiveSize.fontSize.modalBody,
                          flex: 1,
                          lineHeight: getResponsiveSize.fontSize.modalBody * 1.5,
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
                style={{
                  marginBottom: getResponsiveSize.scaleHeight(24),
                  borderRadius: getResponsiveSize.scale(24),
                  padding: getResponsiveSize.spacing.modalPadding,
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
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '600',
                    color: '#16A34A',
                    fontSize: getResponsiveSize.fontSize.modalLabel,
                    marginBottom: getResponsiveSize.scaleHeight(12),
                    textTransform: 'uppercase',
                    lineHeight: getResponsiveSize.fontSize.modalLabel * 1.3,
                    letterSpacing: 1,
                  }}
                >
                  Balance Status
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '700',
                    color: '#16A34A',
                    fontSize: getResponsiveSize.fontSize.modalBalanceTitle,
                    marginBottom: getResponsiveSize.scaleHeight(12),
                    lineHeight: getResponsiveSize.fontSize.modalBalanceTitle * 1.2,
                    letterSpacing: -0.4,
                  }}
                >
                  {doshaInsights.balance}
                </Text>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '400',
                    color: secondaryTextColor,
                    fontSize: getResponsiveSize.fontSize.modalSmall,
                    lineHeight: getResponsiveSize.fontSize.modalSmall * 1.4,
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
