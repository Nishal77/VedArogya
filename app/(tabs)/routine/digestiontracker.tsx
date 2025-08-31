import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

export default function DigestionTracker() {
  // Digestion System state
  const [bowelType, setBowelType] = useState('Normal');
  const [bowelNote, setBowelNote] = useState('');
  const [bowelTime, setBowelTime] = useState<Date | null>(null);
  const [showBowelTimePicker, setShowBowelTimePicker] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [bowelEntries, setBowelEntries] = useState<Array<{
    id: string;
    type: string;
    note: string;
    time: Date;
    symptom: string | null;
    date: Date;
  }>>([]);

  // Digestion System handlers
  const handleBowelTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setBowelTime(selectedTime);

      // Auto-save entry when time is picked and bowelType is set
      if (bowelType && selectedTime) {
        const newEntry = {
          id: Date.now().toString(),
          type: bowelType,
          note: bowelNote,
          time: selectedTime,
          symptom: selectedSymptom,
          date: new Date()
        };
        setBowelEntries(prev => [newEntry, ...prev]);
        // Reset form
        setBowelType('Normal');
        setBowelNote('');
        setBowelTime(null);
        setSelectedSymptom(null);
        setShowBowelTimePicker(false);
      }
    }
  };

  const showBowelTimePickerModal = () => {
    setShowBowelTimePicker(true);
  };

  const closeBowelTimePickerModal = () => {
    setShowBowelTimePicker(false);
  };

  const getBowelTypeColor = (type: string) => {
    switch (type) {
      case 'Normal': return 'bg-green-100 text-green-800 border-green-300';
      case 'Hard': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Loose': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getBowelTypeIcon = (type: string) => {
    switch (type) {
      case 'Normal': return '✅';
      case 'Hard': return '🟠';
      case 'Loose': return '🔴';
      default: return '❓';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <View className="px-6 py-4">
      <View className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Digestion / Bowel Movements (Mala)
          </Text>
        </View>

        {/* Bowel Movement Type Selection */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Bowel Movement Type:</Text>
          <View className="flex-row gap-2">
            {['Normal', 'Hard', 'Loose'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setBowelType(type)}
                className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                  bowelType === type 
                    ? 'bg-black/90 border-black/40' 
                    : 'bg-gray-100 border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-sm font-semibold text-center ${
                  bowelType === type ? 'text-white' : 'text-gray-700'
                }`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Symptoms Selection */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Quick Symptoms:</Text>
          <View className="rounded-xl p-4 border border-gray-200">
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setSelectedSymptom(selectedSymptom === 'Discomfort' ? null : 'Discomfort')}
                className={`flex-1 py-3 px-4 rounded-xl border mr-2 ${
                  selectedSymptom === 'Discomfort' 
                    ? 'bg-orange-100 border-orange-500' 
                    : 'bg-white border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-center font-semibold text-sm ${
                  selectedSymptom === 'Discomfort' ? 'text-orange-800' : 'text-gray-700'
                }`}>
                  Discomfort
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setSelectedSymptom(selectedSymptom === 'Acidity' ? null : 'Acidity')}
                className={`flex-1 py-3 px-4 rounded-xl border ${
                  selectedSymptom === 'Acidity' 
                    ? 'bg-red-100 border-red-500' 
                    : 'bg-white border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-center font-semibold text-sm ${
                  selectedSymptom === 'Acidity' ? 'text-red-800' : 'text-gray-700'
                }`}>
                  Acidity
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between mt-3">
              <TouchableOpacity
                onPress={() => setSelectedSymptom(selectedSymptom === 'Bloating' ? null : 'Bloating')}
                className={`flex-1 py-3 px-4 rounded-xl border mr-2 ${
                  selectedSymptom === 'Bloating' 
                    ? 'bg-yellow-100 border-yellow-500' 
                    : 'bg-white border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-center font-semibold text-sm ${
                  selectedSymptom === 'Bloating' ? 'text-yellow-800' : 'text-gray-700'
                }`}>
                  Bloating
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setSelectedSymptom(selectedSymptom === 'Pain' ? null : 'Pain')}
                className={`flex-1 py-1 px-4 rounded-xl border ${
                  selectedSymptom === 'Pain' 
                    ? 'bg-purple-100 border-purple-500' 
                    : 'bg-white border-gray-300'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-center font-semibold text-sm ${
                  selectedSymptom === 'Pain' ? 'text-purple-800' : 'text-gray-700'
                }`}>
                  Pain
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Optional Notes */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Optional Notes:</Text>
          <TextInput
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-gray-700 text-base"
            placeholder="Any additional notes about your digestion..."
            placeholderTextColor="#9CA3AF"
            value={bowelNote}
            onChangeText={setBowelNote}
            multiline
            numberOfLines={3}
            returnKeyType="done"
          />
        </View>

        {/* Timing Section */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Timing:</Text>
          <TouchableOpacity
            onPress={showBowelTimePickerModal}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  {bowelTime ? formatTime(bowelTime) : 'No time set'}
                </Text>
                <Text className="text-sm text-gray-500 mb-2">
                  {bowelTime 
                    ? 'You have set your bowel movement time.' 
                    : 'Tap to choose the time for your bowel movement.'}
                </Text>
              </View>
              <View className="border border-blue-600 rounded-xl px-3 py-1 bg-blue-50 ml-1">
                <Text className="text-base font-semibold text-blue-700">Set Time</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Entries */}
        {bowelEntries.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Recent Entries:</Text>
            {bowelEntries.slice(0, 3).map((entry) => (
              <View key={entry.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Text className="text-3xl mr-3">{getBowelTypeIcon(entry.type)}</Text>
                    <View>
                      <Text className={`text-lg font-bold ${getBowelTypeColor(entry.type)} px-3 py-1 rounded-full`}>
                        {entry.type}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        {entry.date.toLocaleDateString()} at {formatTime(entry.time)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {entry.note && (
                  <Text className="text-gray-700 text-sm mt-2 italic">
                    "{entry.note}"
                  </Text>
                )}
                
                {entry.symptom && (
                  <View className="flex-row mt-3 pt-3 border-t border-gray-200">
                    <Text className={`px-3 py-1 rounded-full text-xs font-medium ${
                      entry.symptom === 'Discomfort' ? 'bg-orange-100 text-orange-800' :
                      entry.symptom === 'Acidity' ? 'bg-red-100 text-red-800' :
                      entry.symptom === 'Bloating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {entry.symptom}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Bowel Time Picker Popup Modal */}
      <Modal
        visible={showBowelTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={closeBowelTimePickerModal}
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
                Set Bowel Movement Time
              </Text>
              <TouchableOpacity
                onPress={closeBowelTimePickerModal}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                activeOpacity={0.7}
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Time Picker */}
            <View className="items-center mb-6 bg-white rounded-2xl p-4">
              <DateTimePicker
                value={bowelTime || new Date()}
                mode="time"
                display="spinner"
                onChange={handleBowelTimeChange}
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
                onPress={closeBowelTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl border border-gray-300"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={closeBowelTimePickerModal}
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-600"
                activeOpacity={0.7}
              >
                <Text className="text-white text-center font-medium">
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
