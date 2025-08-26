/**
 * Utility functions for the application
 */

/**
 * Generates a unique ID using timestamp and random string
 * Compatible with React Native (doesn't require crypto)
 */
export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${randomPart}`;
};

/**
 * Validates if input is an email address
 */
export const isEmail = (input: string): boolean => {
  return input.includes('@');
};

/**
 * Validates if input is a phone number (basic validation)
 */
export const isPhoneNumber = (input: string): boolean => {
  // Basic phone validation - at least 10 digits
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(input.replace(/\D/g, ''));
};

/**
 * Cleans phone number by removing non-digit characters
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Formats date from DD/MM/YYYY to YYYY-MM-DD for database
 */
export const formatDateForDatabase = (dateString: string): string | null => {
  try {
    if (dateString && dateString.length === 10) {
      const [day, month, year] = dateString.split('/');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (isNaN(birthDate.getTime())) {
        return null;
      }
      
      return birthDate.toISOString().split('T')[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Validates age from date of birth
 */
export const validateAge = (dateOfBirth: string): { isValid: boolean; age?: number; error?: string } => {
  try {
    const [day, month, year] = dateOfBirth.split('/');
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    if (isNaN(birthDate.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    const today = new Date();
    if (birthDate > today) {
      return { isValid: false, error: 'Date of birth cannot be in the future' };
    }
    
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      return { isValid: false, error: 'Age must be between 13 and 120 years' };
    }
    
    return { isValid: true, age };
  } catch (error) {
    return { isValid: false, error: 'Invalid date' };
  }
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  // Safety check for password parameter
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Invalid password parameter' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};
