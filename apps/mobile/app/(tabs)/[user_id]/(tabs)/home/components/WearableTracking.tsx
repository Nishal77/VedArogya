import { Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import Svg, { Polyline, Path, Circle, Ellipse } from 'react-native-svg'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Responsive size calculations - Reduced gap for tighter layout
const CARD_GAP = Math.max(6, Math.min(10, SCREEN_WIDTH * 0.026))
const FULL_CARD_WIDTH = SCREEN_WIDTH - 48 // Full width minus padding
const CARD_WIDTH = (SCREEN_WIDTH - 48 - CARD_GAP) / 2 // 2 columns with gap
const CARD_PADDING = Math.max(12, Math.min(16, SCREEN_WIDTH * 0.038))
const AVAILABLE_TEXT_WIDTH = CARD_WIDTH - CARD_PADDING * 2 // Text area width for small cards
const FULL_CARD_TEXT_WIDTH = FULL_CARD_WIDTH - CARD_PADDING * 2 // Text area width for full cards

const getResponsiveSize = {
  // Base sizes scaled by screen width (using 375 as base iPhone width)
  scale: (size: number) => (SCREEN_WIDTH / 375) * size,
  // Scale by height for vertical spacing
  scaleHeight: (size: number) => (SCREEN_HEIGHT / 812) * size,
  // Font sizes that adapt to card width (more accurate for text fitting)
  fontSize: {
    // Small card title
    cardTitle: Math.max(13, Math.min(16, AVAILABLE_TEXT_WIDTH * 0.09)),
    // Small card value
    cardValue: Math.max(18, Math.min(26, AVAILABLE_TEXT_WIDTH * 0.14)),
    // Small card unit
    cardUnit: Math.max(11, Math.min(14, AVAILABLE_TEXT_WIDTH * 0.07)),
    // Small card status
    cardStatus: Math.max(10, Math.min(13, AVAILABLE_TEXT_WIDTH * 0.065)),
    // Full card title
    fullCardTitle: Math.max(14, Math.min(17, FULL_CARD_TEXT_WIDTH * 0.045)),
    // Full card value
    fullCardValue: Math.max(22, Math.min(30, FULL_CARD_TEXT_WIDTH * 0.09)),
    // Full card unit
    fullCardUnit: Math.max(14, Math.min(18, FULL_CARD_TEXT_WIDTH * 0.045)),
    // Full card subtitle
    fullCardSubtitle: Math.max(11, Math.min(14, FULL_CARD_TEXT_WIDTH * 0.035)),
    // Section header
    sectionHeader: Math.max(20, Math.min(26, SCREEN_WIDTH * 0.068)),
    sectionSubheader: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.045)),
  },
  // Icon sizes
  icon: {
    smallCard: Math.max(14, Math.min(18, SCREEN_WIDTH * 0.045)),
    fullCard: Math.max(16, Math.min(20, SCREEN_WIDTH * 0.05)),
  },
  // Spacing
  spacing: {
    cardPadding: CARD_PADDING,
    cardGap: CARD_GAP,
  },
}

interface HealthCardProps {
  title: string
  value: string
  unit?: string
  status?: string
  icon: keyof typeof Ionicons.glyphMap
  bgGradient: readonly [string, string, ...string[]]
  iconColor: string
  showGraph?: boolean
  showProgress?: boolean
  progressValue?: number
}

