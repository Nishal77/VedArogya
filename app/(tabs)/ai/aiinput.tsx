import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { 
  Plus, 
  Mic,
  SendHorizontal
} from 'lucide-react-native';
import AIService, { ChatMessage } from '../../../utils/aiService';
import ChatMessageComponent from '../../../components/ChatMessage';

interface AIInputProps {
  onFocusChange?: (isFocused: boolean) => void;
}

export default function AIInput({ onFocusChange }: AIInputProps) {
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const aiService = AIService.getInstance();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleClearConversation = () => {
    aiService.clearConversation();
    setMessages([]);
    console.log('Conversation cleared');
  };

  const handleSend = async () => {
    const trimmedText = inputText.trim();
    
    console.log('handleSend called with text:', trimmedText);
    console.log('Current loading state:', isLoading);
    
    if (!trimmedText || isLoading) {
      console.log('Cannot send: empty text or already loading');
      return;
    }

    try {
      console.log('Sending message:', trimmedText);
      
      // Clear input immediately for better UX
      setInputText('');
      setIsLoading(true);
      inputRef.current?.blur();

      // Send message to AI service
      const response = await aiService.sendMessage(trimmedText);
      console.log('AI response received:', response);
      
      // Update messages with both user input and AI response
      const newMessages = aiService.getConversationHistory();
      setMessages(newMessages);
      
      // Scroll to bottom to show new messages
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your internet connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Restore the input text so user can retry
      setInputText(trimmedText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  const handleAttachment = () => {
    // Add attachment logic here
    console.log('Opening attachment options');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 4}
    >
      <View className="flex-1 bg-white">
        {/* Chat Messages Area - Scrollable */}
        <View className="flex-1 bg-white">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <View className="items-center space-y-4">
                  <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                    <Text className="text-2xl">🌿</Text>
                  </View>
                  <Text className="text-xl font-semibold text-gray-800 text-center">
                    Welcome to AyushMitra!
                  </Text>
                  <Text className="text-base text-gray-600 text-center px-8 leading-6">
                    I'm your Ayurveda health and wellness guide. Ask me about natural remedies, Yoga, daily routines, doshas, and holistic living. I'm here to support your wellness journey!
                  </Text>
                  <View className="mt-6 bg-blue-50 rounded-2xl px-6 py-4 border border-blue-200">
                    <Text className="text-sm text-blue-800 text-center">
                      💡 Try asking: "How can I improve my sleep naturally?" or "What are good foods for Pitta dosha?"
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              messages.map((message) => (
                <ChatMessageComponent key={message.id} message={message} />
              ))
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <View className="mb-4 items-start">
                <View className="bg-gray-100 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3">
                  <View className="flex-row items-center space-x-2">
                    <ActivityIndicator size="small" color="#6B7280" />
                    <Text className="text-gray-600 text-sm">AI is thinking...</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Input Area - Minimal Spacing Above Keyboard */}
        <View className="bg-white border-t border-gray-100">
          {/* Main Input Field - Perfect ChatGPT Style */}
          <View className="px-6 py-2 bg-white">
            {/* Horizontal Layout - Plus Icon and Input Field on Same Line */}
            <View className="flex-row items-center space-x-3">
              {/* Plus Icon Box - Left Side */}
              <View className="w-12 h-12 bg-gray-100 rounded-2xl items-center justify-center shadow-sm border border-gray-200 mr-2">
                <TouchableOpacity 
                  onPress={handleAttachment}
                  className="w-full h-full items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Plus size={22} color="#374151" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
              
              {/* Input Field - Center with Icons */}
              <View className="flex-1 rounded-2xl px-4 py-3 border border-gray-200 flex-row items-center space-x-3">
                <TextInput
                  ref={inputRef}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask anything"
                  placeholderTextColor="#6B7280"
                  className="text-gray-800 text-base min-h-[24px] max-h-[100px] flex-1"
                  multiline
                  textAlignVertical="center"
                  style={{ textAlignVertical: 'center' }}
                  onFocus={() => onFocusChange?.(true)}
                  onBlur={() => onFocusChange?.(false)}
                  editable={!isLoading}
                  onSubmitEditing={handleSend}
                  blurOnSubmit={false}
                  returnKeyType="send"
                  testID="ai-input-field"
                />
                
                {/* Mic and Send Icons at End of Input Field */}
                <View className="flex-row items-center space-x-3">
                  {/* Microphone Icon */}
                  <TouchableOpacity 
                    onPress={handleVoiceInput}
                    className="w-10 h-10 items-center justify-center"
                    activeOpacity={0.7}
                    disabled={isLoading}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    <Mic size={20} color={isLoading ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
                  </TouchableOpacity>

                  {/* Send Button - Fixed Touch Area */}
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('Send button pressed!');
                      handleSend();
                    }}
                    disabled={!inputText.trim() || isLoading}
                    className={`w-10 h-10 items-center justify-center rounded-full ${
                      inputText.trim() && !isLoading ? 'bg-black' : 'bg-gray-200'
                    }`}
                    activeOpacity={0.5}
                    testID="send-button"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{ zIndex: 1000 }}
                  >
                    <View className="items-center justify-center">
                      <SendHorizontal 
                        size={20} 
                        color={inputText.trim() && !isLoading ? "white" : "#6B7280"} 
                        strokeWidth={2.5} 
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Minimal Bottom Spacing - Only 4px */}
          <View className="h-1 bg-white" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
