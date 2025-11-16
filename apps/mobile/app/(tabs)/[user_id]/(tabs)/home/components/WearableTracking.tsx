import { Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { useFonts } from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Polyline, Path } from 'react-native-svg'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2 // 24px padding each side, 12px gap
const FULL_CARD_WIDTH = SCREEN_WIDTH - 48 // Full width minus padding

interface HealthCardProps {
  title: string
  value: string
  unit?: string
  status?: string
  icon: keyof typeof Ionicons.glyphMap
  bgColor: string
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
  bgColor,
  iconColor,
  showGraph = false,
  showProgress = false,
  progressValue = 0,
}: HealthCardProps) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{
        width: CARD_WIDTH,
        backgroundColor: bgColor,
        // Shadows removed
      }}
    >
      {/* Header */}
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View
            className="h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
          <Text
            className="ml-2 text-sm"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: '#111827',
            }}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Graph or Content */}
      {showGraph && (
        <View className="mb-3" style={{ height: 60 }}>
          <Svg width="100%" height={60} viewBox="0 0 200 60">
            <Polyline
              points="0,40 20,35 40,30 60,25 80,20 100,25 120,30 140,35 160,30 180,25 200,20"
              fill="none"
              stroke={iconColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}

      {/* Value */}
      <View className="mb-1">
        <View className="flex-row items-baseline">
          <Text
            className="text-2xl"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            {value}
          </Text>
          {unit && (
            <Text
              className="ml-1 text-sm"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '400',
                color: '#6B7280',
              }}
            >
              {unit}
            </Text>
          )}
        </View>
      </View>

      {/* Status or Progress */}
      {status && (
        <Text
          className="text-xs"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '400',
            color: '#6B7280',
          }}
        >
          {status}
        </Text>
      )}

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

  return (
    <View
      className="rounded-2xl p-5"
      style={{
        width: FULL_CARD_WIDTH,
        backgroundColor: '#F0FDF4',
        // Shadows removed
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {/* White circle with heart icon */}
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
          <Text
            className="ml-3 text-base"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: '#111827',
            }}
          >
            Health Score
          </Text>
        </View>
        {/* Status Pill */}
        <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: '#16A34A' }}>
          <Text
            className="text-xs"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: '#FFFFFF',
            }}
          >
            You are Good!
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text
          className="flex-1 text-lg"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '500',
            color: '#111827',
          }}
        >
          Keep your body healthy !
        </Text>
        <Text
          className="ml-4 text-3xl"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          94%
        </Text>
      </View>

      {/* Progress Bar - 3 segments representing 94% */}
      <View className="flex-row" style={{ gap: 4 }}>
        {/* First segment - filled darker green */}
        <View
          className="h-2 rounded-full"
          style={{
            backgroundColor: '#22C55E',
            flex: 1,
          }}
        />
        {/* Second segment - filled darker green */}
        <View
          className="h-2 rounded-full"
          style={{
            backgroundColor: '#22C55E',
            flex: 1,
          }}
        />
        {/* Third segment - filled lighter green (representing ~94% completion) */}
        <View
          className="h-2 rounded-full"
          style={{
            backgroundColor: '#86EFAC',
            flex: 1,
          }}
        />
      </View>
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
  bgColor,
  iconColor,
}: {
  title: string
  value: string
  unit?: string
  status?: string
  icon: keyof typeof Ionicons.glyphMap
  bgColor: string
  iconColor: string
}) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{
        width: FULL_CARD_WIDTH,
        backgroundColor: bgColor,
        // Shadows removed
      }}
    >
      {/* Header */}
      <View className="mb-3 flex-row items-start justify-between">
        <View className="flex-row items-center">
          <View
            className="h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
          <Text
            className="ml-2 text-sm"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '500',
              color: '#111827',
            }}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Value */}
      <View className="mb-1">
        <View className="flex-row items-baseline">
          <Text
            className="text-2xl"
            style={{
              fontFamily: 'Satoshi-Medium',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            {value}
          </Text>
          {unit && (
            <Text
              className="ml-1 text-sm"
              style={{
                fontFamily: 'Satoshi-Medium',
                fontWeight: '400',
                color: '#6B7280',
              }}
            >
              {unit}
            </Text>
          )}
        </View>
      </View>

      {/* Status */}
      {status && (
        <Text
          className="text-xs"
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '400',
            color: '#6B7280',
          }}
        >
          {status}
        </Text>
      )}
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
        Your Energy, In Real Time
      </Text>
      <Text
        className="mb-6 text-base leading-6"
        style={{
          color: secondaryTextColor,
          letterSpacing: 0.2,
        }}
      >
        Gentle insights from your body in real time.
      </Text>

      {/* Health Metrics Grid */}
      <View style={{ gap: 12 }}>
        {/* Row 1: Heart Rate and HRV */}
        <View className="flex-row" style={{ gap: 12 }}>
          <HealthCard
            title="Heart Rate"
            value="86"
            unit="bpm"
            icon="heart"
            bgColor="#E0F2FE"
            iconColor="#0EA5E9"
            showGraph={true}
          />
          <HealthCard
            title="HRV"
            value="42"
            unit="ms"
            status="Normal"
            icon="pulse"
            bgColor="#F0FDF4"
            iconColor="#22C55E"
          />
        </View>

        {/* Row 2: Health Score (Full Width) */}
        <HealthScoreCard />

        {/* Row 3: Stress Score and Sleep Score */}
        <View className="flex-row" style={{ gap: 12 }}>
          <HealthCard
            title="Stress Score"
            value="24"
            unit="/100"
            status="Low Stress"
            icon="leaf"
            bgColor="#FEF3C7"
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
            bgColor="#E9D5FF"
            iconColor="#A855F7"
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
            bgColor="#FEE2E2"
            iconColor="#EF4444"
          />
        </View>
      </View>
    </View>
  )
}
