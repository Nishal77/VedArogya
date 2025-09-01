import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MessageSquare } from 'lucide-react-native';

interface NotesInputProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function NotesInput({ notes, onNotesChange }: NotesInputProps) {
  return (
    <View className="px-6 py-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Additional Notes (Optional)
      </Text>
      
      <View className="bg-white border border-gray-200 rounded-xl p-3">
        <View className="flex-row items-start">
          <TextInput
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Any special requirements or symptoms you'd like to mention..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            className="flex-1 text-gray-800 text-base"
            textAlignVertical="top"
            style={{
              minHeight: 70,
              paddingVertical: 4,
              paddingHorizontal: 0
            }}
          />
        </View>
      </View>
    </View>
  );
}
