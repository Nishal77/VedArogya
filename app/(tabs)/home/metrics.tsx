import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Footprints, Droplets, Flame, Bed, Zap, GlassWater, Toilet, Brain, MapPin, ThermometerSun } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import * as Location from 'expo-location';

interface DayItem {
  day: string;
  date: string;
  isActive: boolean;
}

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  airQuality?: number;
  uvIndex?: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  placeName?: string;
}

export default function Metrics() {
  // Get today's date and calculate the week
  const today = new Date();
  const todayDate = today.getDate();
  const todayDay = today.getDay();

  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Reverse geocoding to get place name from coordinates
  const getPlaceName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY || '689bac2db9e125b34458ff835e148b5a'}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        const city = location.name || '';
        const state = location.state || '';
        const country = location.country || '';
        
        if (city && state && country) {
          return `${city}, ${state}, ${country}`;
        } else if (city && country) {
          return `${city}, ${country}`;
        } else if (city) {
          return city;
        }
      }
      return 'Unknown Location';
    } catch (error) {
      return 'Unknown Location';
    }
  };

  // Calculate dates for the week (3 days before, today, 3 days after)
  const getDateForDay = (offset: number) => {
    const date = new Date(today);
    date.setDate(todayDate + offset);
    return date;
  };

  const days: DayItem[] = [
    {
      day: getDateForDay(-3).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(-3).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(-2).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(-2).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(-1).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(-1).getDate().toString(),
      isActive: false
    },
    {
      day: today.toLocaleDateString('en-US', { weekday: 'short' }),
      date: todayDate.toString(),
      isActive: true
    },
    {
      day: getDateForDay(1).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(1).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(2).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(2).getDate().toString(),
      isActive: false
    },
    {
      day: getDateForDay(3).toLocaleDateString('en-US', { weekday: 'short' }),
      date: getDateForDay(3).getDate().toString(),
      isActive: false
    }
  ];

  const [selectedDay, setSelectedDay] = useState(3); // Today is at index 3

  // Get wind direction from degrees
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Get weather emoji based on condition
  const getWeatherEmoji = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'drizzle': return '🌦️';
      case 'thunderstorm': return '⛈️';
      case 'snow': return '❄️';
      case 'mist': return '🌫️';
      case 'fog': return '🌫️';
      default: return '🌤️';
    }
  };

  // Fetch weather data using coordinates
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      
      const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHERMAP_API_KEY || '689bac2db9e125b34458ff835e148b5a';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.main) {
        const weather: WeatherData = {
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6),
          windDirection: getWindDirection(data.wind.deg),
          feelsLike: Math.round(data.main.feels_like),
          pressure: data.main.pressure,
          visibility: Math.round(data.visibility / 1000),
          airQuality: Math.floor(Math.random() * 50) + 25, // Mock AQI for now
          uvIndex: Math.floor(Math.random() * 5) + 3 // Mock UV index for now
        };
        setWeatherData(weather);
      } else {
        if (data.cod === 401) {
          setWeatherError('Invalid API key');
        } else if (data.cod === 429) {
          setWeatherError('Rate limit exceeded');
        } else {
          setWeatherError('Failed to fetch weather');
        }
      }
    } catch (error) {
      setWeatherError('Network error');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Get location and fetch weather
  const getLocationAndFetchWeather = async () => {
    try {
      setLocationLoading(true);
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get weather data');
        setWeatherError('Location permission denied');
        setLocationLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      const { latitude, longitude } = location.coords;
      
      // Get place name from coordinates
      const placeName = await getPlaceName(latitude, longitude);
      
      // Set complete location data
      setCurrentLocation({
        latitude,
        longitude,
        placeName
      });
      
      // Fetch weather for this location
      await fetchWeatherData(latitude, longitude);
      
    } catch (error) {
      setWeatherError('Failed to get location');
    } finally {
      setLocationLoading(false);
    }
  };

  // Initialize weather on component mount
  useEffect(() => {
    getLocationAndFetchWeather();
    
    // Refresh weather every 15 seconds
    const interval = setInterval(() => {
      getLocationAndFetchWeather();
    }, 15 * 1000); // Changed from 8 * 1000 to 15 * 1000
    
    return () => clearInterval(interval);
  }, []);

  const handleDayPress = (index: number) => {
    setSelectedDay(index);
  };

  return (
    <View className="px-6 pb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-gray-900">
          Daily Metrics
        </Text>
        <Text className="text-blue-600 text-base font-medium">
          View All
        </Text>
      </View>

      {/* Date Selector and Calorie Tracker Card */}
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        {/* Date Selector */}
        <View className="flex-row justify-between mb-6">
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDayPress(index)}
              className={`items-center justify-center ${day.isActive
                  ? 'bg-lime-400 px-3 py-2 rounded-full'
                  : 'bg-gray-200 px-3 py-2 rounded-full'
                }`}
              activeOpacity={0.8}
            >
              <Text className={`text-xs font-medium ${day.isActive ? 'text-white' : 'text-gray-700'
                }`}>
                {day.day}
              </Text>
              <View className={`w-6 h-6 rounded-full items-center justify-center mt-1 ${day.isActive ? 'bg-white' : 'bg-white'
                }`}>
                {day.isActive ? (
                  <View className="w-2 h-2 bg-lime-400 rounded-full" />
                ) : (
                  <Text className="text-xs font-medium text-gray-700">
                    {day.date}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calorie Tracker */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Flame size={20} color="#374151" />
            <Text className="text-gray-700 text-base ml-2 font-medium">
              Calories left
            </Text>
          </View>
          <Text className="text-3xl font-bold text-gray-900">
            1,250
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="mt-3">
          <View className="h-2 bg-gray-200 rounded-full">
            <View className="h-2 bg-lime-400 rounded-full w-[65%]" />
          </View>
        </View>
      </View>

      {/* Original Metrics Cards */}
      <View className="flex-row justify-between">
        {/* Sleep Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Bed size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
                Sleep               </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                7hr 20min
              </Text>
              <View className="flex-row items-center mt-1">
                {/* <View className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" /> */}
                <Text className="text-green-700 text-sm font-semibold">
                  Deep – Kapha
                </Text>
                <Text className="bg-white">🔻</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Water Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <GlassWater size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
              Water Intake    </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
               12 glasses
              </Text>
              <View className="flex-row items-center mt-1">
                {/* <View className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" /> */}
                <Text className="text-green-700 text-sm font-semibold">
                  Hydrated – Kapha
                </Text>
                <Text className="text-green-500">🔻</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/*  Tracking Cards */}
      <View className="flex-row justify-between mt-4">
        {/* Energy Level Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Zap size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
                Energy Level
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col">
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl font-bold text-gray-900">
                78%
              </Text>
              <View className="ml-2">
                <Svg width="20" height="20" viewBox="0 0 14 14">
                  <Path stroke="#22C55E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" d="M4.06571 0.624023 1.64533 5.83272c-0.03348 0.07431 -0.04643 0.15497 -0.03771 0.23491 0.00871 0.07993 0.03883 0.15669 0.08769 0.22353 0.04887 0.06684 0.11499 0.12171 0.19256 0.15979 0.07756 0.03808 0.1642 0.05821 0.25229 0.05861h2.75605L2.74476 13.376l9.48574 -7.98469c0.0767 -0.06745 0.1298 -0.15417 0.1524 -0.24916 0.0226 -0.09498 0.0137 -0.19395 -0.0254 -0.28435 -0.0392 -0.09039 -0.107 -0.16812 -0.1947 -0.22333 -0.0878 -0.05521 -0.1915 -0.08541 -0.2981 -0.08676H9.05691L11.2084 0.624023H4.06571Z" />
                </Svg>
              </View>
            </View>
            <Text className="text-green-700 text-sm font-semibold">
              High – Pitta
            </Text>
          </View>
        </View>

        {/* Digestion Card */}
        <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Toilet size={20} color="#374151" />
              </View>
              <Text className="text-gray-600 text-sm font-medium">
              Bowel (Mala)
              </Text>
              </View>
            
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col">
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl font-bold text-gray-900">
              8:15 AM
              </Text>
              <View className="ml-2">
                <Svg width="20" height="20" viewBox="0 0 14 14">
                  <Path fill="#EF4444" fillRule="evenodd" d="M1.13701 1.31998C0.939008 1.03724 0.549288 0.968537 0.266544 1.16654c-0.2827435 0.198 -0.3514429 0.58771 -0.153444 0.87046l4.0281 5.75216c0.09512 0.13582 0.24031 0.22828 0.40361 0.25703 0.16331 0.02874 0.33134 -0.00859 0.46712 -0.10378l2.59854 -1.82169 2.84583 4.06388 -1.65185 1.2184c-0.16028 0.1182 -0.23511 0.3203 -0.19049 0.5144 0.04461 0.1941 0.20017 0.3432 0.39598 0.3796l3.73946 0.6946c0.1319 0.0245 0.2681 -0.005 0.378 -0.082 0.1099 -0.0769 0.1843 -0.1948 0.2064 -0.3271l0.6594 -3.93917c0.0336 -0.20089 -0.058 -0.4021 -0.2316 -0.50866 -0.1736 -0.10656 -0.3944 -0.09717 -0.5584 0.02373l-1.7406 1.28396 -3.18692 -4.55088c-0.09512 -0.13582 -0.24031 -0.22829 -0.40361 -0.25703 -0.16331 -0.02874 -0.33134 0.00859 -0.46712 0.10377l-2.59853 1.8217 -3.66941 -5.23994Z" clipRule="evenodd" strokeWidth="1" />
                </Svg>
              </View>
            </View>
            <Text className="text-red-600 font-semibold text-sm">
            Insight: Vata Balanced
            </Text>
          </View>
        </View>
      </View>

      {/* Food Overview */}
      <View className="mt-4">
        <View className="bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Svg width="20" height="20" viewBox="0 0 14 14">
                  <Path fill="#F6AD55" fillRule="evenodd" d="M1.625 1c0 -0.345178 -0.27982 -0.625 -0.625 -0.625C0.654822 0.375 0.375 0.654822 0.375 1v2.5c0 1.42215 0.94999 2.62243 2.25 3.00085V13c0 0.4832 0.39175 0.875 0.875 0.875s0.875 -0.3918 0.875 -0.875V6.50085c1.30001 -0.37842 2.25 -1.5787 2.25 -3.00085V1c0 -0.345178 -0.27982 -0.625 -0.625 -0.625S5.375 0.654822 5.375 1v2.5c0 0.81639 -0.52175 1.51091 -1.25 1.76831V1c0 -0.345178 -0.27982 -0.625 -0.625 -0.625S2.875 0.654822 2.875 1v4.26831c-0.72825 -0.2574 -1.25 -0.95192 -1.25 -1.76831V1Zm8.875 0.625c-0.93368 0 -1.875 0.95179 -1.875 2.375s0.94132 2.375 1.875 2.375c0.9337 0 1.875 -0.95179 1.875 -2.375s-0.9413 -2.375 -1.875 -2.375ZM7.375 4C7.375 2.1095 8.67225 0.375 10.5 0.375c1.8277 0 3.125 1.73451 3.125 3.625 0 1.57197 -0.8969 3.03609 -2.25 3.48484V13c0 0.4832 -0.3918 0.875 -0.875 0.875s-0.875 -0.3918 -0.875 -0.875V7.48484C8.27194 7.03609 7.375 5.57197 7.375 4Z" clipRule="evenodd" />
                </Svg>
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {/* Food & Digestion */}
                Ahara (Food & Digestion)
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Text className="text-gray-600 text-sm font-medium">
              Midday Meal — 1:15 PM
            </Text>
          </View>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <Text className="text-gray-700 text-sm font-medium w-24">
                Food:
              </Text>
              <Text className="text-gray-900 text-sm">
                Rice + Dal
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Text className="text-gray-700 text-sm font-medium w-24">
                How much:
              </Text>
              <Text className="text-gray-900 text-sm">
                Normal
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Text className="text-gray-700 text-sm font-medium w-24">
                Feeling:
              </Text>
              <Text className="text-gray-900 text-sm">
                Light ✨
              </Text>
            </View>
          </View>
          
          <View className="mt-4 pt-3 border-t border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-gray-700 text-sm font-medium mr-2">
                  Digestion:
                </Text>
                <Text className="text-2xl font-bold text-gray-900">
                  82%
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-green-700 text-sm font-semibold mr-2">
                  High — Strong Agni (Pitta)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Mind & Mood (Manas) */}
      <View className="mt-4">
        <View className="bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <Brain size={20} color="#9F7AEA" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                Mind & Mood (Manas)
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-red-500 rounded-2xl border-2 border-red-600 items-center justify-center mr-4">
                <Image
                  source={{ uri: "https://gdlpmqlqtfpcycqbmbmp.supabase.co/storage/v1/object/public/icons/angry.png" }}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text className="text-gray-600 text-sm font-medium">
                  Current State
                </Text>
                <Text className="text-gray-900 text-lg font-semibold">
                  Frustrated
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-xs">
                Last Updated
              </Text>
              <Text className="text-gray-700 text-sm font-medium">
                2:30 PM
              </Text>
              </View>
          </View>
        </View>
      </View>

      {/* Climate (Kala) */}
      <View className="mt-4">
        <View className="bg-white rounded-2xl p-4 border border-gray-300">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <ThermometerSun size={20} color="#2C7A7B" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                Climate (Kala)
              </Text>
            </View>
            <TouchableOpacity>
              <Text className="text-gray-400 text-lg">→</Text>
            </TouchableOpacity>
          </View>
          
          {/* Weather Section */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Text className="text-4xl mr-4">
                {weatherData ? getWeatherEmoji(weatherData.condition) : '🌤️'}
              </Text>
              <View>
                <Text className="text-gray-600 text-sm font-medium">
                  Temperature
                </Text>
                {weatherLoading ? (
                  <Text className="text-gray-900 text-2xl font-bold">Loading...</Text>
                ) : weatherError ? (
                  <Text className="text-red-600 text-lg font-bold">--</Text>
                ) : (
                  <Text className="text-gray-900 text-2xl font-bold">
                    {weatherData?.temperature}°C
                  </Text>
                )}
                {/* Weather Description */}
                {weatherData && !weatherLoading && !weatherError && (
                  <Text className="text-gray-500 text-xs capitalize mt-1">
                    {weatherData.description}
                  </Text>
                )}
              </View>
            </View>
            <View className="items-end">
              <View className="flex-row items-center mb-1">
                <Text className="text-2xl mr-2">💨</Text>
                <View>
                  {weatherLoading ? (
                    <Text className="text-gray-700 text-sm font-medium">Loading...</Text>
                  ) : weatherError ? (
                    <Text className="text-gray-700 text-sm font-medium">--</Text>
                  ) : (
                    <>
                      <Text className="text-gray-700 text-sm font-medium">
                        {weatherData?.windSpeed} km/h {weatherData?.windDirection}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        Humidity: {weatherData?.humidity}%
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Location Name Display */}
          {locationLoading ? (
            <View className="bg-blue-50 rounded-xl p-3 mb-4">
              <View className="flex-row items-center justify-center">
                <MapPin size={16} color="#3B82F6" />
                <Text className="text-blue-700 text-sm font-medium ml-2">
                  Getting your location...
                </Text>
              </View>
            </View>
          ) : currentLocation ? (
            <View className="bg-blue-50 rounded-xl p-3 mb-4">
              <View className="flex-row items-center justify-center">
                <MapPin size={16} color="#3B82F6" />
                <Text className="text-blue-700 text-sm font-medium ml-2">
                  {currentLocation.placeName || `Location: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Additional Weather Details */}
          {weatherData && !weatherLoading && !weatherError && (
            <View className="bg-gray-50 rounded-xl p-3 mb-4">
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-gray-500 text-xs">Feels Like</Text>
                  <Text className="text-gray-800 text-sm font-semibold">
                    {weatherData.feelsLike}°C
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-xs">Pressure</Text>
                  <Text className="text-gray-800 text-sm font-semibold">
                    {weatherData.pressure} hPa
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-xs">Visibility</Text>
                  <Text className="text-gray-800 text-sm font-semibold">
                    {weatherData.visibility} km
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-gray-500 text-xs">AQI</Text>
                  <Text className="text-gray-800 text-sm font-semibold">
                    {weatherData.airQuality}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Recent Travel Section */}
          <View className="pt-3 border-t border-gray-200">
            <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                <MapPin size={20} color="#374151" />
              </View>
              <Text className="text-gray-700 text-base font-medium">
                Recent Travel
              </Text>
            </View>
            <View className="bg-blue-50 rounded-xl p-3 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-800 text-sm font-semibold">
                  Mangalore Kadri Temple
                </Text>
                <Text className="text-gray-500 text-xs">
                  Today, 2:30 PM
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-xs">
                  Climate: Coastal, Humid & Warm
                </Text>
                <Text className="text-gray-500 text-xs">
                  27th August 2025
                </Text>
              </View>
            </View>
          </View>

          {/* Environmental Context */}
          <View className="pt-3 border-t border-gray-200">
            <View className="flex-row items-center mb-3">
              <Svg
                width={20}
                height={20}
                viewBox="0 0 14 14"
                fill="none"
                style={{ marginRight: 10 }}
              >
                <Path
                  fill="#000"
                  fillRule="evenodd"
                  d="M8.5 1.44761v1.30246c0 0.59674 -0.23705 1.16903 -0.65901 1.59099 -0.42196 0.42196 -0.99425 0.65901 -1.59099 0.65901 -0.33152 0 -0.64946 0.13169 -0.88388 0.36611C5.1317 5.60061 5 5.91855 5 6.25007v1.5c0 0.59674 -0.23705 1.16903 -0.65901 1.59099 -0.42196 0.42196 -0.99425 0.65904 -1.59099 0.65904h-0.65627C3.10449 11.6495 4.92373 12.75 7 12.75c1.31699 0 2.53057 -0.4428 3.5 -1.1876V11.25c0 -0.1989 -0.079 -0.3897 -0.2197 -0.5303 -0.1406 -0.1407 -0.33139 -0.2197 -0.5303 -0.2197 -0.59674 0 -1.16903 -0.2371 -1.59099 -0.65901C7.73705 9.41903 7.5 8.84674 7.5 8.25c0 -0.59674 0.23705 -1.16903 0.65901 -1.59099C8.58097 6.23705 9.15326 6 9.75 6h2.1328v0.00001c0.2678 0.00147 0.5339 0.02944 0.7945 0.08297C12.3177 3.8397 10.6606 2.02989 8.5 1.44761Zm5.4996 5.4755c0.0009 -0.02018 0.0006 -0.04034 -0.0009 -0.06034 -0.0656 -3.41043 -2.5702 -6.2236 -5.84197 -6.7676448C8.10743 0.0788662 8.05474 0.0700684 8 0.0700684c-0.00185 0 -0.0037 0.00001 -0.00554 0.00003C7.66962 0.0238993 7.3376 0 7 0 3.13401 0 0 3.13401 0 7c0 3.866 3.13401 7 7 7 3.866 0 7 -3.134 7 -7 0 -0.02566 -0.0001 -0.05129 -0.0004 -0.07689Z"
                  clipRule="evenodd"
                  strokeWidth={1}
                />
              </Svg>
              <Text className="text-gray-700 text-base font-medium">
                Environmental Context
              </Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-xs font-medium w-20">
                  Season:
                </Text>
                <Text className="text-gray-800 text-xs">
                  Monsoon (Varsha Ritu)
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-xs font-medium w-20">
                  Air Quality:
                </Text>
                <Text className="text-gray-800 text-xs">
                  {weatherData && weatherData.airQuality ? 
                    `${weatherData.airQuality <= 50 ? 'Good' : weatherData.airQuality <= 100 ? 'Moderate' : 'Unhealthy'} (AQI: ${weatherData.airQuality})` : 
                    'Moderate (AQI: 65)'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-xs font-medium w-20">
                  UV Index:
                </Text>
                <Text className="text-gray-800 text-xs">
                  {weatherData && weatherData.uvIndex ? 
                    `${weatherData.uvIndex <= 2 ? 'Low' : weatherData.uvIndex <= 5 ? 'Moderate' : 'High'} (${weatherData.uvIndex}/10)` : 
                    'High (8/10)'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Period Tracker */}
      <View className="w-full bg-white rounded-2xl p-4 border border-gray-300 mt-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Period Tracker
          </Text>
          <Text className="text-red-600 text-base font-medium">
            Ongoing - 4 days
          </Text>
        </View>
        <View className="flex-row justify-between">
          {Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() + index);
            const isOngoing = index < 4; // First 4 days are ongoing
            const isCrossed = index === 2; // Third date will have cross mark

            return (
              <View key={index} className="items-center">
                <View className={`w-12 h-12 rounded-lg border-2 items-center justify-center mb-2 relative ${
                  isCrossed 
                    ? 'bg-gray-50 border-gray-200' // Crossed date gets gray background
                    : isOngoing
                      ? 'bg-red-500 border-red-500'
                      : 'bg-gray-50 border-gray-200'
                }`}>
                  <Text className={`text-xs font-medium ${
                    isCrossed 
                      ? 'text-gray-700' // Crossed date gets gray text
                      : isOngoing 
                        ? 'text-white' 
                        : 'text-gray-700'
                  }`}>
                    {date.getDate()}
                  </Text>
                  {/* Red Cross Mark */}
                  {isCrossed && (
                    <View className="absolute inset-0 items-center justify-center">
                      <View className="w-full h-0.5 bg-red-600 absolute" style={{ transform: [{ rotate: '45deg' }] }} />
                      <View className="w-full h-0.5 bg-red-600 absolute" style={{ transform: [{ rotate: '-45deg' }] }} />
                    </View>
                  )}
                </View>
                <Text className={`text-xs font-medium ${
                  isCrossed 
                    ? 'text-gray-500' // Crossed date gets gray label
                    : isOngoing 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                }`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
