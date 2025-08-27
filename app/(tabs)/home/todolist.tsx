import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Plus, X, Star, Bell } from 'lucide-react-native';
import * as Location from 'expo-location';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isCompleted: boolean;
  isOverdue: boolean;
  isFavorite: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
  }>({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    category: 'Inbox'
  });

  // State for dynamic Today button
  const [todayButtonText, setTodayButtonText] = useState('Today');
  const [todayButtonTime, setTodayButtonTime] = useState('');
  
  // Component mount state and timezone detection
  const [isMounted, setIsMounted] = useState(false);
  const [userTimezone, setUserTimezone] = useState('IST');
  const [isInIndia, setIsInIndia] = useState(true);
  
  // Detect user's timezone and location on mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        await detectUserTimezone();
        setIsMounted(true);
        
        // Set up live location tracking every 30 seconds
        const locationInterval = setInterval(async () => {
          try {
            await updateLocationAndTime();
          } catch (error) {
            // Silent fail for location updates
          }
        }, 30000); // Update every 30 seconds
        
        return () => clearInterval(locationInterval);
      } catch (error) {
        console.error('Error initializing component:', error);
        // Safe fallback
        setUserTimezone('IST');
        setIsInIndia(true);
        setIsMounted(true);
      }
    };
    
    initializeComponent();
    
    return () => setIsMounted(false);
  }, []);

  // Function to update location and time in real-time
  const updateLocationAndTime = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        
        const { latitude, longitude } = location.coords;
        
        // Check if coordinates are within India's approximate boundaries
        const isInIndiaBounds = (
          latitude >= 6.0 && latitude <= 37.0 && 
          longitude >= 68.0 && longitude <= 97.0
        );
        
        if (isInIndiaBounds !== isInIndia) {
          setIsInIndia(isInIndiaBounds);
          setUserTimezone(isInIndiaBounds ? 'IST' : Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
      }
    } catch (error) {
      // Silent fail for live updates
    }
  };

  // Function to detect user's timezone
  const detectUserTimezone = async () => {
    try {
      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Check if device is already in IST timezone
      if (deviceTimezone.includes('Asia/Kolkata') || deviceTimezone.includes('IST') || deviceTimezone.includes('India')) {
        setUserTimezone('IST');
        setIsInIndia(true);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced
          });
          
          const { latitude, longitude } = location.coords;
          
          const isInIndiaBounds = (
            latitude >= 6.0 && latitude <= 37.0 && 
            longitude >= 68.0 && longitude <= 97.0
          );
          
          if (isInIndiaBounds) {
            setUserTimezone('IST');
            setIsInIndia(true);
          } else {
            setUserTimezone(deviceTimezone);
            setIsInIndia(false);
          }
        } catch (locationError) {
          console.error('Error getting location:', locationError);
          setUserTimezone(deviceTimezone);
          setIsInIndia(false);
        }
      } else {
        setUserTimezone(deviceTimezone);
        setIsInIndia(false);
      }
    } catch (error) {
      console.error('Error in timezone detection:', error);
      setUserTimezone('IST');
      setIsInIndia(true);
    }
  };

  // Function to get current time in user's timezone
  const getCurrentUserTime = () => {
    try {
      const now = new Date();
      
      // Always use device time directly - no conversion needed
      // The device timezone detection handles the rest
      return now;
    } catch (error) {
      console.error('Error getting user time:', error);
      return new Date();
    }
  };

  // Function to determine if time has passed in user's timezone
  const hasTimePassedToday = (hours: number, minutes: number) => {
    try {
      const userNow = getCurrentUserTime();
      const currentHours = userNow.getHours();
      const currentMinutes = userNow.getMinutes();
      
      // Convert input time to minutes for easier comparison
      const inputTimeInMinutes = hours * 60 + minutes;
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      
      const hasPassed = inputTimeInMinutes < currentTimeInMinutes;
      
      return hasPassed;
    } catch (error) {
      console.error('Error checking user time:', error);
      return false;
    }
  };

  // Function to parse time from task title with enhanced intelligence
  const parseTimeFromTitle = (title: string) => {
    try {
      if (!title || typeof title !== 'string') {
        return null;
      }
      
      // Super intelligent time regex - handles all formats
      const timeRegex = /(\d{1,2}):?(\d{2})\s*(am|pm|AM|PM|Am|Pm|aM|pM)/i;
      const match = title.match(timeRegex);
      
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toLowerCase();
        
        // Validate hours and minutes
        if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
          return null;
        }
        
        // Convert to 24-hour format
        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;
        
        return { hours, minutes };
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Error parsing time:', error);
      return null;
    }
  };

  // Function to get appropriate date with intelligent logic
  const getAppropriateDate = (hours: number, minutes: number) => {
    try {
      const userNow = getCurrentUserTime();
      const today = new Date(userNow.getFullYear(), userNow.getMonth(), userNow.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (hasTimePassedToday(hours, minutes)) {
        return {
          date: tomorrow,
          text: 'Tomorrow',
          displayText: `Tomorrow ${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`,
          color: 'amber'
        };
      } else {
        return {
          date: today,
          text: 'Today',
          displayText: `Today ${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`,
          color: 'green'
        };
      }
    } catch (error) {
      return {
        date: new Date(),
        text: 'Today',
        displayText: 'Today',
        color: 'green'
      };
    }
  };

  // Function to update Today button with super intelligent logic
  const updateTodayButton = (title: string) => {
    try {
      if (!title || typeof title !== 'string') {
        setTodayButtonText('Today');
        setTodayButtonTime('');
        return;
      }
      
      const timeInfo = parseTimeFromTitle(title);
      
      if (timeInfo && timeInfo.hours && timeInfo.minutes) {
        const dateInfo = getAppropriateDate(timeInfo.hours, timeInfo.minutes);
        
        // Automatically update button text and time
        setTodayButtonText(dateInfo.text);
        
        // Create clean time display (e.g., "9:00 AM" instead of "Tomorrow 9:00 AM")
        const timeDisplay = `${timeInfo.hours > 12 ? timeInfo.hours - 12 : timeInfo.hours}:${timeInfo.minutes.toString().padStart(2, '0')} ${timeInfo.hours >= 12 ? 'PM' : 'AM'}`;
        setTodayButtonTime(timeDisplay);
      } else {
        // Default to today
        setTodayButtonText('Today');
        setTodayButtonTime('');
      }
    } catch (error) {
      setTodayButtonText('Today');
      setTodayButtonTime('');
    }
  };

  // Update Today button when task title changes
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      if (newTask && newTask.title !== undefined && newTask.title.trim() !== '') {
        updateTodayButton(newTask.title);
      } else {
        setTodayButtonText('Today');
        setTodayButtonTime('');
      }
    } catch (error) {
      setTodayButtonText('Today');
      setTodayButtonTime('');
    }
  }, [newTask?.title, isMounted]);

  const addTask = async () => {
    try {
      if (!newTask.title.trim()) {
        Alert.alert('Error', 'Please enter a task title');
        return;
      }

      // Parse time and determine date
      const timeInfo = parseTimeFromTitle(newTask.title);
      let dueDate = 'Today';
      let dueTime = '';
      
      if (timeInfo) {
        const dateInfo = getAppropriateDate(timeInfo.hours, timeInfo.minutes);
        dueDate = dateInfo.text;
        dueTime = `${timeInfo.hours > 12 ? timeInfo.hours - 12 : timeInfo.hours}:${timeInfo.minutes.toString().padStart(2, '0')} ${timeInfo.hours >= 12 ? 'PM' : 'AM'}`;
      } else {
        // Default time: current time + 1 hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const hours = now.getHours();
        const minutes = now.getMinutes();
        dueTime = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      }

      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        dueDate: dueDate,
        dueTime: dueTime,
        priority: newTask.priority,
        category: newTask.category,
        isCompleted: false,
        isOverdue: false,
        isFavorite: false
      };

      // Add task to the beginning of the list (newest first)
      setTasks([task, ...tasks]);
      
      // Close modal
      setModalVisible(false);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        priority: 'medium',
        category: 'Inbox'
      });
      
      // Reset Today button
      setTodayButtonText('Today');
      setTodayButtonTime('');
      
      // Show success feedback
      Alert.alert('✅ Task Added!', `"${task.title}" has been added for ${dueDate} at ${dueTime}`, [
        { text: 'Great!', style: 'default' }
      ]);
      
    } catch (error) {
      console.error('Error adding task:', error);
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isCompleted: !task.isCompleted }
        : task
    ));
  };

  const toggleFavorite = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, isFavorite: !task.isFavorite }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const overdueTasks = tasks.filter(task => task.isOverdue && !task.isCompleted);
  const todayTasks = tasks.filter(task => !task.isOverdue && !task.isCompleted);

  return (
    <View className="px-6 py-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-2xl font-bold text-gray-900">
        Today’s To-Dos
        </Text>
        <TouchableOpacity 
          className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center shadow-sm"
          onPress={() => setModalVisible(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Overdue
          </Text>
          {overdueTasks.map(task => (
            <View key={task.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
              <View className="flex-row items-start">
                {/* Task Circle */}
                <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} className="mr-3 mt-1">
                  <View className={`w-6 h-6 rounded-full border-2 ${task.isCompleted ? 'border-red-500 bg-red-500' : 'border-gray-400'}`} />
                </TouchableOpacity>
                
                {/* Task Content */}
                <View className="flex-1">
                  <Text className={`font-semibold text-base mb-2 ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </Text>
                  {task.description && (
                    <Text className="text-gray-600 text-sm mb-2">
                      {task.description}
                    </Text>
                  )}
                  <View className="flex-row items-center">
                    <Bell size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-2">
                      {task.dueDate} {task.dueTime}
                    </Text>
                  </View>
                </View>

                {/* Favorite Star */}
                <TouchableOpacity onPress={() => toggleFavorite(task.id)} className="ml-2">
                  <Star 
                    size={20} 
                    color={task.isFavorite ? "#F59E0B" : "#9CA3AF"} 
                    fill={task.isFavorite ? "#F59E0B" : "transparent"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Today's Tasks Section */}
      <View>
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Today's Tasks
        </Text>
        
        {todayTasks.length > 0 ? (
          todayTasks.map(task => (
            <View key={task.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
              <View className="flex-row items-start">
                {/* Task Circle */}
                <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} className="mr-3 mt-1">
                  <View className={`w-6 h-6 rounded-full border-2 ${task.isCompleted ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`} />
                </TouchableOpacity>
                
                {/* Task Content */}
                <View className="flex-1">
                  <Text className={`font-semibold text-base mb-2 ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </Text>
                  {task.description && (
                    <Text className="text-gray-600 text-sm mb-2">
                      {task.description}
                    </Text>
                  )}
                  <View className="flex-row items-center">
                    <Bell size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-2">
                      {task.dueDate} {task.dueTime}
                    </Text>
                  </View>
                </View>

                {/* Favorite Star */}
                <TouchableOpacity onPress={() => toggleFavorite(task.id)} className="ml-2">
                  <Star 
                    size={20} 
                    color={task.isFavorite ? "#F59E0B" : "#9CA3AF"} 
                    fill={task.isFavorite ? "#F59E0B" : "transparent"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <Text className="text-gray-500 text-center text-sm">
              No tasks for today. Tap the + button to add a new task!
            </Text>
          </View>
        )}
      </View>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="flex-1">
              {/* Transparent Background - Home Content Visible */}
              <View className="flex-1" />
              
              {/* Task Creation Overlay - Perfect Alignment */}
              <TouchableWithoutFeedback onPress={() => {}}>
                <View className="bg-white rounded-t-3xl shadow-2xl">
                  {/* Content Container with Proper Spacing */}
                  <View className="px-6 py-6">
                    {/* Task Title Input */}
                    <View className="mb-6">
                      <TextInput
                        className="text-gray-900 text-lg font-medium bg-transparent"
                        placeholder="Eg: Herbal tea (Triphala) – 10:30 PM"
                        placeholderTextColor="#9CA3AF"
                        value={newTask.title}
                        onChangeText={(text) => {
                          setNewTask({...newTask, title: text});
                        }}
                        onSubmitEditing={addTask}
                        returnKeyType="done"
                        blurOnSubmit={false}
                        autoFocus
                      />
                    </View>

                    {/* Action Buttons Row - Horizontal Scrollable */}
                    <View className="mb-6">
                      <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 0 }}
                      >
                        {/* Today Button - Dynamic Colors */}
                        <View className={`bg-white border border-gray-300 rounded-lg px-4 py-3 flex-row items-center ${todayButtonText === 'Tomorrow' ? 'min-w-[140px]' : 'min-w-[80px]'}`}>
                          <View className="w-4 h-4 mr-3 flex-shrink-0">
                            <View className={`w-3 h-3 rounded ${todayButtonText === 'Tomorrow' ? 'bg-amber-600' : 'bg-green-600'}`} />
                            <View className="w-1 h-1 bg-white rounded-sm m-auto mt-0.5" />
                          </View>
                          <View className="flex-1 min-w-0">
                            <Text className={`font-medium text-sm ${todayButtonText === 'Tomorrow' ? 'text-amber-700' : 'text-green-700'}`} numberOfLines={1}>
                              {todayButtonText} {todayButtonTime && `• ${todayButtonTime}`}
                            </Text>
                          </View>
                        </View>

                        {/* Priority Button */}
                        <View className="bg-white border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mr-3">
                          <View className="w-4 h-4 mr-2">
                            <View className="w-3 h-3 border-l-2 border-t-2 border-gray-600 transform rotate-45" />
                          </View>
                          <Text className="text-gray-600 font-medium text-sm">Priority</Text>
                        </View>

                        {/* Reminders Button */}
                        <View className="bg-white border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mr-3">
                          <View className="w-4 h-4 mr-2">
                            <View className="w-3 h-3 border-2 border-gray-600 rounded-full" />
                            <View className="w-1 h-1 bg-gray-600 rounded-full absolute top-0 right-1" />
                          </View>
                          <Text className="text-gray-600 font-medium text-sm">Reminders</Text>
                        </View>

                        {/* More Options Button */}
                        <View className="bg-white border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mr-3">
                          <Text className="text-gray-600 font-medium text-sm">...</Text>
                        </View>
                      </ScrollView>
                    </View>

                    {/* Separator Line */}
                    <View className="h-px bg-gray-200 mb-6" />

                    {/* Inbox Selection and Add Button */}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <View className="w-5 h-4 border-2 border-gray-400 rounded mr-2" />
                        <Text className="text-gray-600 font-medium">Inbox</Text>
                        <View className="w-3 h-3 ml-2">
                          <View className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45" />
                        </View>
                      </View>

                      {/* Add Button */}
                      <TouchableOpacity 
                        onPress={addTask}
                        className="w-12 h-12 bg-red-500 rounded-full items-center justify-center shadow-lg"
                        activeOpacity={0.8}
                        style={{
                          shadowColor: '#EF4444',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4.65,
                          elevation: 8,
                        }}
                      >
                        <View className="w-4 h-4 border-t-2 border-r-2 border-white transform rotate-45" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
