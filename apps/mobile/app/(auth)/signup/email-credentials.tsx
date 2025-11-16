import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

export default function EmailCredentialsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const params = useLocalSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Set email from route params
  useEffect(() => {
    if (params.email && typeof params.email === 'string') {
      setEmail(params.email)
    }
  }, [params.email])

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const inputBgColor = isDark ? '#1F1F1F' : '#FFFFFF'
  const inputBorderColor = isDark ? '#2F2F2F' : '#E5E7EB'
  const primaryColor = '#2563EB'

  // Handlers
  const handleNext = () => {
    // Navigate to personal details page with email
    // Validation removed for now - fields are not required
    router.push({
      pathname: './personal-details',
      params: { email },
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor, minHeight: height }}
      >
        <View style={{ width: '100%', maxWidth: width * 0.9 }}>
          {/* Title Section */}
          <View className="mb-8">
            <Text
              className="text-2xl font-bold"
              style={{ color: textColor, letterSpacing: -0.5 }}
            >
              Continue with Email
            </Text>
          </View>

          {/* Form Fields */}
          <View className="mb-6 gap-4">
            {/* Email Input */}
            <View>
              <Text className="mb-2 text-sm" style={{ color: secondaryTextColor }}>
                Email
              </Text>
              <TextInput
                className="rounded-2xl px-4 py-4 text-base"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                  color: textColor,
                }}
                placeholder="m@example.com"
                placeholderTextColor={secondaryTextColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="mb-2 text-sm" style={{ color: secondaryTextColor }}>
                Password
              </Text>
              <View
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                }}
              >
                <TextInput
                  className="flex-1 py-4 text-base"
                  style={{ color: textColor }}
                  placeholder="Enter Password"
                  placeholderTextColor={secondaryTextColor}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={secondaryTextColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="mb-2 text-sm" style={{ color: secondaryTextColor }}>
                Confirm Password
              </Text>
              <View
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                }}
              >
                <TextInput
                  className="flex-1 py-4 text-base"
                  style={{ color: textColor }}
                  placeholder="Confirm Password"
                  placeholderTextColor={secondaryTextColor}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={secondaryTextColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.85}
            className="items-center justify-center rounded-2xl py-4"
            style={{
              backgroundColor: primaryColor,
              shadowColor: primaryColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-base font-semibold text-white">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
