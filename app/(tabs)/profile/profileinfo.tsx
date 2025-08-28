import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../utils/AuthContext';

export default function ProfileInfo() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{ full_name: string; email: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      console.log('User ID found:', user.id);
      fetchUserData();
      fetchProfileImage();
    } else {
      console.log('No user ID found, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (user?.id) {
        console.log('Fetching user data for ID:', user.id);
        // Fetch from users table
        const { data, error } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data from users table:', error);
          setError('Failed to load user data');
        } else {
          console.log('User data fetched successfully:', data);
          setUserData(data);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setError('Failed to load user data');
    }
  };

  const fetchProfileImage = async () => {
    try {
      if (user?.id) {
        // Fetch from user_details table using user_id (not id)
        const { data, error } = await supabase
          .from('user_details')
          .select('profile_image')
          .eq('user_id', user.id)  // Changed from 'id' to 'user_id'
          .single();

        if (error) {
          console.error('Error fetching profile image from user_details table:', error);
          // Don't set error for profile image, just log it
        } else if (data?.profile_image) {
          console.log('Profile image found:', data.profile_image);
          setProfileImage(data.profile_image);
        } else {
          console.log('No profile image found for user:', user.id);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfileImage:', error);
      // Don't set error for profile image, just log it
    } finally {
      // Set loading to false after both operations complete
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayProfileImage = () => {
    // First try to get from user_details table
    if (profileImage) {
      console.log('Using profile image from user_details:', profileImage);
      return profileImage;
    }
    // Fallback to auth metadata
    if (user?.user_metadata?.avatar_url) {
      console.log('Using avatar from auth metadata:', user.user_metadata.avatar_url);
      return user.user_metadata.avatar_url;
    }
    console.log('No profile image found, using initials');
    return null;
  };

  const updateProfileImage = async (newImageUrl: string) => {
    try {
      if (user?.id) {
        // First check if user_details record exists
        const { data: existingRecord } = await supabase
          .from('user_details')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingRecord) {
          // Update existing record
          const { error } = await supabase
            .from('user_details')
            .update({ profile_image: newImageUrl })
            .eq('user_id', user.id);

          if (error) {
            console.error('Error updating profile image:', error);
          } else {
            console.log('Profile image updated successfully');
            setProfileImage(newImageUrl);
          }
        } else {
          // Create new record
          const { error } = await supabase
            .from('user_details')
            .insert({
              user_id: user.id,
              profile_image: newImageUrl
            });

          if (error) {
            console.error('Error creating user_details record:', error);
          } else {
            console.log('User details record created with profile image');
            setProfileImage(newImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error in updateProfileImage:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <View className="px-6 py-4">
        <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
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

  // Show error state
  if (error) {
    return (
      <View className="px-6 py-4">
        <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center">
              <Text className="text-2xl font-bold text-red-500">!</Text>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-medium text-gray-900 mb-1">
                Error Loading Profile
              </Text>
              <Text className="text-sm text-gray-500">
                {error}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Show profile data
  const displayName = userData?.full_name || user?.user_metadata?.full_name || 'User';
  const displayEmail = userData?.email || user?.email || 'user@example.com';
  const finalProfileImage = getDisplayProfileImage();

  return (
    <View className="px-6 py-4">
      <View className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <View className="flex-row items-center">
          {/* Profile Picture/Initial */}
          <TouchableOpacity 
            className="w-20 h-20 rounded-full items-center justify-center overflow-hidden relative"
            activeOpacity={0.8}
            onPress={() => {
              console.log('Profile image tapped - update functionality coming soon');
              // TODO: Implement image picker and updateProfileImage function
            }}
          >
            {finalProfileImage ? (
              <>
                <Image
                  source={{ uri: finalProfileImage }}
                  className="w-20 h-20 rounded-full"
                  style={{ width: 80, height: 80 }}
                />
                {/* Edit indicator overlay */}
                <View className="absolute inset-0 bg-black/20 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-medium">Edit</Text>
                </View>
              </>
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
