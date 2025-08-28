import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, Modal } from 'react-native';
import { Clock, ChevronDown, Plus, Minus, BellRing, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

export default function RoutineInput() {
  const [wakeUpTime, setWakeUpTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Meals state
  const [mealType, setMealType] = useState('Breakfast');
  const [mealFood, setMealFood] = useState('');
  const [mealPortion, setMealPortion] = useState('Normal');
  const [mealFeeling, setMealFeeling] = useState('Light');
  const [mealTime, setMealTime] = useState<Date | null>(null);
  const [showMealTimePicker, setShowMealTimePicker] = useState(false);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);

  // Water/Drinks state
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [waterGoal, setWaterGoal] = useState(8);
  const [waterUnit, setWaterUnit] = useState('glasses');

  // Activity/Exercise state
  const [selectedActivity, setSelectedActivity] = useState('Yoga');
  const [activityDuration, setActivityDuration] = useState(15);
  const [activityIntensity, setActivityIntensity] = useState('Medium');

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setWakeUpTime(selectedTime);
    }
  };

  const handleMealTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setMealTime(selectedTime);
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const showMealTimePickerModal = () => {
    setShowMealTimePicker(true);
  };

  const closeTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const closeMealTimePickerModal = () => {
    setShowMealTimePicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleWaterIncrement = () => {
    setWaterGlasses(waterGlasses + 1);
  };

  const handleWaterDecrement = () => {
    if (waterGlasses > 0) {
      setWaterGlasses(waterGlasses - 1);
    }
  };

  const handleGoalIncrement = () => {
    setWaterGoal(waterGoal + 1);
    // If current water is less than new goal, update it
    if (waterGlasses < waterGoal + 1) {
      setWaterGlasses(waterGoal + 1);
    }
  };

  const handleGoalDecrement = () => {
    if (waterGoal > 8) {
      setWaterGoal(waterGoal - 1);
      // If current water exceeds new goal, adjust it
      if (waterGlasses > waterGoal - 1) {
        setWaterGlasses(waterGoal - 1);
      }
    }
  };

  const handleDurationIncrement = () => {
    if (activityDuration < 120) {
      setActivityDuration(activityDuration + 5);
    }
  };

  const handleDurationDecrement = () => {
    if (activityDuration > 5) {
      setActivityDuration(activityDuration - 5);
    }
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const portions = ['Small', 'Normal', 'Large'];
  const feelings = [
    { key: 'Light', emoji: '😊' },
    { key: 'Heavy', emoji: '😐' },
    { key: 'Bloated', emoji: '🤢' }
  ];

  const activities = [
    { key: 'Yoga', emoji: '🧘' },
    { key: 'Walk', emoji: '🚶' },
    { key: 'Gym', emoji: '🏋️' }
  ];

  const intensities = ['Low', 'Medium', 'High'];

  const waterProgress = Math.min((waterGlasses / waterGoal) * 100, 100);
  const isGoalMet = waterGlasses >= waterGoal;
  const isOverGoal = waterGlasses > waterGoal;

  return (
    <View className="px-6 py-4">
      {/* Wake Up Time Section */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <Clock size={20} color="#374151" />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Wake Up Time
          </Text>
        </View>

        {/* Time Display and Picker */}
        <View className="flex-row items-center justify-between">
          {/* Current Time Display */}
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {wakeUpTime ? formatTime(wakeUpTime) : '-- ---'}
            </Text>
            <Text className="text-sm text-gray-500">
              {wakeUpTime ? 'Your daily wake up time' : 'Tap to set wake up time'}
            </Text>
          </View>

          {/* Time Picker Button */}
          <TouchableOpacity
            onPress={showTimePickerModal}
            className="bg-gray-100 rounded-2xl p-3 items-center justify-center flex-row"
            activeOpacity={0.7}
          >
            <Text className="text-lg mr-2">
            <BellRing size={20} color="#374151" />
            </Text>
            <Text className="text-base font-semibold text-gray-700">
              Set Time
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Meals Section */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Meals (Ahara)
          </Text>
        </View>

        {/* Meal Type Dropdown */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Meal Type:</Text>
          <View className="flex-row flex-wrap gap-2">
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setMealType(type)}
                className={`px-4 py-2 rounded-xl border ${
                  mealType === type 
                    ? 'bg-gray-300 border-gray-500' 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-medium ${
                  mealType === type ? 'text-black' : 'text-gray-700'
                }`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Food Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Food Items:</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 text-sm text-gray-800"
              style={{ minHeight: 40 }}
              placeholder="Rice + Dal, Salad, Chapati..."
              placeholderTextColor="#9CA3AF"
              value={mealFood}
              onChangeText={setMealFood}
              multiline
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Portion Selection */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Portion:</Text>
          <View className="flex-row gap-2">
            {portions.map((portion) => (
              <TouchableOpacity
                key={portion}
                onPress={() => setMealPortion(portion)}
                className={`flex-1 px-3 py-3 rounded-xl border ${
                  mealPortion === portion 
                    ? 'bg-gray-300 border-gray-500' 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-medium text-center ${
                  mealPortion === portion ? 'text-black' : 'text-gray-700'
                }`}>
                  {portion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feeling Selection */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Feeling:</Text>
          <View className="flex-row gap-2">
            {feelings.map((feeling) => (
              <TouchableOpacity
                key={feeling.key}
                onPress={() => setMealFeeling(feeling.key)}
                className={`flex-1 px-3 py-3 rounded-xl border ${
                  mealFeeling === feeling.key 
                    ? 'bg-gray-300 border-gray-500' 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-lg mr-2">{feeling.emoji}</Text>
                  <Text className={`text-sm font-medium ${
                    mealFeeling === feeling.key ? 'text-black' : 'text-gray-700'
                  }`}>
                    {feeling.key}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meal Time */}
        <View className="mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-2">⏰ Time:</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {mealTime ? formatTime(mealTime) : 'Set Meal Time'}
              </Text>
              <Text className="text-sm text-gray-500">
                {mealTime ? `${mealType} time` : 'Tap to set meal time'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={showMealTimePickerModal}
              className="bg-gray-100 rounded-2xl p-3 items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-lg font-semibold text-gray-700">
                ⏰
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Set
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Water/Drinks Section */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Water / Drinks
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 mr-2">Goal:</Text>
            <Text className="text-sm font-semibold text-blue-600">{waterGoal} {waterUnit}</Text>
          </View>
        </View>

        {/* Progress Display */}
        <View className="mb-6">
          {/* Current Progress */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className={`text-2xl font-bold ${
                waterGlasses < 8 ? 'text-red-500' : 'text-green-600'
              }`}>
                {waterGlasses}
              </Text>
              <Text className="text-lg text-gray-600 ml-1">
                / {waterGoal} glasses
              </Text>
            </View>
            <View className="items-end">
              <Text className={`text-lg font-semibold ${
                waterGlasses < 8 ? 'text-red-500' : 'text-green-600'
              }`}>
                {(waterGlasses * 0.25).toFixed(1)} L
              </Text>
              <Text className="text-sm text-gray-500">
                {(waterGoal * 0.25).toFixed(1)} L goal
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <View 
              className={`h-4 rounded-full ${
                isOverGoal ? 'bg-green-500' : waterGlasses < 8 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(waterProgress, 100)}%` }}
            />
          </View>
          
          {/* Progress Status */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">
              {Math.round(waterProgress)}% complete
            </Text>
            <Text className={`text-sm font-medium ${
              isOverGoal ? 'text-green-600' : waterGlasses < 8 ? 'text-red-600' : 'text-blue-600'
            }`}>
              {isOverGoal ? 'Goal exceeded!' : waterGlasses < 8 ? 'Below goal!' : 'Goal achieved!'}
            </Text>
          </View>
        </View>

        {/* Controls Section */}
        <View className="space-y-4">
          {/* Water Intake Controls */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-3">Add Water Intake:</Text>
            <View className="flex-row items-center justify-center space-x-6">
              {/* Decrease Button */}
              <TouchableOpacity
                onPress={handleWaterDecrement}
                disabled={waterGlasses === 0}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  waterGlasses === 0 ? 'bg-gray-200' : 'bg-red-500'
                }`}
                activeOpacity={0.7}
              >
                <Minus size={24} color={waterGlasses === 0 ? "#9CA3AF" : "white"} />
              </TouchableOpacity>

              {/* Current Value Display */}
              <View className="items-center">
                <Text className={`text-4xl font-bold mx-8 ${
                  waterGlasses < 8 ? 'text-red-500' : 'text-green-600'
                }`}>
                  {waterGlasses}
                </Text>
                <Text className="text-base text-gray-500">
                  glasses
                </Text>
              </View>

              {/* Increase Button */}
              <TouchableOpacity
                onPress={handleWaterIncrement}
                className="w-12 h-12 rounded-full items-center justify-center bg-blue-500"
                activeOpacity={0.7}
              >
                <Plus size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Activity/Exercise Section */}
      <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Activity / Exercise
          </Text>
        </View>

        {/* Activity Selection */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Select Activity:</Text>
          <View className="flex-row gap-2">
            {activities.map((activity) => (
              <TouchableOpacity
                key={activity.key}
                onPress={() => setSelectedActivity(activity.key)}
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  selectedActivity === activity.key 
                    ? 'bg-black/90 border-black' 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-2xl mr-2">{activity.emoji}</Text>
                  <Text className={`text-base font-medium ${
                    selectedActivity === activity.key ? 'text-white' : 'text-gray-700'
                  }`}>
                    {activity.key}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Stepper */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Duration:</Text>
          <View className="flex-row items-center justify-center">
            {/* Decrease Button */}
            <TouchableOpacity
              onPress={handleDurationDecrement}
              disabled={activityDuration === 5}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                activityDuration === 5 ? 'bg-gray-200' : 'bg-red-500'
              }`}
              activeOpacity={0.7}
            >
              <Minus size={24} color={activityDuration === 5 ? "#9CA3AF" : "white"} />
            </TouchableOpacity>

            {/* Current Value Display */}
            <View className="items-center mx-8">
              <Text className="text-3xl font-bold text-orange-600">
                {activityDuration}
              </Text>
              <Text className="text-sm text-gray-500">
                min
              </Text>
            </View>

            {/* Increase Button */}
            <TouchableOpacity
              onPress={handleDurationIncrement}
              disabled={activityDuration === 120}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                activityDuration === 120 ? 'bg-gray-200' : 'bg-lime-500'
              }`}
              activeOpacity={0.7}
            >
              <Plus size={24} color={activityDuration === 120 ? "#9CA3AF" : "white"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Intensity Selection */}
        <View className="mb-2">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Intensity:</Text>
          <View className="flex-row gap-2">
            {intensities.map((intensity) => (
              <TouchableOpacity
                key={intensity}
                onPress={() => setActivityIntensity(intensity)}
                className={`flex-1 px-3 py-3 rounded-xl border ${
                  activityIntensity === intensity 
                    ? 'bg-black/90 border-black' 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-medium text-center ${
                  activityIntensity === intensity ? 'text-white' : 'text-gray-700'
                }`}>
                  {intensity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Wake Up Time Picker Popup Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={closeTimePickerModal}
      >
        <View className="flex-1 justify-center items-center">
          {/* Blurred Background */}
          <BlurView 
            intensity={20} 
            tint="light"
            className="absolute inset-0"
          />
          
          {/* Modal Content */}
          <View className="bg-white rounded-3xl p-6 mx-6 shadow-2xl shadow-black/30">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Set Wake Up Time
              </Text>
              <TouchableOpacity
                onPress={closeTimePickerModal}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Time Picker */}
            <View className="items-center mb-6 bg-white rounded-2xl p-4">
              <DateTimePicker
                value={wakeUpTime || new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={{ 
                  width: 300,
                  backgroundColor: 'white'
                }}
                textColor="black"
                themeVariant="light"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={closeTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-300"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={closeTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#F4B400]"
                activeOpacity={0.7}
              >
                <Text className="text-black text-center font-medium">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Meal Time Picker Popup Modal */}
      <Modal
        visible={showMealTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMealTimePickerModal}
      >
        <View className="flex-1 justify-center items-center">
          {/* Blurred Background */}
          <BlurView 
            intensity={20} 
            tint="light"
            className="absolute inset-0"
          />
          
          {/* Modal Content */}
          <View className="bg-white rounded-3xl p-6 mx-6 shadow-2xl shadow-black/30">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Set {mealType} Time
              </Text>
              <TouchableOpacity
                onPress={closeMealTimePickerModal}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Time Picker */}
            <View className="items-center mb-6 bg-white rounded-2xl p-4">
              <DateTimePicker
                value={mealTime || new Date()}
                mode="time"
                display="spinner"
                onChange={handleMealTimeChange}
                style={{ 
                  width: 300,
                  backgroundColor: 'white'
                }}
                textColor="black"
                themeVariant="light"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={closeMealTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-300"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={closeMealTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#F4B400]"
                activeOpacity={0.7}
              >
                <Text className="text-black text-center font-medium">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
