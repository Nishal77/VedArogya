import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUp from '../app/(auth)/signup';
import { supabase } from '../utils/supabase';

// Mock Supabase
jest.mock('../utils/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: { id: 'test-user-id' }, error: null }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: { id: 'test-user-id' }, error: null }))
          }))
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'No rows found' } }))
        }))
      }))
    }))
  }
}));

// Mock OTPModal
jest.mock('../app/OTPModal', () => {
  return function MockOTPModal({ visible, onContinue }: any) {
    if (!visible) return null;
    return (
      <div data-testid="otp-modal">
        <button onPress={onContinue}>Verify OTP</button>
      </div>
    );
  };
});

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Account Creation', () => {
    it('should validate required fields in Step 1', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Try to proceed without filling required fields
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Required Fields',
          'Please fill in all required fields before proceeding'
        );
      });
    });

    it('should validate email format', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in invalid email
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'invalid-email');
      
      const fullNameInput = getByPlaceholderText('Enter your full name');
      fireEvent.changeText(fullNameInput, 'John Doe');
      
      const phoneInput = getByPlaceholderText('Enter your phone number');
      fireEvent.changeText(phoneInput, '1234567890');
      
      const passwordInput = getByPlaceholderText('Create a password');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const confirmPasswordInput = getByPlaceholderText('Confirm your password');
      fireEvent.changeText(confirmPasswordInput, 'Password123!');
      
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Email',
          'Please enter a valid email address'
        );
      });
    });

    it('should validate phone number length', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in invalid phone number
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      const fullNameInput = getByPlaceholderText('Enter your full name');
      fireEvent.changeText(fullNameInput, 'John Doe');
      
      const phoneInput = getByPlaceholderText('Enter your phone number');
      fireEvent.changeText(phoneInput, '123456789'); // Less than 10 digits
      
      const passwordInput = getByPlaceholderText('Create a password');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const confirmPasswordInput = getByPlaceholderText('Confirm your password');
      fireEvent.changeText(confirmPasswordInput, 'Password123!');
      
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Phone Number',
          'Please enter a valid 10-digit phone number'
        );
      });
    });

    it('should validate password requirements', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in weak password
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      const fullNameInput = getByPlaceholderText('Enter your full name');
      fireEvent.changeText(fullNameInput, 'John Doe');
      
      const phoneInput = getByPlaceholderText('Enter your phone number');
      fireEvent.changeText(phoneInput, '1234567890');
      
      const passwordInput = getByPlaceholderText('Create a password');
      fireEvent.changeText(passwordInput, 'weak'); // Weak password
      
      const confirmPasswordInput = getByPlaceholderText('Confirm your password');
      fireEvent.changeText(confirmPasswordInput, 'weak');
      
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Password',
          'Please ensure your password meets all requirements'
        );
      });
    });

    it('should validate password confirmation', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in mismatched passwords
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      const fullNameInput = getByPlaceholderText('Enter your full name');
      fireEvent.changeText(fullNameInput, 'John Doe');
      
      const phoneInput = getByPlaceholderText('Enter your phone number');
      fireEvent.changeText(phoneInput, '1234567890');
      
      const passwordInput = getByPlaceholderText('Create a password');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const confirmPasswordInput = getByPlaceholderText('Confirm your password');
      fireEvent.changeText(confirmPasswordInput, 'DifferentPassword123!');
      
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Password Mismatch',
          'Passwords do not match. Please try again.'
        );
      });
    });

    it('should proceed to Step 2 with valid data', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in valid data
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'test@example.com');
      
      const fullNameInput = getByPlaceholderText('Enter your full name');
      fireEvent.changeText(fullNameInput, 'John Doe');
      
      const phoneInput = getByPlaceholderText('Enter your phone number');
      fireEvent.changeText(phoneInput, '1234567890');
      
      const passwordInput = getByPlaceholderText('Create a password');
      fireEvent.changeText(passwordInput, 'Password123!');
      
      const confirmPasswordInput = getByPlaceholderText('Confirm your password');
      fireEvent.changeText(confirmPasswordInput, 'Password123!');
      
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('users');
      });
    });
  });

  describe('Step 2: Personal Details and Data Storage', () => {
    it('should validate required fields in Step 2', async () => {
      const { getByText } = render(<SignUp />);
      
      // Navigate to Step 2 (mock the user creation)
      const mockUserData = { id: 'test-user-id' };
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockUserData, error: null }))
          }))
        }))
      });
      
      // Fill Step 1 and proceed
      // ... (Step 1 logic would be here)
      
      // Try to confirm signup without filling required fields
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Required Fields',
          'Please fill in all required fields in Step 2 before completing signup.'
        );
      });
    });

    it('should validate date of birth format', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in invalid date format
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, 'invalid-date');
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Date',
          'Please enter a valid date of birth in DD/MM/YYYY format.'
        );
      });
    });

    it('should validate weight and height ranges', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in invalid weight
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '5'); // Too low
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Weight',
          'Please enter a valid weight between 20 and 300 kg.'
        );
      });
    });

    it('should store user details in Supabase successfully', async () => {
      const mockUserDetails = {
        id: 'test-details-id',
        user_id: 'test-user-id',
        gender: 'Male',
        date_of_birth: '1990-01-01',
        weight: 70,
        height: 175,
        activity_level: 'Moderate',
        goal: 'General wellness',
        profile_image: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Mock successful user details insertion
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockUserDetails, error: null }))
          }))
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'No rows found' } }))
          }))
        }))
      });

      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in all required fields
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/1990');
      
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '70');
      
      const heightInput = getByPlaceholderText('170');
      fireEvent.changeText(heightInput, '175');
      
      // Select gender
      const maleButton = getByText('Male');
      fireEvent.press(maleButton);
      
      // Select lifestyle type
      const moderateButton = getByText('Moderate – Some activity, walking or light exercise');
      fireEvent.press(moderateButton);
      
      // Select goal
      const wellnessButton = getByText('Digestive Issues');
      fireEvent.press(wellnessButton);
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        // Verify Supabase was called to insert user details
        expect(supabase.from).toHaveBeenCalledWith('user_details');
        expect(supabase.from('user_details').insert).toHaveBeenCalledWith([
          expect.objectContaining({
            user_id: 'test-user-id',
            gender: 'Male',
            date_of_birth: '1990-01-01',
            weight: 70,
            height: 175,
            activity_level: 'Moderate',
            goal: 'General wellness',
            profile_image: null
          })
        ]);
      });
    });

    it('should handle Supabase errors gracefully', async () => {
      // Mock Supabase error
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } }))
          }))
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'No rows found' } }))
          }))
        }))
      });

      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in valid data
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/1990');
      
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '70');
      
      const heightInput = getByPlaceholderText('170');
      fireEvent.changeText(heightInput, '175');
      
      const maleButton = getByText('Male');
      fireEvent.press(maleButton);
      
      const moderateButton = getByText('Some walking or light exercise');
      fireEvent.press(moderateButton);
      
      const wellnessButton = getByText('General wellness');
      fireEvent.press(wellnessButton);
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Warning',
          'User details could not be saved, but account was created.'
        );
      });
    });

    it('should show success message and redirect to login', async () => {
      const mockUserDetails = {
        id: 'test-details-id',
        user_id: 'test-user-id',
        gender: 'Male',
        date_of_birth: '1990-01-01',
        weight: 70,
        height: 175,
        activity_level: 'Moderate',
        goal: 'General wellness',
        profile_image: null
      };

      // Mock successful operations
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockUserDetails, error: null }))
          }))
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockUserDetails, error: null }))
          }))
        }))
      });

      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in all required fields
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/1990');
      
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '70');
      
      const heightInput = getByPlaceholderText('170');
      fireEvent.changeText(heightInput, '175');
      
      const maleButton = getByText('Male');
      fireEvent.press(maleButton);
      
      const moderateButton = getByText('Moderate – Some activity, walking or light exercise');
      fireEvent.press(moderateButton);
      
      const wellnessButton = getByText('Digestive Issues');
      fireEvent.press(wellnessButton);
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        // Verify success message
        expect(Alert.alert).toHaveBeenCalledWith(
          'Signup Complete! 🎉',
          'Your account has been created successfully! You will be redirected to the login page.',
          expect.any(Array)
        );
      });
    });
  });

  describe('Data Validation and Sanitization', () => {
    it('should sanitize and validate date of birth', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Test future date
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/2030');
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Date',
          'Date of birth cannot be in the future.'
        );
      });
    });

    it('should validate age limits', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Test age too young
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/2020'); // 4 years old
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Age',
          'Please enter a valid age between 13 and 120 years.'
        );
      });
    });

    it('should validate weight range', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Test weight too high
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '500'); // Too high
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Weight',
          'Please enter a valid weight between 20 and 300 kg.'
        );
      });
    });

    it('should validate height range', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Test height too low
      const heightInput = getByPlaceholderText('170');
      fireEvent.changeText(heightInput, '50'); // Too low
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Invalid Height',
          'Please enter a valid height between 100 and 250 cm.'
        );
      });
    });
  });

  describe('Supabase Integration Tests', () => {
    it('should call Supabase with correct table names', async () => {
      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in valid data and proceed
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/1990');
      
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '70');
      
      const heightInput = getByPlaceholderText('170');
      fireEvent.changeText(heightInput, '175');
      
      const maleButton = getByText('Male');
      fireEvent.press(maleButton);
      
      const moderateButton = getByText('Some walking or light exercise');
      fireEvent.press(moderateButton);
      
      const wellnessButton = getByText('General wellness');
      fireEvent.press(wellnessButton);
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        // Verify correct table names are used
        expect(supabase.from).toHaveBeenCalledWith('users');
        expect(supabase.from).toHaveBeenCalledWith('user_details');
      });
    });

    it('should handle existing user details update', async () => {
      const existingUserDetails = {
        id: 'existing-details-id',
        user_id: 'test-user-id',
        gender: 'Female',
        date_of_birth: '1985-01-01',
        weight: 60,
        height: 160,
        activity_level: 'Sedentary',
        goal: 'Balance stress',
        profile_image: null
      };

      // Mock existing user details found
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: existingUserDetails, error: null }))
          }))
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: existingUserDetails, error: null }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: existingUserDetails, error: null }))
            }))
          }))
        }))
      });

      const { getByText, getByPlaceholderText } = render(<SignUp />);
      
      // Fill in data
      const dateInput = getByPlaceholderText('DD/MM/YYYY');
      fireEvent.changeText(dateInput, '01/01/1990');
      
      const weightInput = getByPlaceholderText('70');
      fireEvent.changeText(weightInput, '70');
      
      const heightInput = getByPlaceholderText('170');
      fireEvent.changeText(heightInput, '175');
      
      const maleButton = getByText('Male');
      fireEvent.press(maleButton);
      
      const moderateButton = getByText('Some walking or light exercise');
      fireEvent.press(moderateButton);
      
      const wellnessButton = getByText('General wellness');
      fireEvent.press(wellnessButton);
      
      const confirmButton = getByText('Confirm Sign Up');
      fireEvent.press(confirmButton);
      
      await waitFor(() => {
        // Verify update was called instead of insert
        expect(supabase.from('user_details').update).toHaveBeenCalled();
      });
    });
  });
});
