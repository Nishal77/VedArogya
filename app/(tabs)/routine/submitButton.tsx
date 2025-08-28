import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check, Send } from 'lucide-react-native';

interface SubmitButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export default function SubmitButton({ onPress, isLoading = false }: SubmitButtonProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-4 py-4 mb-4">
      <TouchableOpacity
        onPress={onPress}
        disabled={isLoading}
        className={`w-full py-5 rounded-3xl items-center justify-center flex-row ${
          isLoading ? 'bg-[#F4B400]' : 'bg-[#F4B400]'
        }`}
        activeOpacity={0.1}
      >

        <Text className="text-black text-xl font-bold mr-3">
          {isLoading ? 'Saving...' : 'Submit Routine'}
        </Text>
        <Send size={28} color="black" className="mr-3" />
      </TouchableOpacity>
    </View>
  );
}
