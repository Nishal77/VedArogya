import React, { useState, useEffect } from 'react';
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
import { ChevronLeft } from 'lucide-react-native';

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

  useEffect(() => {
    if (visible) {
      // Auto-send OTP when modal opens
      sendOTP();
      startCountdown();
    }
  }, [visible]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const startCountdown = () => {
    setCountdown(30);
    setCanResend(false);
  };

  const sendOTP = () => {
    if (!email || !phoneNumber) {
      Alert.alert('Error', 'Please fill in email and phone number first');
      return;
    }
    // Here you would integrate with your OTP service
    Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your phone and email');
  };

  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    // Auto-focus to next input
    if (text && index < 5) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
    }
  };

  const verifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    // Here you would verify the OTP with your service
    Alert.alert('Success', 'OTP verified successfully!');
    onContinue();
  };

  const resendOTP = () => {
    if (canResend) {
      sendOTP();
      startCountdown();
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setActiveIndex(0);
    onClose();
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
              {/* Title */}
              <Text className="text-3xl font-bold text-gray-900 text-center mb-4 italic">
                Verify your email
              </Text>

              {/* Instructions */}
              <Text className="text-gray-600 text-base text-center mb-8">
                Enter code we've sent to your inbox
              </Text>

              {/* Email Display */}
              <Text className="text-gray-800 text-base text-center mb-12 font-medium">
                {email}
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
