import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login with email:', email, 'and password');
    // router.push('/dashboard');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const handleAppleLogin = () => {
    console.log('Apple login pressed');
    // Implement Apple login
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
    // Implement Google login
  };

  const handleTerms = () => {
    console.log('Terms of Service pressed');
    // Navigate to terms
  };

  const handlePrivacy = () => {
    console.log('Privacy Policy pressed');
    // Navigate to privacy policy
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Main Content */}
      <View className="flex-1 px-8 justify-center">
        {/* Top Section - Header/Branding */}
        <View className="items-center mb-12">
          {/* Icon */}
          <Image 
            source={require('../../assets/images/ayurvedic.png')}
            className="w-16 h-16 mb-6"
            resizeMode="contain"
          />
          
          {/* Welcome Text */}
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome to VedArogya
          </Text>
          
          {/* Sign Up Link */}
          <View className="flex-row items-center">
            <Text className="text-gray-600 text-base">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text className="text-gray-900 font-semibold text-base underline">
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Form Section */}
        <View className="mb-8">
          {/* Email Input */}
          <View className="mb-3">
            <Text className="text-gray-900 font-medium text-base mb-2">Email</Text>
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-12 py-4 text-gray-900 text-base"
                placeholder="m@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View className="absolute left-4 top-4">
                <Mail size={20} color="#9CA3AF" />
              </View>
            </View>
          </View>
          
          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-gray-900 font-medium text-base mb-2">Password</Text>
            <View className="relative">
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-12 py-4 text-gray-900 text-base"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <View className="absolute left-4 top-4">
                <Lock size={20} color="#9CA3AF" />
              </View>
              <TouchableOpacity 
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Login Button */}
          <TouchableOpacity
            className="bg-[#F4B400] py-4 rounded-xl items-center active:bg-gray-800 active:scale-95 transition-all duration-200"
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text className="text-black font-bold text-base">
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Separator */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-600 font-medium">Or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Login Options */}
        <View className="mb-8">
          {/* Google Login */}
          <TouchableOpacity
            className="bg-white border border-gray-300 py-4 rounded-xl items-center flex-row justify-center active:bg-gray-50 active:scale-95 transition-all duration-200"
            activeOpacity={0.8}
            onPress={handleGoogleLogin}
          >
            <Image 
              source={require('../../assets/images/icons8-google-24.png')}
              className="w-6 h-6 mr-3"
              resizeMode="contain"
            />
            <Text className="text-gray-900 font-medium text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer - Legal Text */}
        <View className="items-center">
          <View className="flex-row flex-wrap justify-center">
            <Text className="text-gray-500 text-sm text-center">
              By clicking continue, you agree to our{' '}
            </Text>
            <TouchableOpacity onPress={handleTerms}>
              <Text className="text-gray-500 text-sm underline">
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-sm"> and </Text>
            <TouchableOpacity onPress={handlePrivacy}>
              <Text className="text-gray-500 text-sm underline">
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
