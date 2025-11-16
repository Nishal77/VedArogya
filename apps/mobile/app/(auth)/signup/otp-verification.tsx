import { router, useLocalSearchParams } from 'expo-router'
import { useRef, useState } from 'react'
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

export default function OTPVerificationScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const params = useLocalSearchParams()
  const email = (params.email as string) || 'your email'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(TextInput | null)[]>([])

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const inputBgColor = isDark ? '#1F1F1F' : '#FFFFFF'
  const inputBorderColor = isDark ? '#2F2F2F' : '#E5E7EB'
  const primaryColor = '#2563EB'

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedOtp.forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newOtp[index + i] = char
        }
      })
      setOtp(newOtp)
      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + pastedOtp.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    if (!/^\d$/.test(value) && value !== '') return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle verify
  const handleVerify = () => {
    const otpString = otp.join('')
    if (otpString.length === 6) {
      // TODO: Verify OTP with backend
      console.log('Verifying OTP:', otpString)
      // Navigate to lifestyle details page
      router.push('/(auth)/signup/lifestyle-details')
    }
  }

  // Handle resend OTP
  const handleResendOtp = () => {
    // TODO: Resend OTP to email
    console.log('Resending OTP to:', email)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
  }

  // Handle edit email
  const handleEditEmail = () => {
    router.back()
  }

  const isOtpComplete = otp.every((digit) => digit !== '')

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
          <View className="mb-4 items-center">
            <Text
              className="mb-3 text-center text-3xl font-bold"
              style={{ color: textColor, letterSpacing: -0.5 }}
            >
              Verify Your Email
            </Text>
            <Text
              className="text-center text-base"
              style={{ color: secondaryTextColor, lineHeight: 22 }}
            >
              Enter the 6-digit code sent to your email
            </Text>
          </View>

          {/* OTP Input Boxes */}
          <View className="mb-8 mt-8">
            <View className="flex-row justify-center gap-3">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="rounded-2xl text-center text-2xl font-bold"
                  style={{
                    width: 56,
                    height: 64,
                    backgroundColor: inputBgColor,
                    borderWidth: 2,
                    borderColor: digit ? primaryColor : inputBorderColor,
                    color: textColor,
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </View>

          {/* Resend OTP and Edit Email */}
          <View className="mb-8 items-center gap-4">
            <TouchableOpacity
              onPress={handleResendOtp}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-base" style={{ color: secondaryTextColor }}>
                Didn't receive the code?{' '}
              </Text>
              <Text className="text-base font-semibold" style={{ color: primaryColor }}>
                Resend OTP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEditEmail}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Ionicons name="mail-outline" size={16} color={secondaryTextColor} />
              <Text className="ml-2 text-base" style={{ color: secondaryTextColor }}>
                {email}
              </Text>
              <Text
                className="ml-2 text-base font-semibold"
                style={{ color: primaryColor }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={!isOtpComplete}
            activeOpacity={0.85}
            className="items-center justify-center rounded-2xl py-4"
            style={{
              backgroundColor: isOtpComplete ? primaryColor : inputBorderColor,
              shadowColor: isOtpComplete ? primaryColor : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isOtpComplete ? 0.3 : 0,
              shadowRadius: 8,
              elevation: isOtpComplete ? 8 : 0,
            }}
          >
            <Text className="text-base font-semibold text-white">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
