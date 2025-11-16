import { router } from 'expo-router'
import { useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'

const { width, height } = Dimensions.get('window')

export default function SummaryScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Mock data for UI demonstration - in real app, this would come from state management or backend
  const [personalDetails] = useState<any>({
    fullName: 'John Doe',
    age: '25',
    dateOfBirth: new Date('1999-01-15'),
    gender: 'male',
    userHeight: '170',
    weight: '70',
    selectedCountry: { dialCode: '+91' },
    phoneNumber: '9876543210',
    cityState: 'Bengaluru, Karnataka',
  })

  const [lifestyleDetails] = useState<any>({
    sleep: 'late',
    appetite: 'medium',
    digestion: 'normal',
    energy: 'medium',
    stress: 'medium',
    waterIntake: 'medium',
    physicalActivity: 'yes',
    jobNature: 'standing',
  })

  const [doshaAnswers] = useState<any>({
    bodyType: 'medium',
    skin: 'sensitive',
    digestion: 'strong',
    sleep: 'medium',
    temperaturePreference: 'neutral',
    stressResponse: 'irritable',
    mind: 'sharp',
    hairTexture: 'straight',
    appetite: 'strong',
    energy: 'intense',
    weight: 'easy_to_gain',
    movement: 'moderate',
  })

  const [healthProfile] = useState<any>({
    existingConditions: ['diabetes', 'bp'],
    currentMedications: 'Metformin, Lisinopril',
    allergies: 'Peanuts',
    foodPreference: 'veg',
    smoking: 'no',
    alcohol: 'no',
  })

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const inputBgColor = isDark ? '#1F1F1F' : '#FFFFFF'
  const inputBorderColor = isDark ? '#2F2F2F' : '#E5E7EB'
  const primaryColor = '#2563EB'
  const sectionBgColor = isDark ? '#1F1F1F' : '#F9FAFB'

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const calculateDosha = () => {
    // Simple dosha calculation based on answers
    // This is a simplified version - you can implement a more sophisticated algorithm
    let vata = 0
    let pitta = 0
    let kapha = 0

    // Map answers to dosha scores (simplified)
    Object.entries(doshaAnswers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Add scoring logic based on question and answer
        // This is a placeholder - implement actual dosha calculation
        if (key.includes('bodyType') && value === 'thin') vata += 2
        if (key.includes('bodyType') && value === 'broad') kapha += 2
        if (key.includes('skin') && value === 'dry') vata += 1
        if (key.includes('skin') && value === 'sensitive') pitta += 1
        if (key.includes('skin') && value === 'oily') kapha += 1
        // Add more mappings...
      }
    })

    const doshas = [
      { name: 'Vata', score: vata },
      { name: 'Pitta', score: pitta },
      { name: 'Kapha', score: kapha },
    ].sort((a, b) => b.score - a.score)

    return {
      primary: doshas[0]?.name || 'Unknown',
      secondary: doshas[1]?.name || 'Unknown',
      scores: doshas,
    }
  }

  const doshaResult = calculateDosha()

  const handleFinishSetup = () => {
    // TODO: Submit all data to backend
    console.log('Finalizing setup with:', {
      personalDetails,
      lifestyleDetails,
      doshaAnswers,
      healthProfile,
    })
    // Navigate to main app with user_id
    // TODO: Replace with actual user_id from backend
    router.replace('/(tabs)/user123/(tabs)')
  }

  const InfoRow = ({
    label,
    value,
  }: {
    label: string
    value: string | null | undefined
  }) => {
    if (!value) return null
    return (
      <View
        className="flex-row justify-between border-b py-2"
        style={{ borderBottomColor: inputBorderColor }}
      >
        <Text className="text-sm" style={{ color: secondaryTextColor }}>
          {label}
        </Text>
        <Text className="text-sm font-medium" style={{ color: textColor }}>
          {value}
        </Text>
      </View>
    )
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-4 rounded-2xl p-4" style={{ backgroundColor: sectionBgColor }}>
      <Text className="mb-3 text-base font-bold" style={{ color: textColor }}>
        {title}
      </Text>
      {children}
    </View>
  )

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex-1 items-center px-5 py-6"
          style={{ backgroundColor, minHeight: height }}
        >
          <View style={{ width: '100%', maxWidth: width * 0.9 }}>
            {/* Title Section */}
            <View className="mb-6 items-center">
              <Text
                className="text-center text-2xl font-bold"
                style={{ color: textColor, letterSpacing: -0.3 }}
              >
                Review Your Details
              </Text>
              <Text
                className="mt-1.5 text-center text-sm"
                style={{ color: secondaryTextColor, lineHeight: 20 }}
              >
                Review everything before finalizing
              </Text>
            </View>

            {/* Basic Info Section */}
            <Section title="Basic Info">
              <InfoRow label="Name" value={personalDetails.fullName} />
              <InfoRow label="Age" value={personalDetails.age} />
              <InfoRow
                label="Date of Birth"
                value={
                  personalDetails.dateOfBirth
                    ? formatDate(new Date(personalDetails.dateOfBirth))
                    : null
                }
              />
              <InfoRow
                label="Gender"
                value={
                  personalDetails.gender
                    ? personalDetails.gender.charAt(0).toUpperCase() +
                      personalDetails.gender.slice(1)
                    : null
                }
              />
              <InfoRow
                label="Height"
                value={
                  personalDetails.userHeight ? `${personalDetails.userHeight} cm` : null
                }
              />
              <InfoRow
                label="Weight"
                value={personalDetails.weight ? `${personalDetails.weight} kg` : null}
              />
              <InfoRow
                label="Phone"
                value={
                  personalDetails.phoneNumber
                    ? `${personalDetails.selectedCountry?.dialCode || ''} ${personalDetails.phoneNumber}`
                    : null
                }
              />
              <InfoRow label="City/State" value={personalDetails.cityState} />
            </Section>

            {/* Lifestyle Summary Section */}
            <Section title="Lifestyle Summary">
              {lifestyleDetails.sleep && (
                <InfoRow
                  label="Sleep Pattern"
                  value={
                    lifestyleDetails.sleep.charAt(0).toUpperCase() +
                    lifestyleDetails.sleep.slice(1)
                  }
                />
              )}
              {lifestyleDetails.appetite && (
                <InfoRow
                  label="Appetite"
                  value={
                    lifestyleDetails.appetite.charAt(0).toUpperCase() +
                    lifestyleDetails.appetite.slice(1)
                  }
                />
              )}
              {lifestyleDetails.digestion && (
                <InfoRow
                  label="Digestion"
                  value={
                    lifestyleDetails.digestion.charAt(0).toUpperCase() +
                    lifestyleDetails.digestion.slice(1)
                  }
                />
              )}
              {lifestyleDetails.energy && (
                <InfoRow
                  label="Energy"
                  value={
                    lifestyleDetails.energy.charAt(0).toUpperCase() +
                    lifestyleDetails.energy.slice(1)
                  }
                />
              )}
              {lifestyleDetails.stress && (
                <InfoRow
                  label="Stress"
                  value={
                    lifestyleDetails.stress.charAt(0).toUpperCase() +
                    lifestyleDetails.stress.slice(1)
                  }
                />
              )}
              {lifestyleDetails.waterIntake && (
                <InfoRow
                  label="Water Intake"
                  value={
                    lifestyleDetails.waterIntake.charAt(0).toUpperCase() +
                    lifestyleDetails.waterIntake.slice(1)
                  }
                />
              )}
              {lifestyleDetails.physicalActivity && (
                <InfoRow
                  label="Physical Activity"
                  value={
                    lifestyleDetails.physicalActivity.charAt(0).toUpperCase() +
                    lifestyleDetails.physicalActivity.slice(1)
                  }
                />
              )}
              {lifestyleDetails.jobNature && (
                <InfoRow
                  label="Job Nature"
                  value={lifestyleDetails.jobNature
                    .replace('_', ' ')
                    .split(' ')
                    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')}
                />
              )}
              {Object.keys(lifestyleDetails).length === 0 && (
                <Text className="text-sm" style={{ color: secondaryTextColor }}>
                  No lifestyle details provided
                </Text>
              )}
            </Section>

            {/* Dosha Summary Section */}
            <Section title="Dosha Summary">
              <View
                className="flex-row justify-between border-b py-2"
                style={{ borderBottomColor: inputBorderColor }}
              >
                <Text className="text-sm" style={{ color: secondaryTextColor }}>
                  Primary Dosha
                </Text>
                <Text className="text-sm font-bold" style={{ color: primaryColor }}>
                  {doshaResult.primary}
                </Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-sm" style={{ color: secondaryTextColor }}>
                  Secondary Dosha
                </Text>
                <Text className="text-sm font-medium" style={{ color: textColor }}>
                  {doshaResult.secondary}
                </Text>
              </View>
            </Section>

            {/* Health Profile Summary Section */}
            <Section title="Health Profile Summary">
              <View
                className="border-b py-2"
                style={{ borderBottomColor: inputBorderColor }}
              >
                <Text className="mb-2 text-sm" style={{ color: secondaryTextColor }}>
                  Existing Conditions
                </Text>
                <Text className="text-sm font-medium" style={{ color: textColor }}>
                  {healthProfile.existingConditions?.length > 0
                    ? healthProfile.existingConditions.join(', ')
                    : 'None'}
                </Text>
              </View>
              <InfoRow
                label="Current Medications"
                value={healthProfile.currentMedications || 'None'}
              />
              <InfoRow label="Allergies" value={healthProfile.allergies || 'None'} />
              <InfoRow
                label="Food Preference"
                value={
                  healthProfile.foodPreference
                    ? healthProfile.foodPreference.charAt(0).toUpperCase() +
                      healthProfile.foodPreference.slice(1)
                    : null
                }
              />
              <InfoRow
                label="Smoking"
                value={
                  healthProfile.smoking
                    ? healthProfile.smoking.charAt(0).toUpperCase() +
                      healthProfile.smoking.slice(1)
                    : null
                }
              />
              <InfoRow
                label="Alcohol"
                value={
                  healthProfile.alcohol
                    ? healthProfile.alcohol.charAt(0).toUpperCase() +
                      healthProfile.alcohol.slice(1)
                    : null
                }
              />
            </Section>

            {/* Finish Setup Button */}
            <TouchableOpacity
              onPress={handleFinishSetup}
              activeOpacity={0.85}
              className="mb-6 mt-6 items-center justify-center rounded-2xl py-3.5"
              style={{
                backgroundColor: primaryColor,
                shadowColor: primaryColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-base font-semibold text-white">Finish Setup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
