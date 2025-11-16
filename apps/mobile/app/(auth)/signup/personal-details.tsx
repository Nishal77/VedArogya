import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LinearGradient } from 'expo-linear-gradient'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

// Country data with flags and dial codes
const COUNTRIES = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
].sort((a, b) => a.name.localeCompare(b.name))

export default function PersonalDetailsScreen() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const params = useLocalSearchParams()
  const email = (params.email as string) || ''
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [gender, setGender] = useState('')
  const [userHeight, setUserHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]) // Default to India
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [cityState, setCityState] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')

  // Theme colors
  const backgroundColor = isDark ? '#000000' : '#FFFFFF'
  const textColor = isDark ? '#FFFFFF' : '#111827'
  const secondaryTextColor = isDark ? '#9CA3AF' : '#6B7280'
  const labelTextColor = isDark ? '#D1D5DB' : '#6B7280' // More visible labels in dark mode
  const placeholderTextColor = isDark ? '#A1A1A1' : '#9CA3AF' // Muted placeholder text
  const inputBgColor = isDark ? '#151515' : '#FFFFFF'
  const inputBorderColor = isDark ? 'rgba(255, 255, 255, 0.05)' : '#E5E7EB'
  const inputTextColor = isDark ? '#ECEDEE' : '#111827'
  const primaryColor = '#2563EB'

  // Handlers
  const handleNext = () => {
    // Navigate to OTP verification page with email
    router.push({
      pathname: '/(auth)/signup/otp-verification',
      params: { email },
    })
  }

  const handleBack = () => {
    router.back()
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
      if (event.type === 'set' && selectedDate) {
        setDateOfBirth(selectedDate)
      }
    } else {
      // iOS - update date in real-time
      if (selectedDate) {
        setDateOfBirth(selectedDate)
      }
    }
  }

  const handleDatePickerConfirm = () => {
    setShowDatePicker(false)
  }

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      country.dialCode.includes(countrySearchQuery) ||
      country.code.toLowerCase().includes(countrySearchQuery.toLowerCase()),
  )

  const handleCountrySelect = (country: (typeof COUNTRIES)[0]) => {
    setSelectedCountry(country)
    setShowCountryPicker(false)
    setCountrySearchQuery('')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: Platform.OS === 'ios' ? 140 : 120,
          paddingBottom: 120,
          paddingHorizontal: 24,
          minHeight: height - 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        decelerationRate="fast"
        overScrollMode="always"
      >
        <View style={{ width: '100%', maxWidth: width * 0.9, alignSelf: 'center' }}>
          {/* Title Section */}
          <View className="mb-10" style={{ marginTop: Platform.OS === 'ios' ? 80 : 70 }}>
            <Text
              className="text-3xl font-bold"
              style={{ color: textColor, letterSpacing: -0.5 }}
            >
              Tell Us About You
            </Text>
          </View>

          {/* Form Fields */}
          <View className="mb-8 gap-5">
            {/* Full Name */}
            <View>
              <Text
                className="mb-3 text-sm font-medium"
                style={{ color: labelTextColor }}
              >
                Full Name
              </Text>
              <TextInput
                className="rounded-2xl px-4 py-4 text-base"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                  color: inputTextColor,
                }}
                placeholder="Aarav Sharma"
                placeholderTextColor={placeholderTextColor}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Age and Date of Birth - Side by Side */}
            <View className="flex-row gap-3">
              {/* Age */}
              <View className="flex-1">
                <Text
                  className="mb-3 text-sm font-medium"
                  style={{ color: labelTextColor }}
                >
                  Age
                </Text>
                <TextInput
                  className="rounded-2xl px-4 py-4 text-base"
                  style={{
                    backgroundColor: inputBgColor,
                    borderWidth: 1,
                    borderColor: inputBorderColor,
                    color: inputTextColor,
                  }}
                  placeholder="25"
                  placeholderTextColor={placeholderTextColor}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  autoCorrect={false}
                />
              </View>

              {/* Date of Birth */}
              <View className="flex-1">
                <Text
                  className="mb-3 text-sm font-medium"
                  style={{ color: labelTextColor }}
                >
                  Date of Birth
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                  className="rounded-2xl px-4 py-4"
                  style={{
                    backgroundColor: inputBgColor,
                    borderWidth: 1,
                    borderColor: inputBorderColor,
                    justifyContent: 'center',
                    minHeight: 52,
                  }}
                >
                  <Text
                    className="text-base"
                    style={{
                      color: dateOfBirth ? inputTextColor : placeholderTextColor,
                    }}
                  >
                    {dateOfBirth ? formatDate(dateOfBirth) : 'MM/DD/YYYY'}
                  </Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' && showDatePicker && (
                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showDatePicker}
                    onRequestClose={() => setShowDatePicker(false)}
                  >
                    <View
                      className="flex-1 justify-end"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                      <View
                        className="rounded-t-3xl px-6 py-6"
                        style={{
                          backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
                          borderTopLeftRadius: 24,
                          borderTopRightRadius: 24,
                        }}
                      >
                        <View className="mb-4 flex-row items-center justify-between">
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(false)}
                            activeOpacity={0.7}
                          >
                            <Text
                              className="text-base font-semibold"
                              style={{ color: secondaryTextColor }}
                            >
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <Text
                            className="text-lg font-bold"
                            style={{ color: textColor }}
                          >
                            Select Date
                          </Text>
                          <TouchableOpacity
                            onPress={handleDatePickerConfirm}
                            activeOpacity={0.7}
                          >
                            <Text
                              className="text-base font-semibold"
                              style={{ color: primaryColor }}
                            >
                              Done
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={dateOfBirth || new Date()}
                          mode="date"
                          display="spinner"
                          onChange={onDateChange}
                          maximumDate={new Date()}
                          textColor={textColor}
                          style={{ height: 200 }}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
                {Platform.OS === 'android' && showDatePicker && (
                  <DateTimePicker
                    value={dateOfBirth || new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            </View>

            {/* Gender */}
            <View>
              <Text
                className="mb-3 text-sm font-medium"
                style={{ color: labelTextColor }}
              >
                Gender
              </Text>
              <View className="flex-row gap-3">
                {['Male', 'Female', 'Other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setGender(option.toLowerCase())}
                    activeOpacity={0.7}
                    className="flex-1 items-center justify-center rounded-2xl py-4"
                    style={{
                      backgroundColor:
                        gender === option.toLowerCase() ? primaryColor : inputBgColor,
                      borderWidth: 1,
                      borderColor:
                        gender === option.toLowerCase() ? primaryColor : inputBorderColor,
                    }}
                  >
                    <Text
                      className="text-base font-semibold"
                      style={{
                        color: gender === option.toLowerCase() ? '#FFFFFF' : textColor,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Height and Weight - Side by Side */}
            <View className="flex-row gap-3">
              {/* Height */}
              <View className="flex-1">
                <Text
                  className="mb-3 text-sm font-medium"
                  style={{ color: labelTextColor }}
                >
                  Height
                </Text>
                <TextInput
                  className="rounded-2xl px-4 py-4 text-base"
                  style={{
                    backgroundColor: inputBgColor,
                    borderWidth: 1,
                    borderColor: inputBorderColor,
                    color: inputTextColor,
                  }}
                  placeholder="170 cm"
                  placeholderTextColor={placeholderTextColor}
                  value={userHeight}
                  onChangeText={setUserHeight}
                  keyboardType="numeric"
                  autoCorrect={false}
                />
              </View>

              {/* Weight */}
              <View className="flex-1">
                <Text
                  className="mb-3 text-sm font-medium"
                  style={{ color: labelTextColor }}
                >
                  Weight
                </Text>
                <TextInput
                  className="rounded-2xl px-4 py-4 text-base"
                  style={{
                    backgroundColor: inputBgColor,
                    borderWidth: 1,
                    borderColor: inputBorderColor,
                    color: inputTextColor,
                  }}
                  placeholder="70 kg"
                  placeholderTextColor={placeholderTextColor}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View>
              <Text
                className="mb-3 text-sm font-medium"
                style={{ color: labelTextColor }}
              >
                Phone Number
              </Text>
              <View className="flex-row gap-2">
                {/* Country Code Selector */}
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  activeOpacity={0.7}
                  className="flex-row items-center rounded-2xl px-3 py-4"
                  style={{
                    backgroundColor: inputBgColor,
                    borderWidth: 1,
                    borderColor: inputBorderColor,
                    minWidth: 100,
                    minHeight: 52,
                    justifyContent: 'center',
                  }}
                >
                  <Text className="mr-1.5 text-lg">{selectedCountry.flag}</Text>
                  <Text
                    className="text-base font-medium"
                    style={{ color: inputTextColor }}
                  >
                    {selectedCountry.dialCode}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={secondaryTextColor}
                    style={{ marginLeft: 3 }}
                  />
                </TouchableOpacity>

                {/* Phone Number Input */}
                <View className="flex-1">
                  <TextInput
                    className="rounded-2xl px-4 py-4 text-base"
                    style={{
                      backgroundColor: inputBgColor,
                      borderWidth: 1,
                      borderColor: inputBorderColor,
                      color: inputTextColor,
                      minHeight: 52,
                    }}
                    placeholder="98765 43210"
                    placeholderTextColor={placeholderTextColor}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Country Picker Modal */}
            <Modal
              visible={showCountryPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => {
                setShowCountryPicker(false)
                setCountrySearchQuery('')
              }}
            >
              <View
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <View
                  className="rounded-t-3xl"
                  style={{
                    backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
                    maxHeight: height * 0.8,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                  }}
                >
                  {/* Header */}
                  <View
                    className="border-b px-6 py-4"
                    style={{ borderBottomColor: inputBorderColor }}
                  >
                    <View className="mb-4 flex-row items-center justify-between">
                      <Text className="text-xl font-bold" style={{ color: textColor }}>
                        Select Country
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowCountryPicker(false)
                          setCountrySearchQuery('')
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close" size={24} color={textColor} />
                      </TouchableOpacity>
                    </View>

                    {/* Search Input */}
                    <View
                      className="flex-row items-center rounded-2xl px-4 py-3"
                      style={{
                        backgroundColor: isDark ? '#000000' : '#F3F4F6',
                        borderWidth: 1,
                        borderColor: inputBorderColor,
                      }}
                    >
                      <Ionicons name="search" size={20} color={secondaryTextColor} />
                      <TextInput
                        className="ml-3 flex-1 text-base"
                        style={{ color: textColor }}
                        placeholder="Search country..."
                        placeholderTextColor={secondaryTextColor}
                        value={countrySearchQuery}
                        onChangeText={setCountrySearchQuery}
                        autoFocus={true}
                      />
                      {countrySearchQuery.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setCountrySearchQuery('')}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color={secondaryTextColor}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Country List */}
                  <FlatList
                    data={filteredCountries}
                    keyExtractor={(item) => item.code}
                    style={{ maxHeight: height * 0.6 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleCountrySelect(item)}
                        activeOpacity={0.7}
                        className="flex-row items-center px-6 py-4"
                        style={{
                          backgroundColor:
                            selectedCountry.code === item.code
                              ? isDark
                                ? '#2F2F2F'
                                : '#F3F4F6'
                              : 'transparent',
                        }}
                      >
                        <Text className="mr-4 text-2xl">{item.flag}</Text>
                        <View className="flex-1">
                          <Text
                            className="text-base font-medium"
                            style={{ color: textColor }}
                          >
                            {item.name}
                          </Text>
                          <Text className="text-sm" style={{ color: secondaryTextColor }}>
                            {item.dialCode}
                          </Text>
                        </View>
                        {selectedCountry.code === item.code && (
                          <Ionicons name="checkmark" size={20} color={primaryColor} />
                        )}
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: inputBorderColor,
                          marginLeft: 60,
                        }}
                      />
                    )}
                    ListEmptyComponent={
                      <View className="items-center py-8">
                        <Text style={{ color: secondaryTextColor }}>
                          No countries found
                        </Text>
                      </View>
                    }
                  />
                </View>
              </View>
            </Modal>

            {/* City / State */}
            <View>
              <Text
                className="mb-3 text-sm font-medium"
                style={{ color: labelTextColor }}
              >
                City / State
              </Text>
              <TextInput
                className="rounded-2xl px-4 py-4 text-base"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                  color: inputTextColor,
                }}
                placeholder="Bengaluru, Karnataka"
                placeholderTextColor={placeholderTextColor}
                value={cityState}
                onChangeText={setCityState}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Emergency Contact (Optional) */}
            <View>
              <Text
                className="mb-3 text-sm font-medium"
                style={{ color: labelTextColor }}
              >
                Emergency Contact{' '}
                <Text style={{ color: labelTextColor, opacity: 0.7 }}>(optional)</Text>
              </Text>
              <TextInput
                className="rounded-2xl px-4 py-4 text-base"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: 1,
                  borderColor: inputBorderColor,
                  color: inputTextColor,
                }}
                placeholder="9876543210"
                placeholderTextColor={placeholderTextColor}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Gradient Mask - Premium Fade Effect */}
      <LinearGradient
        colors={
          isDark
            ? ['transparent', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', '#000000']
            : [
                'transparent',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0.5)',
                '#FFFFFF',
              ]
        }
        locations={[0, 0.3, 0.7, 1]}
        style={{
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 90 : 76,
          left: 0,
          right: 0,
          height: 100,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Fixed Bottom Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: backgroundColor,
          paddingHorizontal: 24,
          paddingTop: 20,
          paddingBottom: Platform.OS === 'ios' ? 34 : 20,
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          className="items-center justify-center rounded-2xl py-4"
          style={{
            backgroundColor: primaryColor,
          }}
        >
          <Text className="text-base font-semibold text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
