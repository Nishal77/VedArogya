import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Clock, BellRing, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useRoutine } from '../../../utils/RoutineContext';
import { formatTimeForDB, calculateSleepDuration, parseTimeFromDB } from '../../../utils/routineService';

export interface SleepInputRef {
  getSleepData: () => any;
  clearForm: () => void;
}

const SleepInput = forwardRef<SleepInputRef>((props, ref) => {
  const { todayRoutine } = useRoutine();
  
  const [wakeUpTime, setWakeUpTime] = useState<Date | null>(null);
  const [sleepTime, setSleepTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSleepTimePicker, setShowSleepTimePicker] = useState(false);

  // Sleep Quality state
  const [sleepQuality, setSleepQuality] = useState<'Slept Well' | 'Woke Up Once' | 'Restless'>('Slept Well');
  const [morningFeeling, setMorningFeeling] = useState<'Fresh' | 'Okay' | 'Tired'>('Fresh');

  // Load existing routine data when component mounts or todayRoutine changes
  useEffect(() => {
    if (todayRoutine?.sleep) {
      const sleep = todayRoutine.sleep;
      
      // Load sleep time using the new parsing function
      if (sleep.sleep_time) {
        const parsedSleepTime = parseTimeFromDB(sleep.sleep_time);
        if (parsedSleepTime) {
          setSleepTime(parsedSleepTime);
        }
      }
      
      // Load wake up time using the new parsing function
      if (sleep.wake_time) {
        const parsedWakeTime = parseTimeFromDB(sleep.wake_time);
        if (parsedWakeTime) {
          setWakeUpTime(parsedWakeTime);
        }
      }
      
      // Load sleep quality data
      if (sleep.quality) setSleepQuality(sleep.quality);
      if (sleep.morning_feeling) setMorningFeeling(sleep.morning_feeling);
    }
  }, [todayRoutine]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setWakeUpTime(selectedTime);
    }
  };

  const handleSleepTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setSleepTime(selectedTime);
    }
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const showSleepTimePickerModal = () => {
    setShowSleepTimePicker(true);
  };

  const closeTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const closeSleepTimePickerModal = () => {
    setShowSleepTimePicker(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSleepDurationText = () => {
    if (sleepTime && wakeUpTime) {
      const sleepTimeStr = formatTimeForDB(sleepTime);
      const wakeTimeStr = formatTimeForDB(wakeUpTime);
      const duration = calculateSleepDuration(sleepTimeStr, wakeTimeStr);
      
      const hours = Math.floor(duration);
      const minutes = Math.round((duration - hours) * 60);
      
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${minutes}m`;
      }
    }
    return null;
  };

  // Expose the sleep data to parent component
  const getSleepData = () => {
    const sleepData: any = {};
    
    if (sleepTime) {
      sleepData.sleep_time = formatTimeForDB(sleepTime);
    }
    
    if (wakeUpTime) {
      sleepData.wake_time = formatTimeForDB(wakeUpTime);
    }
    
    if (sleepQuality) {
      sleepData.quality = sleepQuality;
    }
    
    if (morningFeeling) {
      sleepData.morning_feeling = morningFeeling;
    }
    
    // Calculate duration if both times are available
    if (sleepTime && wakeUpTime) {
      const sleepTimeStr = formatTimeForDB(sleepTime);
      const wakeTimeStr = formatTimeForDB(wakeUpTime);
      sleepData.duration_hours = calculateSleepDuration(sleepTimeStr, wakeTimeStr);
    }
    
    return sleepData;
  };

  // Clear the form data after successful submission
  const clearForm = () => {
    setSleepTime(null);
    setWakeUpTime(null);
    setSleepQuality('Slept Well');
    setMorningFeeling('Fresh');
  };

  // Make these functions available to parent component
  useImperativeHandle(ref, () => ({
    getSleepData,
    clearForm
  }));

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Clock size={20} color="#374151" />
        <Text className="text-lg font-bold text-gray-800 ml-2">
          Sleep & Wake Up Time
        </Text>
      </View>

      {/* Sleep Time Row */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Sleep Time:</Text>
        <View className="flex-row items-center justify-between">
          {/* Current Sleep Time Display */}
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {sleepTime ? formatTime(sleepTime) : '-- ---'}
            </Text>
            <Text className="text-sm text-gray-500">
              {sleepTime ? 'Your bedtime' : 'Tap to set sleep time'}
            </Text>
          </View>

          {/* Sleep Time Picker Button */}
          <TouchableOpacity
            onPress={showSleepTimePickerModal}
            className="bg-gray-100 rounded-2xl p-3 items-center justify-center flex-row"
            activeOpacity={0.7}
          >
            <Text className="text-lg mr-2">😴</Text>
            <Text className="text-base font-semibold text-gray-700">
              Set
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wake Up Time Row */}
      <View className="mb-2">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Wake Up Time:</Text>
        <View className="flex-row items-center justify-between">
          {/* Current Wake Up Time Display */}
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {wakeUpTime ? formatTime(wakeUpTime) : '-- ---'}
            </Text>
            <Text className="text-sm text-gray-500">
              {wakeUpTime ? 'Your daily wake up time' : 'Tap to set wake up time'}
            </Text>
          </View>

          {/* Wake Up Time Picker Button */}
          <TouchableOpacity
            onPress={showTimePickerModal}
            className="bg-gray-100 rounded-2xl p-3 items-center justify-center flex-row"
            activeOpacity={0.7}
          >
            <View className="mr-2">
              <BellRing size={20} color="#374151" />
            </View>
            <Text className="text-base font-semibold text-gray-700">
              Set
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sleep Duration Display */}
      {getSleepDurationText() && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">Sleep Duration:</Text>
            <Text className="text-sm font-semibold text-blue-600">
              {getSleepDurationText()}
            </Text>
          </View>
        </View>
      )}

      {/* Sleep Quality Section */}
      <View className="mt-4 pt-4 border-t border-gray-100">
        {/* Sleep Quality */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Sleep Quality:</Text>
          <Text className="text-xs text-gray-500 mb-3 italic">
            Note: This should be filled in the morning only
          </Text>
          
          <View className="flex-row gap-2">
            {[
              { key: 'Slept Well', color: 'bg-green-100 border-green-300' },
              { key: 'Woke Up Once', color: 'bg-yellow-100 border-yellow-300' },
              { key: 'Restless', color: 'bg-red-100 border-red-300' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSleepQuality(option.key as any)}
                className={`flex-1 px-3 py-3 rounded-xl border ${
                  sleepQuality === option.key 
                    ? `${option.color} border-2` 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-medium text-center ${
                  sleepQuality === option.key ? 'text-gray-800' : 'text-gray-700'
                }`}>
                  {option.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Morning Feeling */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">How do you feel this morning?</Text>
          <View className="flex-row gap-2">
            {[
              { key: 'Fresh', color: 'bg-green-100 border-green-300' },
              { key: 'Okay', color: 'bg-yellow-100 border-yellow-300' },
              { key: 'Tired', color: 'bg-red-100 border-red-300' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setMorningFeeling(option.key as any)}
                className={`flex-1 px-3 py-3 rounded-xl border ${
                  morningFeeling === option.key 
                    ? `${option.color} border-2` 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-medium text-center ${
                  morningFeeling === option.key ? 'text-gray-800' : 'text-gray-700'
                }`}>
                  {option.key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Text */}
        <View className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <Text className="text-sm text-blue-700 text-center">
            💡 Your sleep data will be saved when you click the main "Submit Routine" button below
          </Text>
        </View>
      </View>

      {/* Sleep Time Picker Popup Modal */}
      <Modal
        visible={showSleepTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSleepTimePickerModal}
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
                Set Sleep Time
              </Text>
              <TouchableOpacity
                onPress={closeSleepTimePickerModal}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Time Picker */}
            <View className="items-center mb-6 bg-white rounded-2xl p-4">
              <DateTimePicker
                value={sleepTime || new Date()}
                mode="time"
                display="spinner"
                onChange={handleSleepTimeChange}
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
                onPress={closeSleepTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-300"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={closeSleepTimePickerModal}
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
    </View>
  );
});

SleepInput.displayName = 'SleepInput';

export default SleepInput;
