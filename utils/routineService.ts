import { supabase } from './supabase';

// ================================
// Type Definitions for New Schema
// ================================

export interface Routine {
  id: string;
  user_id: string;
  routine_date: string;
  routine_label?: string;
  created_at: string;
  updated_at: string;
}

export interface RoutineSleep {
  id: string;
  routine_id: string;
  sleep_time?: string;
  wake_time?: string;
  duration_hours?: number;
  quality?: 'Slept Well' | 'Woke Up Once' | 'Restless';
  morning_feeling?: 'Fresh' | 'Okay' | 'Tired';
}

export interface RoutineWithSleep extends Routine {
  sleep?: RoutineSleep;
}

export interface CreateRoutineData {
  routine_date: string;
  routine_label?: string;
}

export interface CreateSleepData {
  sleep_time?: string;
  wake_time?: string;
  duration_hours?: number;
  quality?: 'Slept Well' | 'Woke Up Once' | 'Restless';
  morning_feeling?: 'Fresh' | 'Okay' | 'Tired';
}

// ================================
// Core Routine Functions
// ================================

// Create or get routine for a specific date
export const getOrCreateRoutine = async (date: string, label?: string): Promise<{ success: boolean; data?: Routine; error?: string }> => {
  try {
    console.log('Getting or creating routine for date:', date);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return { success: false, error: 'User not authenticated' };
    }

    // Check if routine already exists for this date
    const { data: existingRoutine, error: checkError } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', user.id)
      .eq('routine_date', date)
      .single();

    if (existingRoutine) {
      console.log('Found existing routine:', existingRoutine.id);
      return { success: true, data: existingRoutine };
    }

    // Create new routine
    const { data: newRoutine, error: createError } = await supabase
      .from('routines')
      .insert([{
        user_id: user.id,
        routine_date: date,
        routine_label: label
      }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating routine:', createError);
      return { success: false, error: createError.message };
    }

    console.log('Created new routine:', newRoutine.id);
    return { success: true, data: newRoutine };
  } catch (error) {
    console.error('Error in getOrCreateRoutine:', error);
    return { success: false, error: 'Failed to get or create routine' };
  }
};

// Get routine with sleep data for a specific date
export const getRoutineWithSleep = async (date: string): Promise<{ success: boolean; data?: RoutineWithSleep; error?: string }> => {
  try {
    console.log('Getting routine with sleep for date:', date);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Get routine
    const { data: routine, error: routineError } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', user.id)
      .eq('routine_date', date)
      .single();

    if (routineError && routineError.code !== 'PGRST116') {
      console.error('Error fetching routine:', routineError);
      return { success: false, error: routineError.message };
    }

    if (!routine) {
      return { success: true, data: null };
    }

    // Get sleep data for this routine
    const { data: sleep, error: sleepError } = await supabase
      .from('routine_sleep')
      .select('*')
      .eq('routine_id', routine.id)
      .single();

    if (sleepError && sleepError.code !== 'PGRST116') {
      console.error('Error fetching sleep data:', sleepError);
      return { success: false, error: sleepError.message };
    }

    const routineWithSleep: RoutineWithSleep = {
      ...routine,
      sleep: sleep || undefined
    };

    return { success: true, data: routineWithSleep };
  } catch (error) {
    console.error('Error in getRoutineWithSleep:', error);
    return { success: false, error: 'Failed to fetch routine with sleep' };
  }
};

