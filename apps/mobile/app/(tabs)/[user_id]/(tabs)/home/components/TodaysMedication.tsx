import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native'
import { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { VideoView, useVideoPlayer } from 'expo-video'
// @ts-ignore
import * as ScreenOrientation from 'expo-screen-orientation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.75
const CARD_HEIGHT = 160
const localVideoSource = require('@/assets/video1.mp4')

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

function VideoThumbnail({ isVisible }: { isVisible?: boolean }) {
  const player = useVideoPlayer(localVideoSource, (player) => {
    player.loop = true
    player.muted = true
    player.play()
  })

  useEffect(() => {
    if (!player) return
    try {
      isVisible !== false ? player.play() : player.pause()
    } catch {
      // Player may be destroyed
    }
  }, [isVisible, player])

  useEffect(() => {
    return () => {
      try {
        player?.pause()
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [player])

  if (!player) return null

  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      nativeControls={false}
    />
  )
}

function VideoPlayer({ isPlaying, videoId }: { isPlaying: boolean; videoId: string }) {
  const player = useVideoPlayer(localVideoSource, (player) => {
    player.loop = false
    player.muted = false
  })

  useEffect(() => {
    if (!player) return
    try {
      isPlaying ? player.play() : player.pause()
    } catch {
      // Player may be destroyed
    }
  }, [isPlaying, player])

  useEffect(() => {
    return () => {
      try {
        player?.pause()
        player && (player.currentTime = 0)
      } catch {
        // Ignore cleanup errors
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
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    } catch {
      // Ignore orientation errors
    }
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / SCREEN_WIDTH)
    setCurrentIndex(index)
    setIsPlaying(false)
    setPlayingVideoId(null)
  }

  const handleVideoPress = async (video: (typeof videoData)[0]) => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      setPlayingVideoId(video.id)
      setIsPlaying(true)
    } catch {
      try {
        await ScreenOrientation.unlockAsync()
      } catch {
        // Ignore orientation errors
      }
    }
  }

  useEffect(() => {
    if (!isExpanded) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {})
    }
    return () => {
      ScreenOrientation.unlockAsync().catch(() => {})
    }
  }, [isExpanded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View className="mb-6 mt-6">
      {/* Section Header */}
      <View className="mb-4">
        <Text
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '500',
            color: textColor,
            letterSpacing: -0.4,
            fontSize: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)),
            marginBottom: 4,
            lineHeight: Math.max(20, Math.min(24, SCREEN_WIDTH * 0.064)) * 1.2,
          }}
        >
          Personal Wellness Tools
        </Text>
        <Text
          style={{
            fontFamily: 'Satoshi-Medium',
            fontWeight: '400',
            color: secondaryTextColor,
            fontSize: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.043)),
            lineHeight: Math.max(14, Math.min(16, SCREEN_WIDTH * 0.043)) * 1.4,
            letterSpacing: 0.1,
          }}
        >
          Short routines chosen for your wellbeing.
        </Text>
      </View>

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
              borderWidth: 0.5,
              borderColor: 'rgba(0, 0, 0, 0.08)', // Light visible border
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.12,
              shadowRadius: 14,
              elevation: 5,
            }}
          >
            <VideoThumbnail isVisible={true} />
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
            <View className="absolute inset-0 items-center justify-center">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-white/90">
                <Ionicons name="play" size={28} color="#111827" style={{ marginLeft: 2 }} />
              </View>
            </View>
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

      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
          <TouchableOpacity
            onPress={handleClose}
            className="absolute right-6 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/20"
            style={{
              top: Platform.OS === 'ios' ? insets.top + 12 : 40,
            }}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

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
                        onPress={() => handleVideoPress(video)}
                        className="absolute inset-0 items-center justify-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                      >
                        <View className="h-20 w-20 items-center justify-center rounded-full bg-white/90">
                          <Ionicons name="play" size={40} color="#111827" style={{ marginLeft: 4 }} />
                        </View>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

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
