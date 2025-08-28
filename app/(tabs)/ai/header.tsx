import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

interface HeaderProps {
  onClearConversation?: () => void;
}

export default function Header({ onClearConversation }: HeaderProps) {
  const router = useRouter();
  const profileImageUrl = 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/ayverdha.jpeg';

  const handleBack = () => {
    router.push('/(tabs)/home');
  };

  const handleClearConversation = () => {
    onClearConversation?.();
  };

  return (
    <View className="w-full flex-row items-center justify-between px-6 py-4 bg-white">
      {/* Left Side - Back Button */}
      <TouchableOpacity 
        testID="back-button"
        onPress={handleBack}
        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center shadow-sm"
        activeOpacity={0.7}
      >
        <ArrowLeft size={24} color="black" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Center - Title */}
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold text-gray-900">
          AyushMitra
        </Text>
      </View>

      {/* Right Side - Clear Button and Profile */}
      <View className="flex-row items-center space-x-3">
        {/* Clear Conversation Button */}
        <TouchableOpacity 
          onPress={handleClearConversation}
          className="w-10 h-10 bg-red-50 rounded-full items-center justify-center border border-red-200"
          activeOpacity={0.7}
        >
          <Trash2 size={18} color="#DC2626" strokeWidth={2} />
        </TouchableOpacity>

        {/* Profile Image */}
        <View 
          testID="profile-container"
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200"
        >
          <Image
            testID="profile-image"
            source={{ 
              uri: profileImageUrl,
              cache: 'reload'
            }}
            style={{ width: 48, height: 48 }}
            onError={(error) => console.log('Image load error:', error)}
            onLoad={() => console.log('Profile image loaded successfully')}
          />
        </View>
      </View>
    </View>
  );
}