function HealthCard({
  title,
  value,
  unit,
  status,
  icon,
  bgGradient,
  iconColor,
  showGraph = false,
  showProgress = false,
  progressValue = 0,
}: HealthCardProps) {
  const cardPadding = getResponsiveSize.spacing.cardPadding
  const titleFontSize = getResponsiveSize.fontSize.cardTitle
  const valueFontSize = getResponsiveSize.fontSize.cardValue
  const unitFontSize = getResponsiveSize.fontSize.cardUnit
  const statusFontSize = getResponsiveSize.fontSize.cardStatus
  const iconSize = getResponsiveSize.icon.smallCard
  const cardMinHeight = Math.max(130, Math.min(150, SCREEN_HEIGHT * 0.18))

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.08)', // Light visible border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: cardPadding,
          minHeight: cardMinHeight,
          position: 'relative',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
      {/* Background SVG Decoration */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 200 140">
          {icon === 'heart' && (
            <>
              <Circle cx="160" cy="25" r="20" fill={iconColor} opacity="0.2" />
              <Circle cx="180" cy="50" r="12" fill={iconColor} opacity="0.15" />
              <Path
                d="M150 45 Q160 35 170 45 Q160 55 150 45"
                fill={iconColor}
                opacity="0.1"
              />
            </>
          )}
          {icon === 'pulse' && (
            <>
              <Polyline
                points="120,35 130,30 140,25 150,30 160,35 170,30 180,25"
                fill="none"
                stroke={iconColor}
                strokeWidth="2"
                opacity="0.2"
              />
              <Circle cx="160" cy="45" r="18" fill={iconColor} opacity="0.1" />
            </>
          )}
          {icon === 'leaf' && (
            <>
              <Path
                d="M140 25 Q150 15 160 25 Q150 35 140 25"
                fill={iconColor}
                opacity="0.2"
              />
              <Circle cx="170" cy="45" r="15" fill={iconColor} opacity="0.15" />
            </>
          )}
          {icon === 'moon' && (
            <>
              <Path
                d="M150 25 Q160 20 165 25 Q160 30 150 25"
                fill={iconColor}
                opacity="0.2"
              />
              <Circle cx="170" cy="50" r="10" fill={iconColor} opacity="0.15" />
            </>
          )}
          {!['heart', 'pulse', 'leaf', 'moon'].includes(icon) && (
            <>
              <Circle cx="170" cy="25" r="20" fill={iconColor} opacity="0.15" />
              <Circle cx="180" cy="60" r="12" fill={iconColor} opacity="0.1" />
            </>
          )}
        </Svg>
      </View>

      {/* Header */}
        <View
          className="mb-2 flex-row items-center justify-between"
          style={{ position: 'relative', zIndex: 1 }}
        >
        <View className="flex-row items-center" style={{ flex: 1 }}>
          <View
            style={{
              width: iconSize + 4,
              height: iconSize + 4,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: `${iconColor}15`,
            }}
          >
            <Ionicons name={icon} size={iconSize} color={iconColor} />
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: '#111827',
              fontSize: titleFontSize,
              marginLeft: 8,
              flex: 1,
              lineHeight: titleFontSize * 1.3,
              letterSpacing: -0.2,
            }}
          >
            {title}
          </Text>
        </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}
          >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M7 7h10v10"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7 17 17 7"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Graph - Always show */}
        <View
          className="mb-2 flex-1"
          style={{
            height: 50,
            position: 'relative',
            zIndex: 1,
            justifyContent: 'center',
          }}
        >
        <Svg width="100%" height={50} viewBox="0 0 200 50">
          {showGraph ? (
            // Heart Rate style - smooth wave
            <Polyline
              points="0,35 20,30 40,25 60,20 80,15 100,20 120,25 140,30 160,25 180,20 200,15"
              fill="none"
              stroke={iconColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : icon === 'pulse' ? (
            // HRV style - ECG/pulse wave
            <Polyline
              points="0,25 10,25 15,15 20,25 25,25 30,10 35,25 40,25 50,20 60,25 70,25 80,15 90,25 100,25 110,20 120,25 130,25 140,10 150,25 160,25 170,20 180,25 190,25 200,15"
              fill="none"
              stroke={iconColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : showProgress ? (
            // Progress style - horizontal line with peaks
            <Polyline
              points="0,25 30,20 60,25 90,20 120,25 150,20 180,25 200,25"
              fill="none"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          ) : (
            // Default - gentle wave
            <Polyline
              points="0,30 25,25 50,30 75,25 100,30 125,25 150,30 175,25 200,30"
              fill="none"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          )}
        </Svg>
        </View>

      {/* Value - Positioned at bottom */}
      <View style={{ position: 'relative', zIndex: 1 }}>
        <View className="flex-row items-baseline justify-between">
        <View className="flex-row items-baseline" style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
              fontSize: valueFontSize,
              lineHeight: valueFontSize * 1.2,
              letterSpacing: -0.3,
            }}
          >
            {value}
          </Text>
          {unit && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '400',
                color: '#6B7280',
                fontSize: unitFontSize,
                marginLeft: 4,
                lineHeight: unitFontSize * 1.3,
              }}
            >
              {unit}
            </Text>
          )}
      </View>

          {/* Status on the right */}
      {status && (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '400',
            color: '#6B7280',
            fontSize: statusFontSize,
            marginLeft: 8,
            lineHeight: statusFontSize * 1.3,
          }}
        >
          {status}
        </Text>
      )}
        </View>

      {showProgress && (
        <View className="mt-2">
          <View
            className="h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressValue}%`,
                backgroundColor: iconColor,
              }}
            />
          </View>
        </View>
      )}
      </View>
      </LinearGradient>
    </View>
  )
}

