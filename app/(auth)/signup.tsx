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
import { router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Camera, X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import OTPModal from '../OTPModal';
import { supabase } from '../../utils/supabase';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  // Navigation functions using expo-router
  const goToLogin = () => {
    try {
      console.log('Navigating to login page...');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Please navigate to login manually.');
    }
  };

  const goBack = () => {
    try {
      console.log('Navigating back...');
      router.back();
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Please use the back button.');
    }
  };
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Test Supabase connection on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.warn('Supabase connection test failed:', error.message);
        } else {
          console.log('Supabase connection successful');
        }
      } catch (error) {
        console.error('Supabase connection test error:', error);
      }
    };
    
    testConnection();
  }, []);
  
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





  const onBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Navigate back to login
      goBack();
    }
  };

  const createUserInDatabase = async () => {
    try {
      setIsLoading(true);
      
      // Create user in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            full_name: fullName,
            email: email,
            phone: phoneNumber,
            password_hash: password, // In production, this should be hashed
            is_verified: false
          }
        ])
        .select()
        .single();

      if (userError) {
        throw new Error(userError.message);
      }

      if (userData) {
        setUserId(userData.id);
        return userData.id;
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create user account. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate required fields before proceeding
      if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
        Alert.alert('Required Fields', 'Please fill in all required fields before proceeding');
        return;
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
      
      // Validate phone number length
      if (phoneNumber.length !== 10) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
        return;
      }
      
      if (password !== confirmPassword) {
        Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
        return;
      }
      
      if (!validatePassword(password)) {
        Alert.alert('Invalid Password', 'Please ensure your password meets all requirements');
        return;
      }
      
      try {
        const newUserId = await createUserInDatabase();
        if (newUserId) {
          setUserId(newUserId);
          setShowOTPModal(true);
        }
      } catch (error) {
        // Error is already handled in createUserInDatabase
      }
    } else if (currentStep === 2) {
      // Step 2 now handles the complete signup process
      await completeSignup();
      return;
    }
  };

  const completeSignup = async () => {
    try {
      setIsLoading(true);
      
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please try signing up again.');
        return;
      }

      // Check for existing records to prevent duplicates
      try {
        // Validate required fields for Step 2
        const requiredFields = [
          { field: gender, name: 'Gender' },
          { field: dateOfBirth, name: 'Date of Birth' },
          { field: weight, name: 'Weight' },
          { field: height, name: 'Height' },
          { field: lifestyleType, name: 'Activity Level' },
          { field: goal, name: 'Goal' }
        ];

        const missingFields = requiredFields.filter(({ field }) => !field || !field.trim());
        
        // Debug logging
        console.log('Validation Debug:', {
          gender: gender,
          dateOfBirth: dateOfBirth,
          weight: weight,
          height: height,
          lifestyleType: lifestyleType,
          goal: goal
        });
        
        if (missingFields.length > 0) {
          const missingFieldNames = missingFields.map(({ name }) => name).join(', ');
          console.log('Missing fields:', missingFieldNames);
          Alert.alert('Required Fields', `Please fill in all required fields: ${missingFieldNames}`);
          return;
        }

        // Validate date format and convert to proper format for database
        let formattedDateOfBirth = null;
        try {
          if (dateOfBirth && dateOfBirth.length === 10) {
            const [day, month, year] = dateOfBirth.split('/');
            const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            
            // Check if date is valid
            if (isNaN(birthDate.getTime())) {
              throw new Error('Invalid date');
            }
            
            // Check if date is not in the future
            const today = new Date();
            if (birthDate > today) {
              Alert.alert('Invalid Date', 'Date of birth cannot be in the future.');
              return;
            }
            
            // Check if age is reasonable (between 13 and 120)
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13 || age > 120) {
              Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 120 years.');
              return;
            }
            
            formattedDateOfBirth = birthDate.toISOString().split('T')[0];
          } else {
            Alert.alert('Invalid Date', 'Please enter a valid date of birth in DD/MM/YYYY format.');
            return;
          }
        } catch (error) {
          Alert.alert('Invalid Date', 'Please enter a valid date of birth in DD/MM/YYYY format.');
          return;
        }

        // Validate weight and height
        const weightValue = parseFloat(weight);
        const heightValue = parseFloat(height);
        
        if (isNaN(weightValue) || weightValue < 20 || weightValue > 300) {
          Alert.alert('Invalid Weight', 'Please enter a valid weight between 20 and 300 kg.');
          return;
        }
        
        if (isNaN(heightValue) || heightValue < 100 || heightValue > 250) {
          Alert.alert('Invalid Height', 'Please enter a valid height between 100 and 250 cm.');
          return;
        }



        const { data: existingDetails, error: existingDetailsError } = await supabase
          .from('user_details')
          .select('id')
          .eq('user_id', userId)
          .single();
        
        if (existingDetails && !existingDetailsError) {
          // Update existing record instead of inserting
          const { data: updateDetails, error: updateError } = await supabase
            .from('user_details')
            .update({
              gender: gender,
              date_of_birth: formattedDateOfBirth,
              weight: weightValue,
              height: heightValue,
              activity_level: lifestyleType,
              goal: goal,
              profile_image: profileImage
            })
            .eq('user_id', userId)
            .select()
            .single();
          
          if (updateError) {
            Alert.alert('Warning', 'User details could not be updated, but account was created.');
          }
        } else {
          // Insert new record
          const { data: detailsData, error: detailsError } = await supabase
            .from('user_details')
            .insert([
              {
                user_id: userId,
                gender: gender,
                date_of_birth: formattedDateOfBirth,
                weight: weightValue,
                height: heightValue,
                activity_level: lifestyleType,
                goal: goal,
                profile_image: profileImage
              }
            ])
            .select()
            .single();

          if (detailsError) {
            Alert.alert('Warning', 'User details could not be saved, but account was created.');
          }
        }
      } catch (error) {
        Alert.alert('Warning', 'User details operation failed, but account was created.');
      }

      // Verify that user details were stored successfully
      try {
        const { data: verifyDetails, error: verifyDetailsError } = await supabase
          .from('user_details')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (verifyDetailsError || !verifyDetails) {
          console.warn('User details verification failed:', verifyDetailsError);
        } else {
          console.log('User details stored successfully:', verifyDetails);
        }
        
      } catch (verifyError) {
        console.error('Verification error:', verifyError);
      }

      // Show success message before navigating
      Alert.alert(
        'Signup Complete! 🎉',
        'Your account has been created successfully! You will be redirected to the login page.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login page after successful signup
              goToLogin();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error completing signup:', error);
      Alert.alert('Error', 'Failed to complete signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };







  const handleOTPVerified = async () => {
    try {
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please try signing up again.');
        return;
      }

      // Mark user as verified in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId);

      if (updateError) {
        Alert.alert('Warning', 'Account verification failed, but you can continue.');
      }

      // Close the OTP modal and move to Step 2 immediately
      setShowOTPModal(false);
      setCurrentStep(2);
    } catch (error) {
      Alert.alert('Error', 'Verification failed. Please try again.');
    }
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

  const renderStep2 = () => {
    // Calculate completion progress for Step 2
    const requiredFields = [gender, dateOfBirth, weight, height, lifestyleType, goal];
    const completedFields = requiredFields.filter(field => field && field.toString().trim() !== '').length;
    const progressPercentage = (completedFields / requiredFields.length) * 100;
    
    return (
      <View className="flex-1">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-1">Step 2</Text>
          <Text className="text-lg text-gray-600 leading-6">Personal Details & Wellness Profile</Text>
          <Text className="text-sm text-gray-500 mt-2">
            <Text className="text-red-500">*</Text> Required fields
          </Text>
          
          {/* Progress Bar */}
          <View className="mt-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">
                Progress: {completedFields}/{requiredFields.length} fields completed
              </Text>
              <Text className="text-sm font-medium text-[#F4B400]">
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2">
              <View 
                className="bg-[#F4B400] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>
        </View>
      
      <View className="space-y-12">
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">
            Select Your Gender <Text className="text-red-500">*</Text>
          </Text>
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
                    gender === option ? 'text-white' : 'text-gray-600'
                  ].join(" ")}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View className='mb-2'>
          <Text className="text-gray-700 font-semibold mb-2 text-base">
            Date of Birth <Text className="text-red-500">*</Text>
          </Text>
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
            <Text className="text-gray-700 font-semibold mb-2 text-base">
              Weight (kg) <Text className="text-red-500">*</Text>
            </Text>
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
            <Text className="text-gray-700 font-semibold mb-2 text-base">
              Height (cm) <Text className="text-red-500">*</Text>
            </Text>
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
          <Text className="text-gray-700 font-semibold mb-2 text-base">
            How active are you daily? <Text className="text-red-500">*</Text>
          </Text>
          <View>
            {[
              { key: 'Low', label: 'Low – Little to no exercise / mostly sitting' },
              { key: 'Moderate', label: 'Moderate – Some activity, walking or light exercise' },
              { key: 'High', label: 'High – Regular workouts or physically demanding lifestyle' }
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
          <Text className="text-gray-700 font-semibold mb-2 text-base">
            Goal / Focus <Text className="text-red-500">*</Text>
          </Text>
          <View className="space-y-4">
            {[
              'Digestive Issues',
              'Stress & Anxiety',
              'Sleep Problems',
              'Skin & Hair Care',
              'Chronic Pain / Joint Issues'
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
  };





  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View className="flex-row items-center px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <TouchableOpacity
          onPress={onBack}
          className="bg-white rounded-full p-4 mr-5 shadow-sm border border-gray-100"
          activeOpacity={0.7}
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
          {[1, 2].map((step) => (
            <View key={step} className={`w-24 h-2 rounded-full mr-2 ${
              step <= currentStep ? 'bg-[#F4B400]' : 'bg-gray-200'
            }`} />
          ))}
        </View>
        <View className="flex-row justify-between items-center px-4">
          <Text className="text-sm text-gray-500">
            Step {currentStep} of 2
          </Text>
          <Text className="text-sm font-medium text-[#F4B400]">
            {currentStep === 1 ? 'Account Info' : 'Personal Details'}
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
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View className="px-8 py-6">
        <TouchableOpacity
          className="bg-[#F4B400] py-5 rounded-2xl items-center active:bg-[#D99900] active:scale-95 transition-all duration-200 shadow-xl"
          activeOpacity={0.8}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text className="text-black text-xl font-bold">
            {isLoading ? 'Signing Up...' : 
             currentStep === 2 ? 'Confirm Sign Up' : 'Next'}
          </Text>
        </TouchableOpacity>
        

      </View>

      {/* OTP Modal */}
      <OTPModal
        visible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onContinue={handleOTPVerified}
        email={email}
        phoneNumber={phoneNumber}
        userId={userId || ''}
      />
    </SafeAreaView>
  );
}