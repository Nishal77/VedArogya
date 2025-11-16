import { router } from 'expo-router'
import { useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

const { width, height } = Dimensions.get('window')

const EXISTING_CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'bp', label: 'BP' },
  { id: 'cholesterol', label: 'Cholesterol' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'pcos', label: 'PCOS (if female)' },
  { id: 'none', label: 'None' },
]

export default function HealthProfileScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  const [existingConditions, setExistingConditions] = useState<string[]>([])
  const [currentMedications, setCurrentMedications] = useState('')
  const [allergies, setAllergies] = useState('')
  const [foodPreference, setFoodPreference] = useState('')
  const [smoking, setSmoking] = useState('')
  const [alcohol, setAlcohol] = useState('')

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const inputBgColor = isDark ? '#1F1F1F' : '#FFFFFF'
  const inputBorderColor = isDark ? '#2F2F2F' : '#E5E7EB'
  const primaryColor = '#2563EB'

  const handleConditionToggle = (conditionId: string) => {
    if (conditionId === 'none') {
      // If "None" is selected, clear all other selections
      setExistingConditions(['none'])
    } else {
      // Remove "none" if any other condition is selected
      const updatedConditions = existingConditions.filter((id) => id !== 'none')

      if (updatedConditions.includes(conditionId)) {
        // Deselect if already selected
        setExistingConditions(updatedConditions.filter((id) => id !== conditionId))
      } else {
        // Select the condition
        setExistingConditions([...updatedConditions, conditionId])
      }
    }
  }

  const handleContinue = () => {
    // Navigate to summary page
    router.push('/(auth)/signup/summary')
  }

  const isFormComplete =
    existingConditions.length > 0 &&
    foodPreference !== '' &&
    smoking !== '' &&
    alcohol !== ''

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex-1 items-center justify-center px-5 py-6"
          style={{ backgroundColor, minHeight: height }}
        >
          <View style={{ width: '100%', maxWidth: width * 0.9 }}>
            {/* Title Section */}
            <View className="mb-6 items-center">
              <Text
                className="text-center text-2xl font-bold"
                style={{ color: textColor, letterSpacing: -0.3 }}
              >
                Your Health Profile
              </Text>
              <Text
                className="mt-1.5 text-center text-sm"
                style={{ color: secondaryTextColor, lineHeight: 20 }}
              >
                Medical + preference info
              </Text>
            </View>

            {/* Existing Conditions */}
            <View className="mb-4">
              <Text className="mb-2.5 text-sm font-semibold" style={{ color: textColor }}>
                Existing Conditions
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {EXISTING_CONDITIONS.map((condition) => {
                  const isSelected = existingConditions.includes(condition.id)
                  return (
                    <TouchableOpacity
                      key={condition.id}
                      onPress={() => handleConditionToggle(condition.id)}
                      activeOpacity={0.7}
                      className="rounded-xl px-4 py-2.5"
                      style={{
                        backgroundColor: isSelected ? primaryColor : inputBgColor,
                        borderWidth: 1,
                        borderColor: isSelected ? primaryColor : inputBorderColor,
                        minWidth: '31%',
                      }}
                    >
                      <Text
                        className="text-center text-sm font-medium"
                        style={{
                          color: isSelected ? '#FFFFFF' : textColor,
                        }}
                      >
                        {condition.label}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Current Medications */}
            <View className="mb-4">
              <Text className="mb-2.5 text-sm font-semibold" style={{ color: textColor }}>
                Current Medications
              </Text>
              <TextInput
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                  color: textColor,
                  minHeight: 44,
                }}
                placeholder="List your current medications"
                placeholderTextColor={secondaryTextColor}
                value={currentMedications}
                onChangeText={setCurrentMedications}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Allergies */}
            <View className="mb-4">
              <Text className="mb-2.5 text-sm font-semibold" style={{ color: textColor }}>
                Allergies
              </Text>
              <TextInput
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                  color: textColor,
                  minHeight: 44,
                }}
                placeholder="List any allergies"
                placeholderTextColor={secondaryTextColor}
                value={allergies}
                onChangeText={setAllergies}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Food Preference */}
            <View className="mb-4">
              <Text className="mb-2.5 text-sm font-semibold" style={{ color: textColor }}>
                Food Preference
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['Veg', 'Non-veg', 'Vegan'].map((option) => {
                  const isSelected = foodPreference === option.toLowerCase()
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setFoodPreference(option.toLowerCase())}
                      activeOpacity={0.7}
                      className="rounded-xl px-4 py-2.5"
                      style={{
                        backgroundColor: isSelected ? primaryColor : inputBgColor,
                        borderWidth: 1,
                        borderColor: isSelected ? primaryColor : inputBorderColor,
                        minWidth: '31%',
                      }}
                    >
                      <Text
                        className="text-center text-sm font-medium"
                        style={{
                          color: isSelected ? '#FFFFFF' : textColor,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Smoking */}
            <View className="mb-4">
              <Text className="mb-2.5 text-sm font-semibold" style={{ color: textColor }}>
                Smoking
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['Yes', 'No'].map((option) => {
                  const isSelected = smoking === option.toLowerCase()
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSmoking(option.toLowerCase())}
                      activeOpacity={0.7}
                      className="rounded-xl px-4 py-2.5"
                      style={{
                        backgroundColor: isSelected ? primaryColor : inputBgColor,
                        borderWidth: 1,
                        borderColor: isSelected ? primaryColor : inputBorderColor,
                        minWidth: '48%',
                      }}
                    >
                      <Text
                        className="text-center text-sm font-medium"
                        style={{
                          color: isSelected ? '#FFFFFF' : textColor,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Alcohol */}
            <View className="mb-6">
              <Text className="mb-2.5 text-sm font-semibold" style={{ color: textColor }}>
                Alcohol
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['Yes', 'No'].map((option) => {
                  const isSelected = alcohol === option.toLowerCase()
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setAlcohol(option.toLowerCase())}
                      activeOpacity={0.7}
                      className="rounded-xl px-4 py-2.5"
                      style={{
                        backgroundColor: isSelected ? primaryColor : inputBgColor,
                        borderWidth: 1,
                        borderColor: isSelected ? primaryColor : inputBorderColor,
                        minWidth: '48%',
                      }}
                    >
                      <Text
                        className="text-center text-sm font-medium"
                        style={{
                          color: isSelected ? '#FFFFFF' : textColor,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!isFormComplete}
              activeOpacity={0.85}
              className="mb-6 items-center justify-center rounded-2xl py-3.5"
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
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
