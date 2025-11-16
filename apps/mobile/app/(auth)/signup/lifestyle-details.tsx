import { router } from 'expo-router'
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

type LifestyleOption = {
  label: string
  value: string
}

const LIFESTYLE_QUESTIONS = [
  {
    id: 'sleep',
    label: 'Sleep Pattern',
    options: [
      { label: 'Early', value: 'early' },
      { label: 'Late', value: 'late' },
      { label: 'Irregular', value: 'irregular' },
    ],
  },
  {
    id: 'appetite',
    label: 'Appetite',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    id: 'digestion',
    label: 'Digestion',
    options: [
      { label: 'Slow', value: 'slow' },
      { label: 'Normal', value: 'normal' },
      { label: 'Fast', value: 'fast' },
    ],
  },
  {
    id: 'energy',
    label: 'Energy',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    id: 'stress',
    label: 'Stress',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    id: 'waterIntake',
    label: 'Water Intake',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    id: 'physicalActivity',
    label: 'Physical Activity',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  },
  {
    id: 'jobNature',
    label: 'Job Nature',
    options: [
      { label: 'Sitting', value: 'sitting' },
      { label: 'Standing', value: 'standing' },
      { label: 'Field Work', value: 'field_work' },
    ],
  },
]

export default function LifestyleDetailsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

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

  const handleContinue = () => {
    // Navigate to dosha assessment page
    router.push('/(auth)/signup/dosha-assessment')
  }

  const isFormComplete = LIFESTYLE_QUESTIONS.every((question) => answers[question.id])

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
              Your Lifestyle
            </Text>
            <Text
              className="mt-1.5 text-center text-sm"
              style={{ color: secondaryTextColor, lineHeight: 20 }}
            >
              Ayurveda is lifestyle-driven, so this page matters.
            </Text>
          </View>

          {/* Questions */}
          <View className="mb-6 gap-4">
            {LIFESTYLE_QUESTIONS.map((question) => (
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
