import React, { useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from './header';
import AIInput from './aiinput';
import AIService from '../../../utils/aiService';

export default function AIScreen() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const aiService = useRef(AIService.getInstance()).current;

  const handleClearConversation = () => {
    aiService.clearConversation();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar style="dark" />

      {/* Fixed Header */}
      <View className="bg-white border-b border-gray-100">
        <Header onClearConversation={handleClearConversation} />
      </View>

      {/* AI Input Component - Full Screen Chat Interface */}
      <AIInput
        onFocusChange={setIsInputFocused}
      />
    </SafeAreaView>
  );
}
