import { View, Text, Dimensions } from 'react-native'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle, Path } from 'react-native-svg'
import { useState } from 'react'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Responsive calculations
const CARD_WIDTH = SCREEN_WIDTH - 48 // Full width minus padding
const CARD_PADDING = Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064))

const getResponsiveSize = {
  scale: (size: number) => (SCREEN_WIDTH / 375) * size,
  scaleHeight: (size: number) => (SCREEN_HEIGHT / 812) * size,
  fontSize: {
    sectionHeader: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
    sectionSubheader: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.043)),
    title: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.043)),
    insight: Math.max(18, Math.min(20, SCREEN_WIDTH * 0.053)),
    recommendation: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.043)),
    footer: Math.max(11, Math.min(13, SCREEN_WIDTH * 0.035)),
  },
  icon: {
    leaf: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
  },
}

// Status color configurations
const statusColors = {
  elevated: {
    iconColor: '#F59E0B', // Amber/Orange
    accentColor: '#F97316', // Warm orange
    borderColor: 'rgba(245, 158, 11, 0.2)',
    bgTint: 'rgba(249, 115, 22, 0.05)',
  },
  stable: {
    iconColor: '#10B981', // Green
    accentColor: '#059669', // Emerald green
    borderColor: 'rgba(16, 185, 129, 0.2)',
    bgTint: 'rgba(16, 185, 129, 0.05)',
  },
  low: {
    iconColor: '#0EA5E9', // Sky blue
    accentColor: '#0284C7', // Blue
    borderColor: 'rgba(14, 165, 233, 0.2)',
    bgTint: 'rgba(14, 165, 233, 0.05)',
  },
}

// Dosha configurations
const doshaConfigs = {
  vata: {
    name: 'Vata',
    icon: 'leaf',
    statusMessages: {
      elevated: {
        insight: 'Your Vata is slightly elevated today.',
        recommendation: 'Warm water and a light breakfast will help you stay centered.',
      },
      stable: {
        insight: 'Your Vata is balanced today.',
        recommendation: 'Maintain warm, grounding foods to keep this harmony.',
      },
      low: {
        insight: 'Your Vata is calm today.',
        recommendation: 'Enjoy gentle movement and warm meals to maintain this state.',
      },
    },
  },
  pitta: {
    name: 'Pitta',
    icon: 'flame',
    statusMessages: {
      elevated: {
        insight: 'Your Pitta is slightly elevated today.',
        recommendation: 'Cooling foods and gentle activities will help balance your energy.',
      },
      stable: {
        insight: 'Your Pitta is stable today.',
        recommendation: 'Enjoy cooling foods and stay hydrated to maintain this balance.',
      },
      low: {
        insight: 'Your Pitta is calm today.',
        recommendation: 'Perfect time for warm, nourishing meals and rest.',
      },
    },
  },
  kapha: {
    name: 'Kapha',
    icon: 'water',
    statusMessages: {
      elevated: {
        insight: 'Your Kapha is slightly elevated today.',
        recommendation: 'Light, warm meals and gentle exercise will help energize you.',
      },
      stable: {
        insight: 'Your Kapha is balanced today.',
        recommendation: 'Maintain light, energizing foods to keep this harmony.',
      },
      low: {
        insight: 'Your Kapha is calm today.',
        recommendation: 'Enjoy grounding, warm foods to maintain this state.',
      },
    },
  },
}

// Rotate through different dosha states for demo
const getDoshaState = () => {
  const doshas: Array<'vata' | 'pitta' | 'kapha'> = ['vata', 'pitta', 'kapha']
  const states: Array<'elevated' | 'stable' | 'low'> = ['elevated', 'stable', 'low']
  
  // For demo, rotate every day
  const dayOfYear = Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % 365)
  const doshaIndex = dayOfYear % doshas.length
  const stateIndex = Math.floor(dayOfYear / doshas.length) % states.length
  
  return {
    dosha: doshas[doshaIndex],
    state: states[stateIndex] as 'elevated' | 'stable' | 'low',
  }
}

