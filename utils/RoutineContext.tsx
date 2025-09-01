import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { 
  RoutineWithSleep, 
  CreateSleepData, 
  getRoutineWithSleep, 
  saveSleepData,
  getTodayDate 
} from './routineService';

interface RoutineContextType {
  todayRoutine: RoutineWithSleep | null;
  isLoading: boolean;
  saveSleepData: (sleepData: CreateSleepData) => Promise<void>;
  refreshTodayRoutine: () => Promise<void>;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [todayRoutine, setTodayRoutine] = useState<RoutineWithSleep | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('RoutineProvider: Initializing...');

  // Load today's routine on mount
  useEffect(() => {
    console.log('RoutineProvider: useEffect triggered, calling refreshTodayRoutine');
    refreshTodayRoutine();
  }, []);

  const refreshTodayRoutine = async () => {
    console.log('RoutineProvider: refreshTodayRoutine called');
    try {
      const today = getTodayDate();
      const result = await getRoutineWithSleep(today);
      console.log('RoutineProvider: getRoutineWithSleep result:', result);
      
      if (result.success) {
        setTodayRoutine(result.data || null);
        console.log('RoutineProvider: todayRoutine set to:', result.data);
      } else {
        console.error('Failed to load today\'s routine:', result.error);
      }
    } catch (error) {
      console.error('Error refreshing routine:', error);
    }
  };

  const saveSleepDataToContext = async (sleepData: CreateSleepData) => {
    console.log('RoutineProvider: saveSleepData called with:', sleepData);
    
    if (isLoading) {
      console.log('RoutineProvider: Already loading, skipping save operation');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const today = getTodayDate();
      console.log('RoutineProvider: Saving sleep data for date:', today);
      
      const result = await saveSleepData(today, sleepData);
      
      if (result.success) {
        setTodayRoutine(result.data || null);
        console.log('RoutineProvider: Sleep data saved successfully, updated todayRoutine');
        
        // Don't show success message here - let the parent component handle it
      } else {
        console.error('Failed to save sleep data:', result.error);
        // Still show error alerts for debugging
        Alert.alert('Error', result.error || 'Failed to save sleep data');
      }
    } catch (error) {
      console.error('Error saving sleep data:', error);
      Alert.alert('Error', 'Failed to save sleep data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoutineContext.Provider value={{
      todayRoutine,
      isLoading,
      saveSleepData: saveSleepDataToContext,
      refreshTodayRoutine
    }}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    console.warn('useRoutine must be used within a RoutineProvider - returning default values');
    // Return default values instead of throwing error
    return {
      todayRoutine: null,
      isLoading: false,
      saveSleepData: async () => {
        console.warn('Routine context not available - cannot save data');
      },
      refreshTodayRoutine: async () => {
        console.warn('Routine context not available - cannot refresh data');
      }
    };
  }
  return context;
}
