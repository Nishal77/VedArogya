import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Clock, Bed, Sunrise, Moon } from 'lucide-react-native';

export default function SleepTracker() {
  // Sleep tracking state
  const [bedtime, setBedtime] = useState<string>('');
  const [wakeUpTime, setWakeUpTime] = useState<string>('');
  const [hoursSlept, setHoursSlept] = useState<number | null>(null);
  const [sleepQuality, setSleepQuality] = useState<string | null>(null);
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [tempBedtime, setTempBedtime] = useState<string>('');
  const [tempWakeUpTime, setTempWakeUpTime] = useState<string>('');

  // Sleep quality options
  const sleepQualityOptions = [
    { label: 'Excellent', emoji: '😴', description: 'Perfect, deep sleep', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { label: 'Good', emoji: '😊', description: 'Restful sleep', color: 'bg-green-100 text-green-800 border-green-300' },
    { label: 'Disturbed', emoji: '😵', description: 'Frequent interruptions', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { label: 'Poor', emoji: '😫', description: 'Very poor sleep quality', color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  // Calculate hours slept when both times are set
  useEffect(() => {
    if (bedtime && wakeUpTime) {
      const hours = calculateHoursSlept(bedtime, wakeUpTime);
      setHoursSlept(hours);
    }
  }, [bedtime, wakeUpTime]);

  const calculateHoursSlept = (bed: string, wake: string): number => {
    const [bedHour, bedMinute] = bed.split(':').map(Number);
    const [wakeHour, wakeMinute] = wake.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMinute;
    let wakeMinutes = wakeHour * 60 + wakeMinute;
    
    // Handle overnight sleep (bedtime is later than wake time)
    if (bedMinutes > wakeMinutes) {
      wakeMinutes += 24 * 60; // Add 24 hours
    }
    
    const totalMinutes = wakeMinutes - bedMinutes;
    return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
  };

  const formatTime = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSleepQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Good': return 'bg-green-100 text-green-800 border-green-300';
      case 'Disturbed': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Poor': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSleepQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Excellent': return '😴';
      case 'Good': return '😊';
      case 'Disturbed': return '😵';
      case 'Poor': return '😫';
      default: return '😴';
    }
  };

  const getSleepStatus = (hours: number): { status: string; color: string; description: string } => {
    if (hours >= 7 && hours <= 9) {
      return { status: 'Optimal', color: 'bg-green-100 text-green-800', description: 'Perfect amount of sleep' };
    } else if (hours >= 6 && hours < 7) {
      return { status: 'Good', color: 'bg-blue-100 text-blue-800', description: 'Adequate sleep' };
    } else if (hours >= 5 && hours < 6) {
      return { status: 'Fair', color: 'bg-yellow-100 text-yellow-800', description: 'Could use more sleep' };
    } else if (hours < 5) {
      return { status: 'Poor', color: 'bg-red-100 text-red-800', description: 'Insufficient sleep' };
    } else {
      return { status: 'Excessive', color: 'bg-purple-100 text-purple-800', description: 'Too much sleep' };
    }
  };

  const openBedtimePicker = () => {
    setTempBedtime(bedtime);
    setShowBedtimePicker(true);
  };

  const openWakeUpPicker = () => {
    setTempWakeUpTime(wakeUpTime);
    setShowWakeUpPicker(true);
  };

  const confirmBedtime = () => {
    setBedtime(tempBedtime);
    setShowBedtimePicker(false);
  };

  const confirmWakeUpTime = () => {
    setWakeUpTime(tempWakeUpTime);
    setShowWakeUpPicker(false);
  };

  const clearAll = () => {
    setBedtime('');
    setWakeUpTime('');
    setHoursSlept(null);
    setSleepQuality(null);
  };

      return (
      <View className="px-6 py-4">
        <View className="bg-white rounded-2xl p-4 border border-gray-200">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Sleep (Nidra)
            </Text>
            <Text className="text-sm text-gray-600">
              Track your sleep patterns and quality
            </Text>
          </View>
        </View>

        {/* Time Selection Section */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Sleep Schedule:</Text>
          
          {/* Bedtime Selection */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-600 flex-row items-center">
                <Moon size={16} color="#6B7280" className="mr-2" />
                Bedtime:
              </Text>
              {bedtime && (
                <TouchableOpacity
                  onPress={() => setBedtime('')}
                  className="w-6 h-6 bg-gray-100 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-600 text-sm font-bold">×</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={openBedtimePicker}
              className={`py-4 px-4 rounded-xl border-2 ${
                bedtime ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50 border-gray-200'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-lg font-semibold text-center ${
                bedtime ? 'text-indigo-800' : 'text-gray-500'
              }`}>
                {bedtime ? formatTime(bedtime) : 'Set Bedtime'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wake-up Time Selection */}
          <View className="mb-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-600 flex-row items-center">
                <Sunrise size={16} color="#6B7280" className="mr-2" />
                Wake-up Time:
              </Text>
              {wakeUpTime && (
                <TouchableOpacity
                  onPress={() => setWakeUpTime('')}
                  className="w-6 h-6 bg-gray-100 rounded-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-600 text-sm font-bold">×</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={openWakeUpPicker}
              className={`py-4 px-4 rounded-xl border-2 ${
                wakeUpTime ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-lg font-semibold text-center ${
                wakeUpTime ? 'text-orange-800' : 'text-gray-500'
              }`}>
                {wakeUpTime ? formatTime(wakeUpTime) : 'Set Wake-up Time'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hours Slept Display */}
          {hoursSlept !== null && (
            <View className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-blue-800">Hours Slept:</Text>
                  <Text className="text-2xl font-bold text-blue-900">{hoursSlept} hours</Text>
                </View>
                <View className="items-end">
                  <Text className={`text-sm font-semibold px-3 py-1 rounded-full ${getSleepStatus(hoursSlept).color}`}>
                    {getSleepStatus(hoursSlept).status}
                  </Text>
                  <Text className="text-xs text-blue-600 mt-1 text-right">
                    {getSleepStatus(hoursSlept).description}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Sleep Quality Selection */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-gray-700">Sleep Quality:</Text>
            {sleepQuality && (
              <TouchableOpacity
                onPress={() => setSleepQuality(null)}
                className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center border border-purple-200"
                activeOpacity={0.7}
              >
                <Text className="text-purple-600 text-lg font-bold">×</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <View className="flex-row flex-wrap justify-between">
              {sleepQualityOptions.map((quality) => (
                <TouchableOpacity
                  key={quality.label}
                  onPress={() => setSleepQuality(quality.label)}
                  className={`w-[48%] py-4 px-3 rounded-xl border mb-3 ${
                    sleepQuality === quality.label 
                      ? 'bg-white border-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'bg-white/80 border-purple-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text className="text-3xl mb-2">{quality.emoji}</Text>
                    <Text className={`text-sm font-semibold text-center ${
                      sleepQuality === quality.label ? 'text-purple-800' : 'text-gray-700'
                    }`}>
                      {quality.label}
                    </Text>
                    <Text className={`text-xs text-center mt-1 ${
                      sleepQuality === quality.label ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {quality.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Clear All Button */}
        {(bedtime || wakeUpTime || sleepQuality) && (
          <View className="mb-4">
            <TouchableOpacity
              onPress={clearAll}
              className="py-3 px-4 bg-gray-100 rounded-xl border border-gray-200"
              activeOpacity={0.7}
            >
              <Text className="text-center text-gray-600 font-semibold">Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Current Selection Display */}
        {(bedtime || wakeUpTime || sleepQuality) && (
          <View className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <Text className="text-sm font-semibold text-indigo-800 mb-2">Current Sleep Record:</Text>
            <View className="space-y-2">
              {bedtime && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Bedtime:</Text>
                  <Text className="text-sm font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {formatTime(bedtime)}
                  </Text>
                </View>
              )}
              {wakeUpTime && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Wake-up:</Text>
                  <Text className="text-sm font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {formatTime(wakeUpTime)}
                  </Text>
                </View>
              )}
              {hoursSlept !== null && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Duration:</Text>
                  <Text className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {hoursSlept} hours
                  </Text>
                </View>
              )}
              {sleepQuality && (
                <View className="flex-row items-center">
                  <Text className="text-gray-600 text-sm mr-2">Quality:</Text>
                  <Text className={`text-sm font-semibold ${getSleepQualityColor(sleepQuality)} px-2 py-1 rounded-full`}>
                    {getSleepQualityIcon(sleepQuality)} {sleepQuality}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Bedtime Picker Modal */}
        <Modal
          visible={showBedtimePicker}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl p-6 w-80">
              <Text className="text-lg font-bold text-gray-800 mb-4 text-center">Set Bedtime</Text>
              <View className="space-y-4">
                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm text-gray-600 mb-2 text-center">Enter time in 24-hour format</Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl p-3 text-center text-lg font-mono"
                    placeholder="23:30"
                    value={tempBedtime}
                    onChangeText={(text) => {
                      // Only allow HH:MM format
                      const cleaned = text.replace(/[^0-9:]/g, '');
                      if (cleaned.length <= 5) {
                        setTempBedtime(cleaned);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Text className="text-xs text-gray-500 mt-2 text-center">Example: 23:30 for 11:30 PM</Text>
                  
                  {/* Quick Time Presets */}
                  <View className="mt-3">
                    <Text className="text-xs text-gray-600 mb-2 text-center">Quick Select:</Text>
                    <View className="flex-row flex-wrap justify-center space-x-2">
                      {['22:00', '22:30', '23:00', '23:30', '00:00'].map((time) => (
                        <TouchableOpacity
                          key={time}
                          onPress={() => setTempBedtime(time)}
                          className="px-3 py-1 bg-indigo-100 rounded-full border border-indigo-200"
                        >
                          <Text className="text-xs text-indigo-700 font-medium">{time}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => setShowBedtimePicker(false)}
                    className="flex-1 py-3 bg-gray-200 rounded-xl"
                  >
                    <Text className="text-center font-semibold text-gray-700">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirmBedtime}
                    className="flex-1 py-3 bg-indigo-500 rounded-xl"
                    disabled={!tempBedtime || !tempBedtime.includes(':')}
                  >
                    <Text className="text-center font-semibold text-white">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Wake-up Time Picker Modal */}
        <Modal
          visible={showWakeUpPicker}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl p-6 w-80">
              <Text className="text-lg font-bold text-gray-800 mb-4 text-center">Set Wake-up Time</Text>
              <View className="space-y-4">
                <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm text-gray-600 mb-2 text-center">Enter time in 24-hour format</Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl p-3 text-center text-lg font-mono"
                    placeholder="07:00"
                    value={tempWakeUpTime}
                    onChangeText={(text) => {
                      // Only allow HH:MM format
                      const cleaned = text.replace(/[^0-9:]/g, '');
                      if (cleaned.length <= 5) {
                        setTempWakeUpTime(cleaned);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Text className="text-xs text-gray-500 mt-2 text-center">Example: 07:00 for 7:00 AM</Text>
                  
                  {/* Quick Time Presets */}
                  <View className="mt-3">
                    <Text className="text-xs text-gray-600 mb-2 text-center">Quick Select:</Text>
                    <View className="flex-row flex-wrap justify-center space-x-2">
                      {['05:00', '06:00', '07:00', '08:00', '09:00'].map((time) => (
                        <TouchableOpacity
                          key={time}
                          onPress={() => setTempWakeUpTime(time)}
                          className="px-3 py-1 bg-orange-100 rounded-full border border-orange-200"
                        >
                          <Text className="text-xs text-orange-700 font-medium">{time}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => setShowWakeUpPicker(false)}
                    className="flex-1 py-3 bg-gray-200 rounded-xl"
                  >
                    <Text className="text-center font-semibold text-gray-700">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirmWakeUpTime}
                    className="flex-1 py-3 bg-orange-500 rounded-xl"
                    disabled={!tempWakeUpTime || !tempWakeUpTime.includes(':')}
                  >
                    <Text className="text-center font-semibold text-white">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
