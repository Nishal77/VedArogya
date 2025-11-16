import { Stack } from 'expo-router'

export default function SignupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="email-credentials" />
      <Stack.Screen name="personal-details" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="lifestyle-details" />
      <Stack.Screen name="dosha-assessment" />
      <Stack.Screen name="dosha-assessment-2" />
      <Stack.Screen name="health-profile" />
      <Stack.Screen name="summary" />
    </Stack>
  )
}
