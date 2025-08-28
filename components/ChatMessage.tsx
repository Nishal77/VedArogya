import React from 'react';
import { View, Text } from 'react-native';
import { ChatMessage as ChatMessageType } from '../utils/aiService';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <View 
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-500 rounded-br-md' 
            : 'bg-gray-100 rounded-bl-md border border-gray-200'
        }`}
      >
        <Text 
          className={`text-base leading-6 ${
            isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.content}
        </Text>
        
        {/* Timestamp */}
        <Text 
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );
}
