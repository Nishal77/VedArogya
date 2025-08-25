import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);

  const handleNavigate = () => {
    router.push('/about');
  };

  return (
    <View className="flex-1">
      <Video
        ref={videoRef}
        source={require('../assets/videos/videomain.mp4')}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        onError={(error) => console.log('Video error:', error)}
      />
      
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-black/20 backdrop-blur-sm">
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-7xl font-bold text-white text-center drop-shadow-2xl mb-2 tracking-wide">
              VedArogya
            </Text>
            {/* <Text className="text-2xl text-white/95 text-center drop-shadow-lg px-8 leading-relaxed font-medium">
              Ancient Wisdom • Modern Healing
            </Text> */}
          </View>
          
          <View className="pb-20 px-6 items-center">
            <TouchableOpacity 
              className="bg-[#F4B400] px-20 py-6 rounded-3xl shadow-2xl w-96 max-w-md active:bg-[#7A9F00] active:scale-95 transition-all duration-300"
              activeOpacity={0.9}
              onPress={handleNavigate}
            >
              <Text className="text-black text-2xl font-bold text-center tracking-wide">
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
