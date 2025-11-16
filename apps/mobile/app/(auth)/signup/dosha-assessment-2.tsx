import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

const { width, height } = Dimensions.get('window')

// Second 6 questions for page 2
const DOSHA_QUESTIONS_PAGE_2 = [
  {
    id: 'mind',
    label: 'Mind',
    options: [
      { label: 'Fast', value: 'fast' },
      { label: 'Sharp', value: 'sharp' },
      { label: 'Stable', value: 'stable' },
    ],
  },
  {
    id: 'hairTexture',
    label: 'Hair Texture',
    options: [
      { label: 'Dry', value: 'dry' },
      { label: 'Straight', value: 'straight' },
      { label: 'Thick', value: 'thick' },
    ],
  },
  {
    id: 'appetite',
    label: 'Appetite',
    options: [
      { label: 'Variable', value: 'variable' },
      { label: 'Strong', value: 'strong' },
      { label: 'Moderate', value: 'moderate' },
    ],
  },
  {
    id: 'energy',
    label: 'Energy Level',
    options: [
      { label: 'Variable', value: 'variable' },
      { label: 'Intense', value: 'intense' },
      { label: 'Steady', value: 'steady' },
    ],
  },
  {
    id: 'weight',
    label: 'Weight Tendency',
    options: [
      { label: 'Hard to Gain', value: 'hard_to_gain' },
      { label: 'Easy to Gain', value: 'easy_to_gain' },
      { label: 'Stable', value: 'stable' },
    ],
  },
  {
    id: 'movement',
    label: 'Movement Style',
    options: [
      { label: 'Quick', value: 'quick' },
      { label: 'Moderate', value: 'moderate' },
      { label: 'Slow', value: 'slow' },
    ],
  },
]

export default function DoshaAssessmentScreen2() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const params = useLocalSearchParams()

  // Store page 1 answers separately
  const [page1Answers, setPage1Answers] = useState<Record<string, string>>({})
  // Store page 2 answers
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    if (params.answers && typeof params.answers === 'string') {
      try {
        const parsed = JSON.parse(params.answers)
        setPage1Answers(parsed)
      } catch (e) {
        console.error('Error parsing answers:', e)
      }
    }
  }, [params.answers])

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const inputBgColor = isDark ? '#1F1F1F' : '#FFFFFF'
  const inputBorderColor = isDark ? '#2F2F2F' : '#E5E7EB'
  const primaryColor = '#2563EB'

  const handleOptionSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleContinue = () => {
    // Navigate to health profile page
    router.push('/(auth)/signup/health-profile')
  }

  const isFormComplete = DOSHA_QUESTIONS_PAGE_2.every((question) => answers[question.id])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View
        className="flex-1 items-center justify-center px-5"
        style={{ backgroundColor, minHeight: height }}
      >
        <View style={{ width: '100%', maxWidth: width * 0.9 }}>
          {/* Title Section */}
          <View className="mb-6 items-center">
            <Text
              className="text-center text-2xl font-bold"
              style={{ color: textColor, letterSpacing: -0.3 }}
            >
              Find Your Dosha
            </Text>
            <Text
              className="mt-1.5 text-center text-sm"
              style={{ color: secondaryTextColor, lineHeight: 20 }}
            >
              Answer these questions to discover your Ayurvedic constitution
            </Text>
            <View className="mt-3 flex-row gap-2">
              <View
                className="h-1 rounded-full"
                style={{ width: 20, backgroundColor: primaryColor }}
              />
              <View
                className="h-1 rounded-full"
                style={{ width: 20, backgroundColor: primaryColor }}
              />
            </View>
          </View>

          {/* Questions */}
          <View className="mb-6 gap-4">
            {DOSHA_QUESTIONS_PAGE_2.map((question) => (
              <View key={question.id}>
                <Text
                  className="mb-2.5 text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  {question.label}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option.value
                    return (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => handleOptionSelect(question.id, option.value)}
                        activeOpacity={0.7}
                        className="rounded-xl px-4 py-2.5"
                        style={{
                          backgroundColor: isSelected ? primaryColor : inputBgColor,
                          borderWidth: 1,
                          borderColor: isSelected ? primaryColor : inputBorderColor,
                          minWidth: question.options.length === 2 ? '48%' : '31%',
                        }}
                      >
                        <Text
                          className="text-center text-sm font-medium"
                          style={{
                            color: isSelected ? '#FFFFFF' : textColor,
                          }}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isFormComplete}
            activeOpacity={0.85}
            className="items-center justify-center rounded-2xl py-3.5"
            style={{
              backgroundColor: isFormComplete ? primaryColor : inputBorderColor,
              shadowColor: isFormComplete ? primaryColor : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isFormComplete ? 0.3 : 0,
              shadowRadius: 8,
              elevation: isFormComplete ? 8 : 0,
            }}
          >
            <Text className="text-base font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
