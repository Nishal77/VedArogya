import React from 'react';
import { View, Text } from 'react-native';
import { ChatMessage as ChatMessageType } from '../utils/aiService';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Function to render text with styled headings
  const renderStyledText = (content: string) => {
    if (isUser) {
      return content; // User messages don't need heading styling
    }

    // Clean the content by removing markdown symbols
    const cleanContent = content
      .replace(/\*\*/g, '') // Remove double asterisks
      .replace(/\*/g, '')   // Remove single asterisks
      .replace(/`/g, '')    // Remove backticks
      .replace(/#/g, '')    // Remove hash symbols
      .replace(/- /g, '')   // Remove dash list markers
      .replace(/\n- /g, '\n') // Remove newline dash markers
      .trim();

    // Split content by lines to process each line separately
    const lines = cleanContent.split('\n');
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line is a heading (ends with colon, is short, or contains common heading words)
      const isHeading = (
        trimmedLine.endsWith(':') ||
        trimmedLine.length < 50 ||
        /^(Ayurveda|Yoga|Wellness|Diet|Sleep|Stress|Exercise|Meditation|Breathing|Routine|Balance|Dosha|Ojas|Agni|Vata|Pitta|Kapha|Dinacharya|Ritucharya|Ahara|Nidra|Vihara)/i.test(trimmedLine)
      );

      if (isHeading && trimmedLine.length > 0) {
        return (
          <Text key={index} className="text-black font-bold text-base leading-6 mb-1">
            {line}
          </Text>
        );
      } else if (trimmedLine.length > 0) {
        return (
          <Text key={index} className="text-gray-800 text-base leading-6 mb-1">
            {line}
          </Text>
        );
      } else {
        // Empty line for spacing
        return <Text key={index} className="h-2" />;
      }
    });
  };
  
  return (
    <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <View 
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-gray-200 rounded-br-md' 
            : 'bg-gray-100 rounded-bl-md border border-gray-200'
        }`}
      >
        {isUser ? (
          <Text className="text-black text-base leading-6">
            {message.content}
          </Text>
        ) : (
          <View>
            {renderStyledText(message.content)}
          </View>
        )}
        
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
