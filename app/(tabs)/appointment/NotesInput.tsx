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
        <View className="flex-row items-start mb-2">
          <MessageSquare size={16} color="#6B7280" className="mr-2 mt-1" />
          <Text className="text-sm text-gray-600">
            Any special requirements or symptoms you'd like to mention
          </Text>
        </View>
        
        <TextInput
          value={notes}
          onChangeText={onNotesChange}
          placeholder="Enter any additional notes here..."
          multiline
          numberOfLines={4}
          className="text-gray-800 text-base"
          textAlignVertical="top"
          style={{
            minHeight: 80,
            paddingVertical: 8
          }}
        />
      </View>
    </View>
  );
}
