import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, Mic, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../utils/AuthContext';
import { supabase } from '../../../utils/supabase';

export default function Hero() {
  const { user } = useAuth();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Default image from Supabase storage
  const defaultImageUrl = 'https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/ayverdha.jpeg';

  useEffect(() => {
    if (user?.id) {
      fetchProfileImage();
    }
  }, [user]);

  const fetchProfileImage = async () => {
    try {
      if (user?.id) {
        // Fetch from user_details table using user_id
        const { data, error } = await supabase
          .from('user_details')
          .select('profile_image')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile image from user_details table:', error);
        } else if (data?.profile_image) {
          console.log('Profile image found in hero:', data.profile_image);
          setProfileImage(data.profile_image);
        } else {
          console.log('No profile image found in user_details, using default');
        }
      }
    } catch (error) {
      console.error('Error in fetchProfileImage:', error);
    }
  };

  const getDisplayProfileImage = () => {
    // First try to get from user_details table
    if (profileImage) {
      return profileImage;
    }
    // Fallback to auth metadata
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    // Final fallback to default image
    return defaultImageUrl;
  };

  const handleAISearchPress = () => {
    router.push('/(tabs)/ai');
  };

  return (
    <View className="px-6 pt-8 pb-6 bg-white">
      {/* Profile and Greeting Section */}
      <View className="flex-row items-center justify-between mb-6">
        {/* Left Side - Profile and Greeting */}
        <View className="flex-row items-center flex-1">
          {/* Profile Picture */}
          <View className="w-12 h-12 rounded-full mr-4 overflow-hidden bg-white/60">
            <Image 
              source={{ 
                uri: getDisplayProfileImage()
              }}
              className="w-12 h-12 rounded-full"
              defaultSource={{ uri: defaultImageUrl }}
              resizeMode="cover"
            />
          </View>
          
          {/* Greeting Text */}
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-0">
              Hi, {user?.user_metadata?.full_name || 'User'}!
            </Text>
            <Text className="text-base text-gray-600">
              How are you today?
            </Text>
          </View>
        </View>

        {/* Right Side - Bell Icon */}
        <TouchableOpacity className="bg-white/60 rounded-xl p-3 ml-4">
          <Bell size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* AI Search Input - Clickable */}
      <TouchableOpacity 
        onPress={handleAISearchPress}
        activeOpacity={0.7}
        className="bg-white/60 rounded-2xl p-4 flex-row items-center border border-gray-200"
      >
        <Search size={20} color="#6B7280" className="mr-3" />
        <Text className="flex-1 text-gray-400 text-base ml-2">
          Ask AI about your wellness...
        </Text>
        <Mic size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}