// Full-width Health Score Card Component
function HealthScoreCard() {
  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  const cardPadding = getResponsiveSize.spacing.cardPadding
  const titleFontSize = getResponsiveSize.fontSize.fullCardTitle
  const valueFontSize = getResponsiveSize.fontSize.fullCardValue
  const subtitleFontSize = getResponsiveSize.fontSize.fullCardSubtitle
  const cardMinHeight = Math.max(120, Math.min(140, SCREEN_HEIGHT * 0.16))

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{
        width: FULL_CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.08)', // Light visible border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <LinearGradient
        colors={['#FAFCF9', '#F7FAF4', '#F2F7ED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: cardPadding,
          minHeight: cardMinHeight,
          position: 'relative',
        }}
      >
      {/* Background SVG Decoration */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 300 130">
          <Circle cx="250" cy="30" r="25" fill="#10B981" opacity="0.2" />
          <Circle cx="270" cy="60" r="18" fill="#10B981" opacity="0.15" />
          <Path
            d="M220 45 Q240 40 260 45 Q240 50 220 45"
            fill="#10B981"
            opacity="0.1"
          />
        </Svg>
      </View>

      {/* Header */}
        <View
          className="mb-3 flex-row items-center justify-between"
          style={{ position: 'relative', zIndex: 1 }}
        >
        <View className="flex-row items-center">
          {/* White circle with heart icon - with subtle blur */}
          <View
            className="h-8 w-8 items-center justify-center rounded-full overflow-hidden"
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 15 : 10}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
            <View style={{ position: 'relative', zIndex: 1 }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              {/* Heart shape */}
              <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#111827"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* ECG line inside heart */}
              <Path
                d="M8 12h2l1 2 2-4 1 2h2"
                stroke="#111827"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            </View>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: '#111827',
              fontSize: titleFontSize,
              marginLeft: 8,
              lineHeight: titleFontSize * 1.3,
              letterSpacing: -0.2,
            }}
          >
            Health Score
          </Text>
        </View>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          {/* Status Pill - with subtle blur */}
          <View
            className="rounded-full px-2.5 py-1 overflow-hidden"
            style={{ position: 'relative' }}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 12 : 8}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(22, 163, 74, 0.9)',
              }}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '500',
                color: '#FFFFFF',
                fontSize: subtitleFontSize,
                position: 'relative',
                zIndex: 1,
              }}
            >
              You are Good!
            </Text>
          </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M7 7h10v10"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M7 17 17 7"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
        <View
          className="mb-3 flex-row items-center justify-between"
          style={{ position: 'relative', zIndex: 1 }}
        >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '500',
            color: '#111827',
            fontSize: subtitleFontSize + 2,
            flex: 1,
            marginRight: 12,
            lineHeight: (subtitleFontSize + 2) * 1.3,
            letterSpacing: 0.1,
          }}
        >
          Keep your body healthy !
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '600',
            color: '#111827',
            fontSize: valueFontSize,
            lineHeight: valueFontSize * 1.2,
            letterSpacing: -0.4,
          }}
        >
          94%
        </Text>
      </View>

      {/* Progress Bar - 3 segments representing 94% */}
      <View className="flex-row" style={{ gap: 4, position: 'relative', zIndex: 1 }}>
        {/* First segment - filled darker green */}
        <View
          className="h-3 rounded-full"
          style={{
            backgroundColor: '#22C55E',
            flex: 1,
          }}
        />
        {/* Second segment - filled darker green */}
        <View
          className="h-3 rounded-full"
          style={{
            backgroundColor: '#22C55E',
            flex: 1,
          }}
        />
        {/* Third segment - filled lighter green (representing ~94% completion) */}
        <View
          className="h-3 rounded-full"
          style={{
            backgroundColor: '#86EFAC',
            flex: 1,
          }}
        />
      </View>
      </LinearGradient>
    </View>
  )
}

