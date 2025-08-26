import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react-native';
import { useAuth } from '../../utils/AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(emailOrPhone, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message || 'Invalid credentials. Please try again.');
      } else {
        // Success - AuthWrapper will handle navigation to home page
        console.log('Login successful, redirecting to home...');
        // Show success message briefly before redirect
        Alert.alert(
          'Login Successful! 🎉',
          'Welcome back to VedArogya!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (input: string) => {
    // Check if input looks like an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) {
      return 'email';
    }
    // Check if input looks like a phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(input)) {
      return 'phone';
    }
    return 'invalid';
  };

  const getInputIcon = () => {
    const inputType = validateInput(emailOrPhone);
    if (inputType === 'email') {
      return <Mail size={20} color="#9CA3AF" />;
    } else if (inputType === 'phone') {
      return <Phone size={20} color="#9CA3AF" />;
    }
    return <Mail size={20} color="#9CA3AF" />;
  };

  const getInputPlaceholder = () => {
    const inputType = validateInput(emailOrPhone);
    if (inputType === 'email') {
      return 'Enter your email address';
    } else if (inputType === 'phone') {
      return 'Enter your phone number';
    }
    return 'Enter your email or phone number';
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View className="flex-1 px-8 justify-center py-8">
            
            {/* Header */}
            <View className="items-center mb-12">
              <Image
                source={require('../../assets/images/ayurvedic.png')}
                className="w-24 h-24 mb-4"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-600 text-center text-base">
                Sign in to continue your wellness journey
              </Text>
            </View>

            {/* Login Form */}
            <View className="space-y-8">
              
              {/* Email or Phone Input */}
              <View>
                <Text className="text-gray-700 font-semibold mb-3 text-base">
                  Email or Phone Number
                </Text>
                <View className="relative">
                  <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    {getInputIcon()}
                  </View>
                  <TextInput
                    className="bg-gray-50 border border-black/30 rounded-2xl px-12 py-5 text-gray-800 text-base"
                    placeholder={getInputPlaceholder()}
                    placeholderTextColor="#9CA3AF"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    enablesReturnKeyAutomatically={true}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 font-semibold mb-3 text-base">
                  Password
                </Text>
                <View className="relative">
                  <View className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                    <Lock size={20} color="#9CA3AF" />
                  </View>
                  <TextInput
                    className="bg-gray-50 border border-black/30 rounded-2xl px-12 py-5 text-gray-800 text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    enablesReturnKeyAutomatically={true}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
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

              {/* Remember Me and Forgot Password Row */}
              <View className="flex-row items-center justify-end mb-6">
                <TouchableOpacity>
                  <Text className="font-medium text-base">
                    <Text className="text-gray-500">Can’t log in?</Text>
                    <Text> </Text>
                    <Text className="text-black">Reset your password</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`py-5 rounded-2xl items-center ${
                  loading ? 'bg-gray-400' : 'bg-[#F4B400] active:bg-[#D99900] active:scale-95'
                }`}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text className="text-black font-semibold text-lg">
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-8">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-6 text-gray-500 font-medium text-base">or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Sign Up Link */}
              <TouchableOpacity 
                className="items-center py-2"
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text className="text-gray-600 text-base">
                  Don't have an account?{' '}
                  <Text className="text-black font-semibold">Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}