import { supabase } from './supabase';

export interface AppointmentData {
  appointment_date: string;
  appointment_time: string;
  appointment_datetime: string;
  notes?: string;
}

export interface AppointmentWithUser extends AppointmentData {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  // User details from profiles table
  user_name?: string;
  user_phone?: string;
  user_email?: string;
}

// Convert time format from "9:00 AM" to "09:00:00"
export const convertTimeFormat = (timeString: string): string => {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
};

// Convert date to YYYY-MM-DD format
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Create appointment datetime string
const createDateTime = (date: Date, timeString: string): string => {
  const timeOnly = convertTimeFormat(timeString);
  const dateStr = formatDate(date);
  return `${dateStr}T${timeOnly}`;
};

// Book a new appointment
export const bookAppointment = async (appointmentData: AppointmentData): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log('Booking appointment with data:', appointmentData);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return { success: false, error: 'User not authenticated' };
    }

    console.log('Current user ID:', user.id);

    // Prepare appointment data
    const appointmentPayload = {
      user_id: user.id,
      appointment_date: appointmentData.appointment_date,
      appointment_time: convertTimeFormat(appointmentData.appointment_time),
      appointment_datetime: appointmentData.appointment_datetime,
      notes: appointmentData.notes || null,
      status: 'pending'
    };

    console.log('Appointment payload:', appointmentPayload);



    // Insert appointment into database
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentPayload])
      .select()
      .single();

    if (error) {
      console.error('Error booking appointment:', error);
      return { success: false, error: error.message };
    }

    console.log('Appointment booked successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in bookAppointment:', error);
    return { success: false, error: 'Failed to book appointment' };
  }
};

// Get user's appointments with profile details
export const getUserAppointments = async (): Promise<{ success: boolean; data?: AppointmentWithUser[]; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }



    // Get user's appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_datetime', { ascending: false });

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      return { success: false, error: appointmentsError.message };
    }

    // Use user data from authentication (more reliable)
    let userDetails = {
      email: user.email || '',
      phone: user.phone || user.user_metadata?.phone || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name || 'User'
    };

    console.log('User auth data:', {
      id: user.id,
      email: user.email,
      phone: user.phone,
      user_metadata: user.user_metadata
    });

    // Try to get additional user details from profiles table if available
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, phone, email')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) {
        // Use profile data as fallback if auth data is missing
        userDetails = {
          email: userDetails.email || profileData.email || '',
          phone: userDetails.phone || profileData.phone || '',
          name: userDetails.name !== 'User' ? userDetails.name : (profileData.name || 'User')
        };
      }
    } catch (error) {
      // Ignore profile table errors, continue with auth data
      console.log('Profile table not accessible, using auth data only');
    }

    console.log('Final user details for appointments:', userDetails);

    // Transform data to include user details
    const appointmentsWithUser = appointments?.map(appointment => ({
      ...appointment,
      user_name: userDetails.name,
      user_phone: userDetails.phone || '',
      user_email: userDetails.email || ''
    })) || [];

    return { success: true, data: appointmentsWithUser };
  } catch (error) {
    console.error('Error in getUserAppointments:', error);
    return { success: false, error: 'Failed to fetch appointments' };
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    return { success: false, error: 'Failed to update appointment' };
  }
};

// Cancel appointment (mark as cancelled)
export const cancelAppointment = async (appointmentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (error) {
      console.error('Error cancelling appointment:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    return { success: false, error: 'Failed to cancel appointment' };
  }
};

// Delete appointment permanently from database
export const deleteAppointment = async (appointmentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) {
      console.error('Error deleting appointment:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    return { success: false, error: 'Failed to delete appointment' };
  }
};

// Helper function to prepare appointment data
export const prepareAppointmentData = (selectedDate: Date, selectedTime: string, notes?: string): AppointmentData => {
  return {
    appointment_date: formatDate(selectedDate),
    appointment_time: selectedTime,
    appointment_datetime: createDateTime(selectedDate, selectedTime),
    notes: notes || undefined
  };
};
