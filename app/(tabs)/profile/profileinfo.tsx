import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../utils/AuthContext';

export default function ProfileInfo() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileImage = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  if (loading) {
    return (
      <View className="px-6 py-4">
        <View className="bg-white  p-6 border border-gray-200 ">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center">
              <Text className="text-2xl font-bold text-gray-400">...</Text>
            </View>
            <View className="ml-4 flex-1">
              <View className="h-6 bg-gray-200 rounded mb-2" />
              <View className="h-4 bg-gray-200 rounded" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  const displayName = userData?.full_name || user?.user_metadata?.full_name || 'User';
  const displayEmail = userData?.email || user?.email || 'user@example.com';
  const profileImage = getProfileImage();

  return (
    <View className="px-6 py-4">
      <View className="bg-white rounded-2xl p-6  ">
        <View className="flex-row items-center">
          {/* Profile Picture/Initial */}
          <TouchableOpacity 
            className="w-20 h-20 rounded-full items-center justify-center overflow-hidden"
            activeOpacity={0.8}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-20 h-20 rounded-full"
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-2xl font-bold text-white">
                  {getInitials(displayName)}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User Information */}
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {displayName}
            </Text>
            <Text className="text-base text-gray-600">
              {displayEmail}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
