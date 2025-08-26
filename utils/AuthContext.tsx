import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (emailOrPhone: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any; user?: User }>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session) {
          // Store session in AsyncStorage
          await AsyncStorage.setItem('session', JSON.stringify(session));
        } else {
          // Clear session from AsyncStorage
          await AsyncStorage.removeItem('session');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      // Check for stored session
      const storedSession = await AsyncStorage.getItem('session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        setSession(session);
        setUser(session.user);
      }

      // Get current session from Supabase
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (emailOrPhone: string, password: string) => {
    try {
      console.log('Attempting login with:', emailOrPhone);
      
      // Determine if input is email or phone number
      const isEmail = emailOrPhone.includes('@');
      
      let userEmail: string;
      
      if (isEmail) {
        // Input is email, use it directly
        userEmail = emailOrPhone;
        console.log('Login with email:', userEmail);
      } else {
        // Input is phone number, find the user by phone
        console.log('Login with phone number:', emailOrPhone);
        
        // Query the public.users table to find the user by phone number
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('phone', emailOrPhone)
          .single();
        
        if (userError || !userData) {
          console.error('User not found with phone number:', emailOrPhone);
          return { error: { message: 'No account found with this phone number. Please check and try again.' } };
        }
        
        userEmail = userData.email;
        console.log('Found user email for phone:', userEmail);
      }
      
      // Now sign in with the email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error: { message: error.message } };
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        return { error: null };
      }

      return { error: { message: 'Login failed. Please try again.' } };
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: 'An unexpected error occurred during login' } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      console.log('AuthContext signUp called with:', { 
        email, 
        fullName, 
        phone,
        password: password ? `${password.substring(0, 3)}***` : 'UNDEFINED'
      });

      // Safety check for password parameter
      if (!password || typeof password !== 'string') {
        console.error('Password validation failed - invalid password parameter');
        return { error: { message: 'Invalid password parameter. Please try again.' } };
      }

      // Use Supabase Auth to create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        }
      });

      if (error) {
        console.error('Supabase Auth signup error:', error);
        return { error: { message: error.message || 'Failed to create user account' } };
      }

      if (!data.user) {
        console.error('No user data returned from Supabase Auth');
        return { error: { message: 'Failed to create user account. Please try again.' } };
      }

      console.log('User account created successfully via Supabase Auth:', data.user.id);
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: { message: 'An unexpected error occurred during signup' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      await AsyncStorage.removeItem('session');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    checkUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