// Save sleep data
export const saveSleepData = async (date: string, sleepData: CreateSleepData): Promise<{ success: boolean; data?: RoutineWithSleep; error?: string }> => {
  try {
    console.log('Saving sleep data for date:', date, sleepData);
    
    // First, get or create routine for this date
    const routineResult = await getOrCreateRoutine(date, 'Daily');
    
    if (!routineResult.success || !routineResult.data) {
      return { success: false, error: routineResult.error || 'Failed to get or create routine' };
    }

    const routine = routineResult.data;

    // Check if sleep data already exists
    const { data: existingSleep, error: checkError } = await supabase
      .from('routine_sleep')
      .select('*')
      .eq('routine_id', routine.id)
      .single();

    let sleepResult;
    
    if (existingSleep) {
      // Update existing sleep data
      console.log('Updating existing sleep data');
      const { data, error } = await supabase
        .from('routine_sleep')
        .update(sleepData)
        .eq('id', existingSleep.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating sleep data:', error);
        return { success: false, error: error.message };
      }
      
      sleepResult = data;
    } else {
      // Create new sleep data
      console.log('Creating new sleep data');
      const { data, error } = await supabase
        .from('routine_sleep')
        .insert([{
          routine_id: routine.id,
          ...sleepData
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating sleep data:', error);
        return { success: false, error: error.message };
      }
      
      sleepResult = data;
    }

    // Return updated routine with sleep data
    const updatedRoutine: RoutineWithSleep = {
      ...routine,
      sleep: sleepResult
    };

    console.log('Sleep data saved successfully');
    return { success: true, data: updatedRoutine };
  } catch (error) {
    console.error('Error in saveSleepData:', error);
    return { success: false, error: 'Failed to save sleep data' };
  }
};

// Get routine history
export const getRoutineHistory = async (days: number = 7): Promise<{ success: boolean; data?: RoutineWithSleep[]; error?: string }> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get routines for the date range
    const { data: routines, error: routinesError } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', user.id)
      .gte('routine_date', startDate.toISOString().split('T')[0])
      .lte('routine_date', endDate.toISOString().split('T')[0])
      .order('routine_date', { ascending: false });

    if (routinesError) {
      console.error('Error fetching routines:', routinesError);
      return { success: false, error: routinesError.message };
    }

    if (!routines || routines.length === 0) {
      return { success: true, data: [] };
    }

    // Get sleep data for all routines
    const routineIds = routines.map(r => r.id);
    const { data: sleepData, error: sleepError } = await supabase
      .from('routine_sleep')
      .select('*')
      .in('routine_id', routineIds);

    if (sleepError) {
      console.error('Error fetching sleep data:', sleepError);
      return { success: false, error: sleepError.message };
    }

    // Combine routines with sleep data
    const routinesWithSleep: RoutineWithSleep[] = routines.map(routine => {
      const sleep = sleepData?.find(s => s.routine_id === routine.id);
      return {
        ...routine,
        sleep: sleep || undefined
      };
    });

    return { success: true, data: routinesWithSleep };
  } catch (error) {
    console.error('Error in getRoutineHistory:', error);
    return { success: false, error: 'Failed to fetch routine history' };
  }
};

// ================================
// Helper Functions
// ================================

// Calculate sleep duration from sleep and wake times
export const calculateSleepDuration = (sleepTime: string, wakeTime: string): number => {
  try {
    const sleep = new Date(`2000-01-01T${sleepTime}`);
    const wake = new Date(`2000-01-01T${wakeTime}`);
    
    let duration = wake.getTime() - sleep.getTime();
    
    // If wake time is before sleep time, it means next day
    if (duration < 0) {
      duration += 24 * 60 * 60 * 1000; // Add 24 hours
    }
    
    const hours = duration / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating sleep duration:', error);
    return 0;
  }
};

// Format time for database storage (returns HH:MM:SS format)
export const formatTimeForDB = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Parse time from database format to Date object
export const parseTimeFromDB = (timeString: string): Date | null => {
  try {
    if (!timeString) return null;
    
    // Handle both HH:MM:SS and HH:MM formats
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return null;
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;
    
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  } catch (error) {
    console.error('Error parsing time from DB:', error);
    return null;
  }
};

// Format date for database storage
export const formatDateForDB = (date: Date): string => {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Get today's date in the correct format
export const getTodayDate = (): string => {
  return formatDateForDB(new Date());
};
