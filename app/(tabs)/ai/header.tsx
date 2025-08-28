import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  onClearConversation?: () => void;
}

export default function Header({ onClearConversation }: HeaderProps) {
  const router = useRouter();
  const profileImageUrl = 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/_%20(9).jpeg';

  const handleBack = () => {
    // Clear conversation before navigating back
    if (onClearConversation) {
      onClearConversation();
      console.log('Conversation cleared before navigation');
    }
    
    // Navigate back to home
    router.push('/(tabs)/home');
  };

  return (
    <View className="w-full flex-row items-center justify-between px-6 py-4 bg-white">
      {/* Left Side - Back Button */}
      <TouchableOpacity
        testID="back-button"
        onPress={handleBack}
        className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center"
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

      {/* Right Side - Profile Only */}
      <View className="flex-row items-center">
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
