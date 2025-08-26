import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert
} from 'react-native';

export default function KeyboardTest() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  const testKeyboard = () => {
    Alert.alert(
      'Keyboard Test',
      'Tap on any input field above to test keyboard functionality. The keyboard should appear immediately.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-center mb-8 text-gray-900">
          Keyboard Test
        </Text>
        
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-xl mb-6"
          onPress={testKeyboard}
        >
          <Text className="text-white text-center font-semibold">
            Test Keyboard Instructions
          </Text>
        </TouchableOpacity>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="space-y-6">
              {/* Test Input 1 */}
              <View>
                <Text className="text-gray-700 font-semibold mb-2">Test Input 1</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-gray-900 text-base"
                  placeholder="Tap here to test keyboard 1"
                  placeholderTextColor="#9CA3AF"
                  value={text1}
                  onChangeText={setText1}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically={true}
                />
              </View>

              {/* Test Input 2 */}
              <View>
                <Text className="text-gray-700 font-semibold mb-2">Test Input 2</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-gray-900 text-base"
                  placeholder="Tap here to test keyboard 2"
                  placeholderTextColor="#9CA3AF"
                  value={text2}
                  onChangeText={setText2}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  enablesReturnKeyAutomatically={true}
                />
              </View>

              {/* Test Input 3 */}
              <View>
                <Text className="text-gray-700 font-semibold mb-2">Test Input 3</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-gray-900 text-base"
                  placeholder="Tap here to test keyboard 3"
                  placeholderTextColor="#9CA3AF"
                  value={text3}
                  onChangeText={setText3}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  enablesReturnKeyAutomatically={true}
                />
              </View>

              {/* Status Display */}
              <View className="bg-gray-100 rounded-xl p-4 mt-8">
                <Text className="text-gray-700 font-medium mb-2">Current Values:</Text>
                <Text className="text-gray-600">Input 1: {text1 || 'empty'}</Text>
                <Text className="text-gray-600">Input 2: {text2 || 'empty'}</Text>
                <Text className="text-gray-600">Input 3: {text3 || 'empty'}</Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