// Full-width Body Temperature Card Component
function FullWidthHealthCard({
  title,
  value,
  unit,
  status,
  icon,
  bgGradient,
  iconColor,
}: {
  title: string
  value: string
  unit?: string
  status?: string
  icon: keyof typeof Ionicons.glyphMap
  bgGradient: readonly [string, string, ...string[]]
  iconColor: string
}) {
  // Mock wearable tracking data for Body Temperature
  const temperatureTrend = 'stable' as 'rising' | 'falling' | 'stable'
  const dailyAverage = '98.4'
  const temperatureRange = { min: '97.8', max: '98.9' }
  const lastReading = '2 min ago'

  const cardPadding = getResponsiveSize.spacing.cardPadding
  const titleFontSize = getResponsiveSize.fontSize.fullCardTitle
  const valueFontSize = getResponsiveSize.fontSize.fullCardValue
  const unitFontSize = getResponsiveSize.fontSize.fullCardUnit
  const subtitleFontSize = getResponsiveSize.fontSize.fullCardSubtitle
  const iconSize = getResponsiveSize.icon.fullCard
  const cardMinHeight = Math.max(120, Math.min(150, SCREEN_HEIGHT * 0.18))
  const graphHeight = Math.max(28, Math.min(36, SCREEN_HEIGHT * 0.044))
  const iconContainerSize = Math.max(28, Math.min(32, SCREEN_WIDTH * 0.085))

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{
        width: FULL_CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: 'rgba(0, 0, 0, 0.08)', // Light visible border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 7,
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: cardPadding,
          minHeight: cardMinHeight,
          position: 'relative',
        }}
      >
      {/* Header */}
      <View className="mb-2.5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {/* Icon container with subtle blur */}
          <View
            style={{ 
              width: iconContainerSize,
              height: iconContainerSize,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: getResponsiveSize.scale(12),
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 15 : 10}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
            <View style={{ position: 'relative', zIndex: 1 }}>
              <Ionicons name={icon} size={iconSize} color={iconColor} />
            </View>
          </View>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
                fontSize: titleFontSize,
                marginLeft: 8,
                lineHeight: titleFontSize * 1.3,
              letterSpacing: -0.2,
            }}
          >
            {title}
          </Text>
        </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M7 7h10v10"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M7 17 17 7"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Main Temperature Display with Status */}
      <View className="mb-2.5 flex-row items-baseline justify-between">
        <View className="flex-row items-baseline">
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '700',
              color: '#111827',
                fontSize: valueFontSize,
                lineHeight: valueFontSize * 1.2,
              letterSpacing: -0.5,
            }}
          >
            {value}
          </Text>
          {unit && (
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '500',
                color: '#6B7280',
                  fontSize: unitFontSize,
                  marginLeft: 4,
                  lineHeight: unitFontSize * 1.3,
                letterSpacing: -0.3,
              }}
            >
              {unit}
            </Text>
          )}
        </View>
        {status && (
          <View className="flex-row items-center">
            <View 
                className="mr-1.5 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: iconColor }}
            />
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '600',
                color: '#111827',
                  fontSize: subtitleFontSize,
                  marginRight: 4,
                textTransform: 'capitalize',
                  lineHeight: subtitleFontSize * 1.3,
                letterSpacing: 0.2,
              }}
            >
              {temperatureTrend}
            </Text>
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '400',
                color: '#6B7280',
                  fontSize: subtitleFontSize,
                  lineHeight: subtitleFontSize * 1.3,
                letterSpacing: 0.1,
              }}
            >
              • Normal Range
            </Text>
          </View>
        )}
      </View>

      {/* Temperature Graph */}
        <View className="mb-2.5" style={{ height: graphHeight }}>
          <Svg width="100%" height={graphHeight} viewBox="0 0 200 32">
          <Polyline
            points="0,20 15,18 30,16 45,18 60,20 75,18 90,16 105,18 120,20 135,18 150,16 165,18 180,20 195,18 200,16"
            fill="none"
            stroke={iconColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </Svg>
      </View>

      {/* Additional Metrics Row */}
      <View className="flex-row justify-between">
        {/* Daily Average */}
        <View style={{ flex: 1 }}>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '400',
              color: '#9CA3AF',
                fontSize: subtitleFontSize - 1,
                marginBottom: 2,
                lineHeight: (subtitleFontSize - 1) * 1.3,
              letterSpacing: 0.2,
            }}
          >
            Daily Avg
          </Text>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
                fontSize: subtitleFontSize,
                lineHeight: subtitleFontSize * 1.3,
              letterSpacing: -0.2,
            }}
          >
            {dailyAverage}°F
          </Text>
        </View>

        {/* Temperature Range */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '400',
              color: '#9CA3AF',
                fontSize: subtitleFontSize - 1,
                marginBottom: 2,
                lineHeight: (subtitleFontSize - 1) * 1.3,
              letterSpacing: 0.2,
            }}
          >
            Range
          </Text>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
                fontSize: subtitleFontSize,
                lineHeight: subtitleFontSize * 1.3,
              letterSpacing: -0.2,
            }}
          >
            {temperatureRange.min} - {temperatureRange.max}°F
          </Text>
        </View>

        {/* Last Reading */}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '400',
              color: '#9CA3AF',
                fontSize: subtitleFontSize - 1,
                marginBottom: 2,
                lineHeight: (subtitleFontSize - 1) * 1.3,
              letterSpacing: 0.2,
            }}
          >
            Last Reading
          </Text>
          <Text
              numberOfLines={1}
              ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
                fontSize: subtitleFontSize,
                lineHeight: subtitleFontSize * 1.3,
              letterSpacing: -0.2,
            }}
          >
            {lastReading}
          </Text>
        </View>
      </View>
      </LinearGradient>
    </View>
  )
}

