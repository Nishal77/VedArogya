import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// Responsive size calculations
const CARD_WIDTH = SCREEN_WIDTH - 48 // Full width minus padding
const CARD_GAP = Math.max(8, Math.min(12, SCREEN_WIDTH * 0.032))
const CARD_ITEM_WIDTH = (CARD_WIDTH - CARD_GAP * 2) / 2 // 2 columns with gap
const CARD_PADDING = Math.max(12, Math.min(16, SCREEN_WIDTH * 0.038))
const AVAILABLE_TEXT_WIDTH = CARD_ITEM_WIDTH - (CARD_PADDING * 2) // Text area width

const getResponsiveSize = {
  // Base sizes scaled by screen width (using 375 as base iPhone width)
  scale: (size: number) => (SCREEN_WIDTH / 375) * size,
  // Scale by height for vertical spacing
  scaleHeight: (size: number) => (SCREEN_HEIGHT / 812) * size,
  // Font sizes that adapt to card width (more accurate for text fitting)
  fontSize: {
    // Title: scales based on available card width
    title: Math.max(12, Math.min(15, AVAILABLE_TEXT_WIDTH * 0.08)),
    // Value: scales based on available card width, slightly larger
    value: Math.max(15, Math.min(20, AVAILABLE_TEXT_WIDTH * 0.11)),
    // Subtitle: scales based on available card width
    subtitle: Math.max(9, Math.min(12, AVAILABLE_TEXT_WIDTH * 0.065)),
    // Header: scales based on screen width
    header: Math.max(20, Math.min(26, SCREEN_WIDTH * 0.068)),
    headerSub: Math.max(9, Math.min(12, SCREEN_WIDTH * 0.03)),
  },
  // Icon sizes
  icon: {
    card: Math.max(20, Math.min(26, SCREEN_WIDTH * 0.062)),
    small: Math.max(12, Math.min(15, SCREEN_WIDTH * 0.038)),
  },
  // Spacing
  spacing: {
    cardPadding: CARD_PADDING,
    cardGap: CARD_GAP,
    cardMargin: Math.max(6, Math.min(8, SCREEN_WIDTH * 0.02)),
    sectionGap: Math.max(12, Math.min(16, SCREEN_WIDTH * 0.04)),
  },
}

const CARD_MIN_HEIGHT = Math.max(110, Math.min(140, SCREEN_HEIGHT * 0.15))
const CARD_MAX_HEIGHT = Math.max(130, Math.min(160, SCREEN_HEIGHT * 0.18))

interface HealthCardProps {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  bgGradient: readonly [string, string, ...string[]]
  value?: string
  subtitle?: string
  isReadOnly?: boolean
  onPress?: () => void
}

function HealthCard({
  title,
  icon,
  iconColor,
  bgGradient,
  value,
  subtitle,
  isReadOnly = false,
  onPress,
}: HealthCardProps) {
  const cardPadding = getResponsiveSize.spacing.cardPadding
  const iconSize = getResponsiveSize.icon.card
  const titleFontSize = getResponsiveSize.fontSize.title
  const valueFontSize = getResponsiveSize.fontSize.value
  const subtitleFontSize = getResponsiveSize.fontSize.subtitle
  
  const CardContent = (
      <View
      style={{
        width: CARD_ITEM_WIDTH,
        borderRadius: getResponsiveSize.scale(20),
        overflow: 'hidden',
        marginBottom: getResponsiveSize.spacing.sectionGap,
        backgroundColor: '#FFFFFF',
        borderWidth: 0.5,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 1,
      }}
    >
      <LinearGradient
        colors={bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: cardPadding,
          minHeight: CARD_MIN_HEIGHT,
          justifyContent: 'space-between',
        }}
      >
        {/* Icon */}
        <View style={{ marginBottom: getResponsiveSize.scaleHeight(12) }}>
          <View
            style={{
              width: iconSize + 8,
              height: iconSize + 8,
              borderRadius: (iconSize + 8) / 2,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={iconSize} color={iconColor} />
          </View>
        </View>

        {/* Content Container */}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {/* Title */}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontSize: titleFontSize,
              fontWeight: '500',
              color: '#111827',
              opacity: 0.85,
              marginBottom: getResponsiveSize.scaleHeight(8),
              lineHeight: titleFontSize * 1.35,
              letterSpacing: -0.2,
            }}
          >
            {title}
          </Text>

          {/* Value */}
          {value && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontSize: valueFontSize,
                fontWeight: '600',
                color: '#111827',
                marginBottom: getResponsiveSize.scaleHeight(6),
                lineHeight: valueFontSize * 1.2,
                letterSpacing: -0.3,
              }}
            >
              {value}
            </Text>
          )}

          {/* Subtitle */}
          {subtitle && (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontSize: subtitleFontSize,
                fontWeight: '400',
                color: '#6B7280',
                lineHeight: subtitleFontSize * 1.4,
                letterSpacing: 0.1,
              }}
            >
              {subtitle}
            </Text>
          )}

          {/* Tap to log */}
          {!value && !isReadOnly && (
            <View 
              className="flex-row items-center"
              style={{ marginTop: getResponsiveSize.scaleHeight(10) }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: 'Satoshi-Medium',
                  fontSize: subtitleFontSize + 1,
                  fontWeight: '500',
                  color: iconColor,
                  letterSpacing: 0.2,
                }}
              >
                Tap to log
              </Text>
              <Ionicons
                name="chevron-forward"
                size={getResponsiveSize.icon.small}
                color={iconColor}
                style={{ marginLeft: 4 }}
              />
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  )

  if (isReadOnly || !onPress) {
    return CardContent
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      {CardContent}
    </TouchableOpacity>
  )
}

