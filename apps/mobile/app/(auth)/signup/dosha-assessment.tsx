import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
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

// First 6 questions for page 1
const DOSHA_QUESTIONS_PAGE_1 = [
  {
    id: 'bodyType',
    label: 'Body Type',
    options: [
      { label: 'Thin', value: 'thin' },
      { label: 'Medium', value: 'medium' },
      { label: 'Broad', value: 'broad' },
    ],
  },
  {
    id: 'skin',
    label: 'Skin',
    options: [
      { label: 'Dry', value: 'dry' },
      { label: 'Sensitive', value: 'sensitive' },
      { label: 'Oily', value: 'oily' },
    ],
  },
  {
    id: 'digestion',
    label: 'Digestion',
    options: [
      { label: 'Irregular', value: 'irregular' },
      { label: 'Strong', value: 'strong' },
      { label: 'Slow', value: 'slow' },
    ],
  },
  {
    id: 'sleep',
    label: 'Sleep',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Medium', value: 'medium' },
      { label: 'Deep', value: 'deep' },
    ],
  },
  {
    id: 'temperaturePreference',
    label: 'Temperature Preference',
    options: [
      { label: 'Cold', value: 'cold' },
      { label: 'Neutral', value: 'neutral' },
      { label: 'Warm', value: 'warm' },
    ],
  },
  {
    id: 'stressResponse',
    label: 'Stress Response',
    options: [
      { label: 'Anxious', value: 'anxious' },
      { label: 'Irritable', value: 'irritable' },
      { label: 'Calm', value: 'calm' },
    ],
  },
]

export default function DoshaAssessmentScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const params = useLocalSearchParams()

  const [answers, setAnswers] = useState<Record<string, string>>({})

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

  const handleNext = () => {
    // Navigate to second page with current answers
    router.push({
      pathname: '/(auth)/signup/dosha-assessment-2',
      params: {
        answers: JSON.stringify(answers),
      },
    })
  }

  const isFormComplete = DOSHA_QUESTIONS_PAGE_1.every((question) => answers[question.id])

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
                style={{ width: 20, backgroundColor: inputBorderColor }}
              />
            </View>
          </View>

          {/* Questions */}
          <View className="mb-6 gap-4">
            {DOSHA_QUESTIONS_PAGE_1.map((question) => (
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

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
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
            <Text className="text-base font-semibold text-white">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
