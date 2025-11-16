import { Image } from 'expo-image'
import { router } from 'expo-router'
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
import Svg, { G, Path, Defs, ClipPath, Rect } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

// Icon Components
const GoogleIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
    <G clipPath="url(#clip0_4062_36866)">
      <Path
        d="M24.2407 12.3791C24.2407 11.5704 24.1624 10.7356 24.032 9.953H12.7363V14.5704H19.2059C18.945 16.0574 18.0842 17.3617 16.8059 18.1965L20.6668 21.1965C22.9363 19.0834 24.2407 16.0052 24.2407 12.3791Z"
        fill="#4280EF"
      />
      <Path
        d="M12.7347 24.0661C15.9695 24.0661 18.6825 22.9965 20.6651 21.1704L16.8043 18.1965C15.7347 18.9269 14.3521 19.3443 12.7347 19.3443C9.60428 19.3443 6.9695 17.2313 6.00428 14.4139L2.03906 17.4661C4.07385 21.5095 8.19558 24.0661 12.7347 24.0661Z"
        fill="#34A353"
      />
      <Path
        d="M6.00453 14.3878C5.50888 12.9008 5.50888 11.2834 6.00453 9.79646L2.03932 6.7182C0.343665 10.1095 0.343665 14.1008 2.03932 17.466L6.00453 14.3878Z"
        fill="#F6B704"
      />
      <Path
        d="M12.7347 4.86602C14.4304 4.83993 16.0999 5.49211 17.326 6.66602L20.7434 3.22254C18.5782 1.18776 15.7086 0.0921052 12.7347 0.118192C8.19558 0.118192 4.07385 2.67471 2.03906 6.71819L6.00428 9.79646C6.9695 6.95298 9.60428 4.86602 12.7347 4.86602Z"
        fill="#E54335"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_4062_36866">
        <Rect
          width="23.4783"
          height="24"
          fill="white"
          transform="translate(0.761719 0.0921631)"
        />
      </ClipPath>
    </Defs>
  </Svg>
)

const AppleIcon = ({
  size = 24,
  color = '#000000',
}: {
  size?: number
  color?: string
}) => (
  <Svg width={size} height={size} viewBox="0 0 814 1000" fill={color}>
    <Path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
  </Svg>
)

const EmailIcon = ({
  size = 24,
  color = '#1c1f21',
}: {
  size?: number
  color?: string
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M8.88,8.827c.074,.042,.166,.042,.24,0l7.777-4.283c-.314-1.173-1.376-2.044-2.647-2.044H3.75c-1.267,0-2.326,.865-2.643,2.033l7.773,4.293Z"
      fill={color}
    />
    <Path
      d="M9.845,10.14c-.264,.146-.554,.219-.844,.219s-.582-.073-.846-.22L1,6.188v6.562c0,1.517,1.233,2.75,2.75,2.75H14.25c1.517,0,2.75-1.233,2.75-2.75V6.2l-7.155,3.94Z"
      fill={color}
    />
  </Svg>
)

export default function SignUpScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const inputBgColor = isDark ? '#1F1F1F' : '#FFFFFF'
  const inputBorderColor = isDark ? '#2F2F2F' : '#E5E7EB'
  const linkColor = '#2563EB'
  const primaryColor = '#2563EB'

  // Handlers
  const handleGoogleSignIn = () => {
    // TODO: Implement Google authentication
  }

  const handleAppleSignIn = () => {
    // TODO: Implement Apple authentication
  }

  const handleEmailSignUp = () => {
    // Navigate to email credentials screen
    router.push('/(auth)/signup/email-credentials')
  }

  const handleSignIn = () => {
    router.push('/(auth)/sign-in')
  }

  const handleTermsPress = () => {
    // TODO: Navigate to Terms of Service
  }

  const handlePrivacyPress = () => {
    // TODO: Navigate to Privacy Policy
  }

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
          className="flex-1 items-center justify-center px-6 py-8"
          style={{ backgroundColor, minHeight: height }}
        >
          <View style={{ width: '100%', maxWidth: width * 0.9 }}>
            {/* Logo Section */}
            <View className="mb-8 items-center">
              <Image
                source={require('@/assets/images/loginlogo.png')}
                style={{ width: 80, height: 80 }}
                contentFit="contain"
              />
            </View>

            {/* Welcome Section */}
            <View className="mb-8 items-center">
              <Text
                className="mb-4 text-center text-3xl font-bold"
                style={{ color: textColor, letterSpacing: -0.5 }}
              >
                Create Account
              </Text>
              <View className="flex-row items-center">
                <Text className="text-base" style={{ color: secondaryTextColor }}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
                  <Text className="text-base font-semibold" style={{ color: linkColor }}>
                    Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign-Up Buttons - Stacked Vertically */}
            <View className="mb-6 gap-4">
              {/* Google Button */}
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                activeOpacity={0.85}
                className="flex-row items-center justify-center rounded-3xl border border-gray-200 py-4 dark:border-gray-700"
                style={{
                  backgroundColor: inputBgColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <GoogleIcon size={24} />
                <Text
                  className="ml-3 text-base font-semibold"
                  style={{ color: textColor }}
                >
                  Google
                </Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity
                onPress={handleAppleSignIn}
                activeOpacity={0.85}
                className="flex-row items-center justify-center rounded-3xl border border-gray-200 py-4 dark:border-gray-700"
                style={{
                  backgroundColor: inputBgColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <AppleIcon size={24} color={textColor} />
                <Text
                  className="ml-3 text-base font-semibold"
                  style={{ color: textColor }}
                >
                  Apple
                </Text>
              </TouchableOpacity>

              {/* Continue with Email Button */}
              <TouchableOpacity
                onPress={handleEmailSignUp}
                activeOpacity={0.85}
                className="flex-row items-center justify-center rounded-3xl border border-gray-200 py-4 dark:border-gray-700"
                style={{
                  backgroundColor: inputBgColor,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <EmailIcon size={24} color={textColor} />
                <Text
                  className="ml-3 text-base font-semibold"
                  style={{ color: textColor }}
                >
                  Continue with Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy Text */}
            <View className="px-2">
              <Text
                className="text-center text-sm leading-5"
                style={{ color: secondaryTextColor }}
              >
                By creating an account, you agree to our{' '}
                <Text
                  style={{ color: linkColor, fontWeight: '600' }}
                  onPress={handleTermsPress}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  style={{ color: linkColor, fontWeight: '600' }}
                  onPress={handlePrivacyPress}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
