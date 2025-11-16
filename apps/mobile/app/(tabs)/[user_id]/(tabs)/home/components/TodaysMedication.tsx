import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native'
import { Image } from 'expo-image'
import { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { VideoView, useVideoPlayer } from 'expo-video'
// @ts-ignore - expo-screen-orientation types
import * as ScreenOrientation from 'expo-screen-orientation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.75
const CARD_HEIGHT = 160

// Local video file
const localVideoSource = require('@/assets/video1.mp4')

// Video data - all using the same local video
const videoData = [
  {
    id: '1',
    title: 'Medication Guide',
  },
  {
    id: '2',
    title: 'Health Tips',
  },
  {
    id: '3',
    title: 'Wellness Journey',
  },
  {
    id: '4',
    title: 'Daily Routine',
  },
  {
    id: '5',
    title: 'Mindfulness',
  },
]

// Video Thumbnail Component - Optimized to prevent multiple player instances
function VideoThumbnail({ isVisible }: { isVisible?: boolean }) {
  const player = useVideoPlayer(localVideoSource, (player) => {
    player.loop = true
    player.muted = true
    player.play()
  })

  useEffect(() => {
    if (!player) return

    try {
      if (isVisible !== false) {
        player.play()
      } else {
        player.pause()
      }
    } catch (error) {
      // Player may be destroyed, ignore error
    }
  }, [isVisible, player])

  useEffect(() => {
    return () => {
      if (!player) return
      try {
        player.pause()
      } catch (error) {
        // Player may already be destroyed, ignore error silently
      }
    }
  }, [player])

  if (!player) {
    return null
  }

  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      nativeControls={false}
    />
  )
}

// Video Player Component
function VideoPlayer({ isPlaying, videoId }: { isPlaying: boolean; videoId: string }) {
  const player = useVideoPlayer(localVideoSource, (player) => {
    player.loop = false
    player.muted = false
  })

  useEffect(() => {
    if (!player) return

    try {
      if (isPlaying) {
        player.play()
      } else {
        player.pause()
      }
    } catch (error) {
      // Player may be destroyed, ignore error silently
    }
  }, [isPlaying, player])

  // Reset video when switching
  useEffect(() => {
    return () => {
      if (!player) return
      try {
        player.pause()
        player.currentTime = 0
      } catch (error) {
        // Player may already be destroyed, ignore error silently
      }
    }
  }, [videoId, player])

  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="contain"
      nativeControls
    />
  )
}

export default function TodaysMedication() {
  const textColor = '#111827'
  const secondaryTextColor = '#6B7280'
  const insets = useSafeAreaInsets()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  const [fontsLoaded] = useFonts({
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium copy.otf'),
  })

  const handleCardPress = (index: number) => {
    setSelectedVideoIndex(index)
    setCurrentIndex(index)
    setIsExpanded(true)
  }

  useEffect(() => {
    if (isExpanded && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: selectedVideoIndex * SCREEN_WIDTH,
          animated: false,
        })
      }, 100)
    }
  }, [isExpanded, selectedVideoIndex])

  const handleClose = async () => {
    setIsPlaying(false)
    setPlayingVideoId(null)
    setIsExpanded(false)
    // Reset to portrait orientation
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    } catch (error) {
      console.log('Error resetting orientation:', error)
    }
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / SCREEN_WIDTH)
    setCurrentIndex(index)
    // Pause video when scrolling
    setIsPlaying(false)
    setPlayingVideoId(null)
  }

  const handleVideoPress = async (video: (typeof videoData)[0], index: number) => {
    try {
      // Switch to landscape orientation first
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      // Play the video
      setPlayingVideoId(video.id)
      setIsPlaying(true)
    } catch (error) {
      console.error('Error handling video press:', error)
      // Reset orientation on error
      try {
        await ScreenOrientation.unlockAsync()
      } catch (e) {
        console.error('Error resetting orientation:', e)
      }
    }
  }

  useEffect(() => {
    // Reset to portrait when modal closes
    if (!isExpanded) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }

    return () => {
      // Cleanup: reset orientation on unmount
      ScreenOrientation.unlockAsync()
    }
  }, [isExpanded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View className="mb-6 mt-0">
      {/* Section Title */}
      <Text
        className="mb-4 text-[24px]"
        style={{
          fontFamily: 'Satoshi-Medium',
          fontWeight: '500',
          color: textColor,
          letterSpacing: -0.4,
        }}
      >
        Today's Medication
      </Text>

      {/* Horizontal Scrollable Video Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
        className="flex-row"
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="start"
      >
        {videoData.map((video, index) => (
          <TouchableOpacity
            key={video.id}
            activeOpacity={0.9}
            onPress={() => handleCardPress(index)}
            className="mr-4 overflow-hidden rounded-2xl"
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <VideoThumbnail isVisible={true} />
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
              locations={[0.5, 1]}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            {/* Play Button */}
            <View className="absolute inset-0 items-center justify-center">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-white/90">
                <Ionicons
                  name="play"
                  size={28}
                  color="#111827"
                  style={{ marginLeft: 2 }}
                />
              </View>
            </View>
            {/* Video Title */}
            <View className="absolute bottom-0 left-0 right-0 px-3 pb-3">
              <Text
                className="text-sm font-medium text-white"
                style={{
                  fontFamily: fontsLoaded ? 'Satoshi-Medium' : undefined,
                  textShadowColor: 'rgba(0, 0, 0, 0.5)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                }}
              >
                {video.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expanded Modal with Slider */}
      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="absolute right-6 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            style={{
              top: Platform.OS === 'ios' ? insets.top + 12 : 40,
            }}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Horizontal ScrollView for Videos */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="flex-1"
          >
            {videoData.map((video, index) => (
              <View
                key={video.id}
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: SCREEN_WIDTH * 0.9,
                    height: SCREEN_HEIGHT * 0.7,
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: '#000',
                  }}
                >
                  {playingVideoId === video.id ? (
                    <VideoPlayer isPlaying={isPlaying} videoId={video.id} />
                  ) : (
                    <>
                      <VideoThumbnail isVisible={currentIndex === index} />
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => handleVideoPress(video, index)}
                        className="absolute inset-0 items-center justify-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                      >
                        <View className="h-20 w-20 items-center justify-center rounded-full bg-white/90">
                          <Ionicons
                            name="play"
                            size={40}
                            color="#111827"
                            style={{ marginLeft: 4 }}
                          />
                        </View>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Page Indicators */}
          <View
            className="absolute bottom-8 flex-row items-center justify-center"
            style={{ width: SCREEN_WIDTH }}
          >
            {videoData.map((_, index) => (
              <View
                key={index}
                className="mx-1 rounded-full"
                style={{
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  backgroundColor:
                    index === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                }}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
}