export default function DailyHealthCheckIn() {
  const textColor = '#111827'
  const secondaryTextColor = '#6B7280'

  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  if (!fontsLoaded) {
    return null
  }

  // Mock data - in real app, this would come from state/context
  const prakritiType = 'Vata-Pitta'
  const dailySymptoms = 'Mild fatigue'
  const digestion = 'Regular'
  const menstrualCycle = { day: 12, state: 'Follicular' } // null if not applicable
  const dietLog = '3 meals logged'
  const hydration = '6 glasses'
  const mentalState = 'Calm & Focused'
  const environmentalContext = 'Home, Sunny'

  const handleCardPress = (cardType: string) => {
    // Handle navigation or modal opening
    console.log(`Pressed: ${cardType}`)
  }

  const headerFontSize = getResponsiveSize.fontSize.header
  const headerSubFontSize = getResponsiveSize.fontSize.headerSub
  const cardGap = getResponsiveSize.spacing.cardGap
  const cardMargin = getResponsiveSize.spacing.cardMargin

  return (
    <View
      style={{
        marginBottom: getResponsiveSize.scaleHeight(24),
        width: CARD_WIDTH,
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: getResponsiveSize.scaleHeight(16) }}>
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
          Today's Health Overview Cards
        </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '400',
            color: secondaryTextColor,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: headerSubFontSize,
            marginBottom: getResponsiveSize.scaleHeight(4),
          }}
        >
          Manual Tracking Only
        </Text>
      </View>

      {/* 2-Column Grid */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: -cardMargin,
        }}
      >
        {/* Prakriti Type - Read-only */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Prakriti Type"
            icon="leaf"
            iconColor="#10B981"
            bgGradient={['#FAFCF9', '#F7FAF4', '#F2F7ED']}
            value={prakritiType}
            subtitle="Your constitution"
            isReadOnly={true}
          />
        </View>

        {/* Daily Symptoms (Vikruti) */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Daily Symptoms"
            icon="medical"
            iconColor="#F59E0B"
            bgGradient={['#FFFDF9', '#FFFBF5', '#FFF9F0']}
            value={dailySymptoms}
            subtitle="Vikruti tracking"
            onPress={() => handleCardPress('symptoms')}
          />
        </View>

        {/* Digestion / Bowel Movement */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Digestion"
            icon="restaurant"
            iconColor="#8B5CF6"
            bgGradient={['#FCFBFF', '#FAF9FE', '#F7F5FD']}
            value={digestion}
            subtitle="Bowel movement quality"
            onPress={() => handleCardPress('digestion')}
          />
        </View>

        {/* Menstrual Cycle */}
        {menstrualCycle ? (
          <View style={{ marginHorizontal: cardMargin }}>
            <HealthCard
              title="Menstrual Cycle"
              icon="flower"
              iconColor="#EC4899"
              bgGradient={['#FFFDFB', '#FFFBF8', '#FFF9F4']}
              value={`Day ${menstrualCycle.day} • ${menstrualCycle.state}`}
              subtitle="Cycle tracking"
              onPress={() => handleCardPress('menstrual')}
            />
          </View>
        ) : (
          <View style={{ marginHorizontal: cardMargin }}>
            <HealthCard
              title="Menstrual Cycle"
              icon="flower"
              iconColor="#EC4899"
              bgGradient={['#FFFDFB', '#FFFBF8', '#FFF9F4']}
              subtitle="Not applicable"
              isReadOnly={true}
            />
          </View>
        )}

        {/* Diet Log */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Diet Log"
            icon="nutrition"
            iconColor="#F97316"
            bgGradient={['#FFFBF9', '#FFF8F5', '#FFF5F0']}
            value={dietLog}
            subtitle="Meals today"
            onPress={() => handleCardPress('diet')}
          />
        </View>

        {/* Hydration Intake */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Hydration"
            icon="water"
            iconColor="#06B6D4"
            bgGradient={['#FAFCFF', '#F7FAFE', '#F4F7FD']}
            value={hydration}
            subtitle="Water intake"
            onPress={() => handleCardPress('hydration')}
          />
        </View>

        {/* Mental State / Emotional Check */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Mental State"
            icon="heart"
            iconColor="#EF4444"
            bgGradient={['#FFFBFB', '#FFF9F9', '#FFF7F7']}
            value={mentalState}
            subtitle="Emotional check"
            onPress={() => handleCardPress('mental')}
          />
        </View>

        {/* Environmental Context */}
        <View style={{ marginHorizontal: cardMargin }}>
          <HealthCard
            title="Environment"
            icon="sunny"
            iconColor="#EAB308"
            bgGradient={['#FFFEF9', '#FFFDF7', '#FFFCF4']}
            value={environmentalContext}
            subtitle="Context today"
            onPress={() => handleCardPress('environment')}
          />
        </View>
      </View>
    </View>
  )
}