export default function TodaysAyurvedaAdvice() {
  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
    'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular copy.otf'),
  })

  // Generate grain texture positions once
  const [grainParticles] = useState(() => {
    return Array.from({ length: 100 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.3,
    }))
  })

  // Get dosha state based on day
  const doshaState = getDoshaState()

  if (!fontsLoaded) {
    return null
  }

  const dosha = doshaConfigs[doshaState.dosha]
  const config = dosha.statusMessages[doshaState.state]
  const statusColor = statusColors[doshaState.state]
  const sectionHeaderFontSize = getResponsiveSize.fontSize.sectionHeader
  const sectionSubheaderFontSize = getResponsiveSize.fontSize.sectionSubheader
  const titleFontSize = getResponsiveSize.fontSize.title
  const insightFontSize = getResponsiveSize.fontSize.insight
  const recommendationFontSize = getResponsiveSize.fontSize.recommendation
  const footerFontSize = getResponsiveSize.fontSize.footer
  const iconSize = getResponsiveSize.icon.leaf

  return (
    <View className="mb-6 mt-6">
      {/* Section Header */}
      <View className="mb-4">
        <Text
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '600',
            color: '#11181C',
            fontSize: sectionHeaderFontSize,
            marginBottom: 4,
            lineHeight: sectionHeaderFontSize * 1.2,
            letterSpacing: -0.3,
          }}
        >
          Today's Dosha Guidance
        </Text>
        <Text
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '400',
            color: '#6B7280',
            fontSize: sectionSubheaderFontSize,
            lineHeight: sectionSubheaderFontSize * 1.4,
            letterSpacing: 0.1,
          }}
        >
          Quick entries for a clearer day.
        </Text>
      </View>

      {/* Ayurveda Insight Card */}
      <View
        className="overflow-hidden rounded-2xl"
        style={{
          width: CARD_WIDTH,
          backgroundColor: '#F8F5EE',
          borderWidth: 0.5,
          borderColor: 'rgba(0, 0, 0, 0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Rich Textured Background Pattern */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        >
          <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
            {/* Mandala-inspired decorative pattern */}
            <Circle cx="80" cy="60" r="40" fill="#A78BFA" opacity="0.08" />
            <Circle cx="320" cy="80" r="35" fill="#A78BFA" opacity="0.06" />
            <Circle cx="120" cy="220" r="45" fill="#A78BFA" opacity="0.07" />
            <Circle cx="300" cy="240" r="30" fill="#A78BFA" opacity="0.05" />
            
            {/* Floral/mandala patterns */}
            <Path
              d="M200 100 Q220 80 240 100 Q220 120 200 100"
              fill="#A78BFA"
              opacity="0.06"
            />
            <Path
              d="M150 180 Q170 160 190 180 Q170 200 150 180"
              fill="#A78BFA"
              opacity="0.05"
            />
            <Path
              d="M250 160 Q270 140 290 160 Q270 180 250 160"
              fill="#A78BFA"
              opacity="0.05"
            />
            
            {/* Subtle geometric lines */}
            <Path
              d="M50 150 Q100 120 150 150 Q200 180 250 150 Q300 120 350 150"
              stroke="#A78BFA"
              strokeWidth="1"
              fill="none"
              opacity="0.04"
            />
            
            {/* Small decorative dots */}
            {Array.from({ length: 20 }).map((_, i) => (
              <Circle
                key={i}
                cx={50 + (i * 15) % 350}
                cy={80 + Math.floor(i / 10) * 100}
                r={2 + (i % 3)}
                fill="#A78BFA"
                opacity={0.03 + (i % 3) * 0.02}
              />
            ))}
          </Svg>
        </View>

        {/* Grain texture overlay */}
                <View
                  style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            opacity: 0.15,
            pointerEvents: 'none',
                  }}
                >
          {grainParticles.map((particle, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: 1,
                height: 1,
                backgroundColor: '#8B5CF6',
                opacity: particle.opacity,
              }}
            />
          ))}
                </View>

        <View
          style={{
            padding: CARD_PADDING,
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Main Insight Text */}
          <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontFamily: 'Satoshi-Medium',
                      fontWeight: '600',
                      color: '#11181C',
                fontSize: insightFontSize,
                lineHeight: insightFontSize * 1.4,
                      letterSpacing: -0.3,
              }}
            >
              Your{' '}
              <Text
                style={{
                  color: statusColor.accentColor,
                  fontWeight: '700',
                    }}
                  >
                {dosha.name}
              </Text>{' '}
              {config.insight.replace(`Your ${dosha.name} `, '')}
                  </Text>
          </View>

          {/* Recommendation Text */}
          <View style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                fontFamily: 'Satoshi-Regular',
                fontWeight: '400',
                color: '#11181C',
                fontSize: recommendationFontSize,
                lineHeight: recommendationFontSize * 1.5,
                letterSpacing: -0.1,
                opacity: 0.85,
                      }}
                    >
              {config.recommendation.split(' ').map((word, index, arr) => {
                // Highlight key action words
                const keyWords = ['warm', 'light', 'cooling', 'gentle', 'maintain', 'enjoy', 'perfect']
                const cleanWord = word.replace(/[.,!?]/g, '')
                const isKeyWord = keyWords.some(kw => cleanWord.toLowerCase() === kw.toLowerCase())
                const punctuation = word.replace(cleanWord, '')
                
                if (isKeyWord) {
                  return (
                    <Text key={index} style={{ color: statusColor.accentColor, fontWeight: '500' }}>
                      {word}{index < arr.length - 1 ? ' ' : ''}
                    </Text>
                  )
                }
                return <Text key={index}>{word}{index < arr.length - 1 ? ' ' : ''}</Text>
              })}
            </Text>
            </View>

          {/* Elegant Separator Line */}
          <View
            style={{
              height: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              marginBottom: 14,
              marginLeft: -CARD_PADDING,
              marginRight: -CARD_PADDING,
            }}
          />

          {/* Footer */}
          <View className="flex-row items-center">
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: statusColor.accentColor,
                marginRight: 6,
              }}
            />
            <Text
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '500',
                color: statusColor.accentColor,
                fontSize: footerFontSize,
                letterSpacing: 0.1,
                textTransform: 'capitalize',
              }}
            >
              {doshaState.state}
            </Text>
                <View
              style={{
                width: 2,
                height: 2,
                borderRadius: 1,
                backgroundColor: '#9CA3AF',
                marginHorizontal: 8,
              }}
                />
                <Text
                  style={{
                    fontFamily: 'Satoshi-Medium',
                    fontWeight: '400',
                color: '#6B7280',
                fontSize: footerFontSize,
                    letterSpacing: 0.1,
                  }}
                >
              Updated just now
                </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
