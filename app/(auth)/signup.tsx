import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Camera, X, Image as ImageIcon, ChevronRight, ChevronLeft as ChevronLeftIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DoshaAssessment from '../../components/assessment';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data for account creation
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasNumber: false,
    hasSpecial: false,
    hasAlphabet: false
  });

  // Form data for personal details
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [lifestyleType, setLifestyleType] = useState('');
  const [goal, setGoal] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Dosha assessment answers
  const [doshaAnswers, setDoshaAnswers] = useState({
    bodyType: '',
    skinType: '',
    appetite: '',
    energy: '',
    sleep: '',
    mood: '',
    climate: '',
    stressResponse: '',
    digestion: '',
    bodyTemperature: ''
  });

  const onBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Signup completed:', {
        fullName, email, phoneNumber, password, gender, dateOfBirth, weight, height, lifestyleType, goal, doshaAnswers
      });
      alert('Signup completed successfully!');
    }
  };

  const handleDoshaAnswer = (question: string, answer: string) => {
    setDoshaAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasAlphabet: /[a-zA-Z]/.test(password)
    };
    setPasswordValidation(validation);
    return validation.length && validation.hasNumber && validation.hasSpecial && validation.hasAlphabet;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to make this work!',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to make this work!',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Profile Photo',
      'Choose how you want to add your profile photo',
      [
        {
          text: 'Camera',
          onPress: takePhoto
        },
        {
          text: 'Gallery',
          onPress: pickImage
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const renderStep1 = () => (
    <View className="flex-1">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-3">Step 1</Text>
        <Text className="text-lg text-gray-600 leading-6">Account Creation & Personal Info</Text>
      </View>
      
      <View className="space-y-8">
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Full Name</Text>
          <TextInput
            className="bg-gray-50 border border-black/30 rounded-2xl px-5 py-5 text-gray-800 text-base"
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Email</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-50 border border-black/30  border-r-0 rounded-l-2xl px-5 py-5 text-gray-800 text-base"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View className="bg-gray-100 border border-gray-200 rounded-r-2xl px-4 py-5 justify-center">
              <Text className="text-gray-700 font-medium text-base">@gmail.com</Text>
            </View>
          </View>
          <Text className="text-gray-500 text-sm mt-2">Enter your Gmail address</Text>
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Phone Number</Text>
          <View className="flex-row items-center">
            <View className="bg-gray-100 border border-gray-200 rounded-l-2xl px-4 py-5 justify-center">
              <Text className="text-gray-700 font-medium text-base">+91</Text>
            </View>
            <TextInput
              className="flex-1 bg-gray-50 border border-black/30  border-l-0 rounded-r-2xl px-5 py-5 text-gray-800 text-base"
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={(text) => {
                // Only allow numbers and limit to 10 digits
                const cleaned = text.replace(/[^0-9]/g, '');
                if (cleaned.length <= 10) {
                  setPhoneNumber(cleaned);
                }
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          <Text className="text-gray-500 text-sm mt-2">Enter 10-digit mobile number</Text>
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Password</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-50 border border-black/30  border-r-0 rounded-l-2xl px-5 py-5 text-gray-800 text-base"
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="bg-gray-100 border border-gray-200 rounded-r-2xl px-4 py-5 justify-center"
            >
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
          
          {/* Password Validation */}
          <View className="mt-3 space-y-2">
            <Text className="text-gray-600 text-sm font-medium">Password must contain:</Text>
            <View className="space-y-1">
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  passwordValidation.length ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <Text className={`text-sm ${
                  passwordValidation.length ? 'text-green-600' : 'text-gray-500'
                }`}>
                  At least 8 characters
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <Text className={`text-sm ${
                  passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'
                }`}>
                  One number (0-9)
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  passwordValidation.hasSpecial ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <Text className={`text-sm ${
                  passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'
                }`}>
                  One special character (!@#$%^&*)
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  passwordValidation.hasAlphabet ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <Text className={`text-sm ${
                  passwordValidation.hasAlphabet ? 'text-green-600' : 'text-gray-500'
                }`}>
                  One letter (a-z, A-Z)
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Confirm Password</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-50 border border-black/30  border-r-0 rounded-l-2xl px-5 py-5 text-gray-800 text-base"
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="bg-gray-100 border border-gray-200 rounded-r-2xl px-4 py-5 justify-center"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
          
          {/* Confirm Password Validation */}
          {confirmPassword.length > 0 && (
            <View className="mt-3">
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  password === confirmPassword ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <Text className={`text-sm ${
                  password === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="flex-1">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800 mb-1">Step 2</Text>
        <Text className="text-lg text-gray-600 leading-6">Personal Details & Wellness Profile</Text>
      </View>
      
      <View className="space-y-12">
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Select Your Gender</Text>
          <View className="flex-row">
            {['Male', 'Female', 'Prefer not to say'].map((option, idx, arr) => (
              <TouchableOpacity
                key={option}
                className={[
                  "flex-1 items-center justify-center py-3 px-3 rounded-2xl border-2 border-black/30 transition-all duration-200",
                  idx !== arr.length - 1 ? "mr-2" : "",
                  gender === option
                    ? "bg-gray-900/90"
                    : "bg-gray-50",
                  "active:bg-gray-800/80"
                ].join(" ")}
                activeOpacity={0.85}
                onPress={() => setGender(option)}
              >
                <Text
                  className={[
                    "font-medium text-base text-center transition-all duration-200",
                    gender === option ? "text-white" : "text-gray-600"
                  ].join(" ")}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Date of Birth</Text>
          <TextInput
            className="bg-gray-50 border border-black/30  rounded-2xl px-5 py-5 text-gray-800 text-base"
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#9CA3AF"
            value={dateOfBirth}
            onChangeText={(text) => {
              // Remove all non-numeric characters
              const cleaned = text.replace(/[^0-9]/g, '');
              
              // Format as DD/MM/YYYY
              let formatted = '';
              if (cleaned.length >= 1) formatted += cleaned.slice(0, 2);
              if (cleaned.length >= 3) formatted += '/' + cleaned.slice(2, 4);
              if (cleaned.length >= 5) formatted += '/' + cleaned.slice(4, 8);
              
              setDateOfBirth(formatted);
            }}
            keyboardType="numeric"
            maxLength={10}
          />
          <Text className="text-gray-500 text-sm mt-2">Enter your date of birth (DD/MM/YYYY)</Text>
          {dateOfBirth && dateOfBirth.length === 10 && (
            <Text className="text-gray-600 text-sm mt-1">
              Age: {(() => {
                try {
                  const [day, month, year] = dateOfBirth.split('/');
                  const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    return age - 1;
                  }
                  return age;
                } catch (error) {
                  return '--';
                }
              })()} years
            </Text>
          )}
        </View>
        
        <View className="flex-row mb-2">
          <View className="flex-1 mr-2">
            <Text className="text-gray-700 font-semibold mb-2 text-base">Weight (kg)</Text>
            <TextInput
              className="bg-gray-50 border border-black/30  rounded-2xl px-5 py-5 text-gray-800 text-base"
              placeholder="70"
              placeholderTextColor="#9CA3AF"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-700 font-semibold mb-2 text-base">Height (cm)</Text>
            <TextInput
              className="bg-gray-50 border border-black/30  rounded-2xl px-5 py-5 text-gray-800 text-base"
              placeholder="170"
              placeholderTextColor="#9CA3AF"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">How active are you daily?</Text>
          <View>
            {[
              { key: 'Sedentary', label: 'Mostly sitting, little movement' },
              { key: 'Moderate', label: 'Some walking or light exercise' },
              { key: 'Active', label: 'Regular exercise or physically active job' }
            ].map((option, idx, arr) => {
              const isSelected = lifestyleType === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  className={`py-5 px-6 rounded-2xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-gray-900 bg-gray-900/90'
                      : 'border-gray-200 bg-gray-50'
                    }
                    ${idx !== arr.length - 1 ? ' mb-2' : ''}
                    active:bg-gray-800/80 active:border-gray-900
                  `}
                  activeOpacity={0.85}
                  onPress={() => setLifestyleType(option.key)}
                >
                  <Text className={`font-semibold text-base text-left transition-all duration-200
                    ${isSelected ? 'text-white' : 'text-gray-600'}
                  `}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">Goal / Focus</Text>
          <View className="space-y-4">
            {[
              'Balance stress',
              'Improve sleep', 
              'Boost energy',
              'Better digestion',
              'General wellness'
            ].map((option) => (
              <TouchableOpacity
                key={option}
                className={`py-5 px-6 rounded-2xl border-2 transition-all duration-200 mb-1
                  ${goal === option 
                    ? 'border-gray-900 bg-gray-900/90' 
                    : 'border-gray-200 bg-gray-50'
                  }
                  active:bg-gray-800/80 active:border-gray-900
                `}
                activeOpacity={0.85}
                onPress={() => setGoal(option)}
              >
                <Text className={`font-medium text-base transition-all duration-200
                  ${goal === option ? 'text-white' : 'text-gray-600'}
                `}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Profile Image Section */}
        <View>
          <Text className="text-gray-700 font-semibold mb-5 text-base">Profile Image <Text className="text-gray-500 font-normal">(Optional)</Text></Text>
          <View className="items-center">
            {profileImage ? (
              <View className="relative">
                <Image 
                  source={{ uri: profileImage }} 
                  className="w-32 h-32 rounded-2xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setProfileImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-8 h-8 items-center justify-center"
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl items-center justify-center"
                onPress={showImageOptions}
              >
                <View className="items-center">
                  <ImageIcon size={32} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm mt-2 text-center">Add Photo</Text>
                </View>
              </TouchableOpacity>
            )}
            <Text className="text-gray-500 text-sm mt-3 text-center">
              {profileImage ? 'Tap the X to remove photo' : 'Tap to add a profile picture'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <DoshaAssessment 
      doshaAnswers={doshaAnswers}
      onAnswerChange={handleDoshaAnswer}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-row items-center px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <TouchableOpacity
          onPress={onBack}
          className="bg-white rounded-full p-4 mr-5 shadow-sm border border-gray-100"
        >
          <ChevronLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-3xl font-bold text-gray-800">Sign Up</Text>
          <Text className="text-gray-500 text-sm mt-1">Create your wellness profile</Text>
        </View>
      </View>
      
      <View className="px-6 py-6 ">
        <View className="flex-row space-x-3 mb-6 justify-center">
          {[1, 2, 3].map((step) => (
            <View key={step} className={`w-24 h-2 rounded-full mr-2 ${
              step <= currentStep ? 'bg-[#F4B400]' : 'bg-gray-200'
            }`} />
          ))}
        </View>
        <View className="flex-row justify-between items-center px-4">
          <Text className="text-sm text-gray-500">
            Step {currentStep} of 3
          </Text>
          <Text className="text-sm font-medium text-[#F4B400]">
            {currentStep === 1 ? 'Account Info' : currentStep === 2 ? 'Personal Details' : 'Dosha Assessment'}
          </Text>
        </View>
      </View>
      
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView 
          className="flex-1 px-6 py-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1
          }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          bounces={false}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View className="px-8 py-6">
        <TouchableOpacity
          className="bg-[#F4B400] py-5 rounded-2xl items-center active:bg-[#D99900] active:scale-95 transition-all duration-200 shadow-xl"
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text className="text-black text-xl font-bold">
            {currentStep === 3 ? 'Complete Signup' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
