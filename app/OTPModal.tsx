import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { supabase } from '../utils/supabase';

const { width, height } = Dimensions.get('window');

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
  email: string;
  phoneNumber: string;
  userId: string;
}

export default function OTPModal({ visible, onClose, onContinue, email, phoneNumber, userId }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      try {
        // Validate userId before proceeding
        if (!userId) {
          Alert.alert('Error', 'User ID is missing. Please try signing up again.');
          onClose();
          return;
        }
        
        // Auto-send OTP when modal opens
        sendOTP();
        startCountdown();
      } catch (error) {
        console.error('Error initializing OTP modal:', error);
        Alert.alert('Error', 'Failed to initialize OTP verification. Please try again.');
      }
    }
    
    // Cleanup function to clear countdown when modal closes
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [visible, userId]);

  useEffect(() => {
    if (countdown > 0 && !canResend && visible) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [countdown, canResend, visible]);

  const startCountdown = () => {
    try {
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      console.error('Error starting countdown:', error);
    }
  };

  const generateOTP = () => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async () => {
    try {
      if (!email || !phoneNumber || !userId) {
        Alert.alert('Error', 'Missing required information for OTP');
        return;
      }

      // First, verify that the user profile exists in our users table
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (userError || !userProfile) {
        console.error('User profile not found:', userError);
        Alert.alert('Error', 'User profile not found. Please try signing up again.');
        return;
      }

      const otpCode = generateOTP();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

      // Store OTP in database
      const { error: otpError } = await supabase
        .from('otps')
        .insert([
          {
            user_id: userId,
            otp_code: otpCode,
            purpose: 'signup_verification',
            is_used: false,
            expires_at: expiresAt.toISOString()
          }
        ]);

      if (otpError) {
        console.error('Error storing OTP:', otpError);
        throw new Error('Failed to generate OTP');
      }

      // In production, you would send this OTP via SMS/Email service
      // For now, we'll show it in an alert (remove this in production)
      Alert.alert(
        'OTP Generated', 
        `Your 6-digit OTP is: ${otpCode}\n\nThis OTP will expire in 5 minutes.\n\n⚠️ Remove this alert in production!`,
        [{ text: 'OK' }]
      );

      console.log('OTP sent and stored successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    try {
      const newOtp = [...otp];
      newOtp[index] = text.replace(/[^0-9]/g, '');
      setOtp(newOtp);

      // Auto-focus to next input
      if (text && index < 5) {
        setActiveIndex(index + 1);
      }
    } catch (error) {
      console.error('Error handling OTP change:', error);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    try {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        setActiveIndex(index - 1);
      }
    } catch (error) {
      console.error('Error handling key press:', error);
    }
  };

  const verifyOTP = async () => {
    try {
      setIsVerifying(true);
      const otpString = otp.join('');
      
      if (otpString.length !== 6) {
        Alert.alert('Error', 'Please enter a valid 6-digit OTP');
        return;
      }

      // Verify OTP against database
      const { data: otpData, error: otpError } = await supabase
        .from('otps')
        .select('*')
        .eq('user_id', userId)
        .eq('otp_code', otpString)
        .eq('purpose', 'signup_verification')
        .eq('is_used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (otpError || !otpData) {
        Alert.alert('Error', 'Invalid or expired OTP. Please try again.');
        return;
      }

      // Mark OTP as used
      const { error: updateError } = await supabase
        .from('otps')
        .update({ is_used: true })
        .eq('id', otpData.id);

      if (updateError) {
        console.error('Error marking OTP as used:', updateError);
        // Continue anyway as OTP was verified
      }

      // Clear countdown immediately to prevent blocking
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
      
      // Success - immediately redirect to Step 2
      console.log('OTP verified successfully! Redirecting to Step 2...');
      onContinue(); // Call onContinue immediately
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    try {
      if (canResend) {
        await sendOTP();
        startCountdown();
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleClose = () => {
    try {
      // Clear countdown when closing
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
      
      setOtp(['', '', '', '', '', '']);
      setActiveIndex(0);
      onClose();
    } catch (error) {
      console.error('Error closing OTP modal:', error);
      onClose(); // Force close if there's an error
    }
  };

  // Auto-fill demo OTP for testing (remove this in production)
  const fillDemoOTP = () => {
    try {
      // Get the latest OTP from database for this user
      const getLatestOTP = async () => {
        try {
          const { data: otpData, error: otpError } = await supabase
            .from('otps')
            .select('otp_code')
            .eq('user_id', userId)
            .eq('purpose', 'signup_verification')
            .eq('is_used', false)
            .gte('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (otpData && !otpError) {
            const otpDigits = otpData.otp_code.split('');
            setOtp(otpDigits);
          } else {
            Alert.alert('No OTP Found', 'Please generate an OTP first by clicking "Resend it."');
          }
        } catch (error) {
          console.error('Error getting latest OTP:', error);
          Alert.alert('Error', 'Failed to get OTP. Please generate a new one.');
        }
      };

      getLatestOTP();
    } catch (error) {
      console.error('Error filling demo OTP:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Header with Back Button */}
            <View className="flex-row items-center px-6 py-4">
              <TouchableOpacity
                onPress={handleClose}
                className="active:opacity-70"
                activeOpacity={0.8}
              >
                <ChevronLeft size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Main Content - Centered */}
            <View className="flex-1 justify-center items-center px-8">
              {/* Title with Lock Icon */}
              <View className="flex-row items-center justify-center mb-4">
                <Lock size={28} color="#1F2937" style={{ marginRight: 12, marginTop: 2 }} />
                <Text className="text-3xl font-bold text-gray-900">
                  Enter Your OTP
                </Text>
              </View>

              {/* Instructions */}
              <Text className="text-black text-base text-center mb-8">
                We've sent you a one-time code — check your <Text className="text-black font-bold">email</Text> or <Text className="text-black font-bold">phone</Text> to verify your account.
              </Text>

              {/* OTP Input Fields */}
              <View className="flex-row justify-center mb-12">
                {otp.map((digit, index) => (
                  <View key={index} className={index < 5 ? 'mr-2' : ''}>
                    <TextInput
                      ref={(ref) => {
                        if (ref && index === activeIndex) {
                          ref.focus();
                        }
                      }}
                      className={`w-14 h-14 border border-gray-300 rounded-lg text-center text-2xl font-semibold text-gray-900 bg-white ${
                        index === activeIndex 
                          ? 'border-blue-500' 
                          : digit 
                            ? 'border-gray-400' 
                            : 'border-gray-300'
                      }`}
                      placeholder=""
                      placeholderTextColor="transparent"
                      value={digit}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                      onFocus={() => setActiveIndex(index)}
                    />
                  </View>
                ))}
              </View>

              {/* Demo OTP Button (for testing - remove this in production) */}
              <TouchableOpacity
                onPress={fillDemoOTP}
                className="mb-6 px-4 py-2 bg-gray-100 rounded-lg active:bg-gray-200"
                activeOpacity={0.8}
              >
                <Text className="text-gray-600 text-sm text-center">
                  Fill Latest OTP
                </Text>
              </TouchableOpacity>

              {/* Resend Option */}
              <TouchableOpacity
                onPress={resendOTP}
                disabled={!canResend}
                className="items-center mb-8"
              >
                <Text className="text-center text-gray-600">
                  Didn't get the code?{' '}
                  <Text className={`font-medium ${canResend ? 'text-blue-500' : 'text-gray-400'}`}>
                    {canResend ? 'Resend it.' : `Resend in ${countdown}s`}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Continue Button - Positioned above keyboard */}
              <TouchableOpacity
                onPress={verifyOTP}
                disabled={isVerifying}
                className={`w-full py-4 rounded-lg items-center mb-8 transition-all duration-200 ${
                  isVerifying 
                    ? 'bg-gray-400' 
                    : 'bg-blue-500 active:bg-blue-600 active:scale-95'
                }`}
                activeOpacity={0.9}
              >
                <Text className="text-white font-semibold text-lg">
                  {isVerifying ? 'Verifying...' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Spacing for keyboard */}
            <View className="h-32" />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