export default function WearableTracking() {
  const textColor = '#111827'
  const secondaryTextColor = '#6B7280'

  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  const headerFontSize = getResponsiveSize.fontSize.sectionHeader
  const subheaderFontSize = getResponsiveSize.fontSize.sectionSubheader

  return (
    <View className="mb-6 mt-8">
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          fontFamily: 'Satoshi-Medium',
          fontWeight: '500',
          color: textColor,
          fontSize: headerFontSize,
          marginBottom: getResponsiveSize.scaleHeight(6),
          lineHeight: headerFontSize * 1.2,
          letterSpacing: -0.4,
        }}
      >
        Your Energy, In Real Time
      </Text>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          fontFamily: 'Satoshi-Medium',
          fontWeight: '400',
          color: secondaryTextColor,
          fontSize: subheaderFontSize,
          marginBottom: getResponsiveSize.scaleHeight(16),
          lineHeight: subheaderFontSize * 1.4,
          letterSpacing: 0.2,
        }}
      >
   Instant insights from your mind and body.
      </Text>

      {/* Health Metrics Grid */}
      <View style={{ gap: 8 }}>
        {/* Row 1: Heart Rate and HRV */}
        <View className="flex-row" style={{ gap: 8 }}>
          <HealthCard
            title="Heart Rate"
            value="142"
            unit="bpm"
            status="Critical"
            icon="heart"
            bgGradient={['#FFFBFB', '#FFF9F9', '#FFF7F7']}
            iconColor="#EF4444"
            showGraph={true}
          />
          <HealthCard
            title="HRV"
            value="42"
            unit="ms"
            status="Normal"
            icon="pulse"
            bgGradient={['#FAFCF9', '#F7FAF4', '#F2F7ED']}
            iconColor="#10B981"
          />
        </View>

        {/* Row 2: Health Score (Full Width) */}
        <HealthScoreCard />

        {/* Row 3: Stress Score and Sleep Score */}
        <View className="flex-row" style={{ gap: 8 }}>
          <HealthCard
            title="Stress Score"
            value="24"
            unit="/100"
            status="Low Stress"
            icon="leaf"
            bgGradient={['#FFFDF9', '#FFFBF5', '#FFF9F0']}
            iconColor="#F59E0B"
            showProgress={true}
            progressValue={76}
          />
          <HealthCard
            title="Sleep Score"
            value="87"
            unit="/100"
            status="Good Sleep"
            icon="moon"
            bgGradient={['#FCFBFF', '#FAF9FE', '#F7F5FD']}
            iconColor="#8B5CF6"
            showProgress={true}
            progressValue={87}
          />
        </View>

        {/* Row 4: Body Temperature (Full Width, Centered) */}
        <View className="items-center">
          <FullWidthHealthCard
            title="Body Temperature"
            value="98.6"
            unit="°F"
            status="Normal"
            icon="thermometer"
            bgGradient={['#FFFBF9', '#FFF8F5', '#FFF5F0']}
            iconColor="#F97316"
          />
        </View>
      </View>
    </View>
  )
}
