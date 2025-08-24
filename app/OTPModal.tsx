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

const { width, height } = Dimensions.get('window');

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
  email: string;
  phoneNumber: string;
}

export default function OTPModal({ visible, onClose, onContinue, email, phoneNumber }: OTPModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      try {
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
  }, [visible]);

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

  const sendOTP = () => {
    try {
      if (!email || !phoneNumber) {
        Alert.alert('Error', 'Please fill in email and phone number first');
        return;
      }
      // Here you would integrate with your OTP service
      Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your phone and email');
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
      const otpString = otp.join('');
      
      // Accept any 6-digit OTP (for demo purposes)
      if (otpString.length === 6) {
        // Clear countdown immediately to prevent blocking
        if (countdownRef.current) {
          clearTimeout(countdownRef.current);
          countdownRef.current = null;
        }
        
        // Success - immediately redirect to Step 2
        console.log('OTP verified successfully! Redirecting to Step 2...');
        onContinue(); // Call onContinue immediately
      } else {
        Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  };

  const resendOTP = () => {
    try {
      if (canResend) {
        sendOTP();
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
      setOtp(['1', '2', '3', '4', '5', '6']);
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
                  Fill Demo OTP (123456)
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
                className="w-full bg-blue-500 py-4 rounded-lg items-center mb-8 active:bg-blue-600 active:scale-95 transition-all duration-200"
                activeOpacity={0.9}
              >
                <Text className="text-white font-semibold text-lg">Continue</Text>
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
