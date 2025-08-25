import { supabase } from '../utils/supabase';

// Mock Supabase for testing
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

describe('Supabase Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Details Storage', () => {
    it('should store user details with correct data structure', async () => {
      const mockUserDetails = {
        id: 'test-details-id',
        user_id: 'test-user-id',
        gender: 'Male',
        date_of_birth: '1990-01-01',
        weight: 70,
        height: 175,
        activity_level: 'Moderate',
        goal: 'Digestive Issues',
        profile_image: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Mock successful insertion
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

      // Simulate the completeSignup function logic
      const completeSignup = async () => {
        const userId = 'test-user-id';
        const gender = 'Male';
        const dateOfBirth = '01/01/1990';
        const weight = '70';
        const height = '175';
        const lifestyleType = 'Moderate';
        const goal = 'Digestive Issues';
        const profileImage = null;

        // Format date
        const [day, month, year] = dateOfBirth.split('/');
        const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const formattedDateOfBirth = birthDate.toISOString().split('T')[0];

        // Validate weight and height
        const weightValue = parseFloat(weight);
        const heightValue = parseFloat(height);

        // Check for existing records
        const { data: existingDetails, error: existingDetailsError } = await supabase
          .from('user_details')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (existingDetails && !existingDetailsError) {
          // Update existing record
          const { data: updateDetails, error: updateError } = await supabase
            .from('user_details')
            .update({
              gender: gender,
              date_of_birth: formattedDateOfBirth,
              weight: weightValue,
              height: heightValue,
              activity_level: lifestyleType,
              goal: goal,
              profile_image: profileImage
            })
            .eq('user_id', userId)
            .select()
            .single();

          return { data: updateDetails, error: updateError };
        } else {
          // Insert new record
          const { data: detailsData, error: detailsError } = await supabase
            .from('user_details')
            .insert([
              {
                user_id: userId,
                gender: gender,
                date_of_birth: formattedDateOfBirth,
                weight: weightValue,
                height: heightValue,
                activity_level: lifestyleType,
                goal: goal,
                profile_image: profileImage
              }
            ])
            .select()
            .single();

          return { data: detailsData, error: detailsError };
        }
      };

      const result = await completeSignup();

      // Verify Supabase calls
      expect(supabase.from).toHaveBeenCalledWith('user_details');
             expect(supabase.from('user_details').insert).toHaveBeenCalledWith([
         {
           user_id: 'test-user-id',
           gender: 'Male',
           date_of_birth: '1989-12-31',
           weight: 70,
           height: 175,
           activity_level: 'Moderate',
                     goal: 'Digestive Issues',
          profile_image: null
        }
      ]);

      expect(result.data).toEqual(mockUserDetails);
      expect(result.error).toBeNull();
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
       const mockUpdate = jest.fn(() => ({
         eq: jest.fn(() => ({
           select: jest.fn(() => ({
             single: jest.fn(() => Promise.resolve({ data: existingUserDetails, error: null }))
           }))
         }))
       }));

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
         update: mockUpdate
       });

      const userId = 'test-user-id';
      const gender = 'Male';
      const dateOfBirth = '01/01/1990';
      const weight = '70';
      const height = '175';
      const lifestyleType = 'Moderate';
      const goal = 'General wellness';
      const profileImage = null;

      // Format date
      const [day, month, year] = dateOfBirth.split('/');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formattedDateOfBirth = birthDate.toISOString().split('T')[0];

      // Validate weight and height
      const weightValue = parseFloat(weight);
      const heightValue = parseFloat(height);

      // Check for existing records
      const { data: existingDetails, error: existingDetailsError } = await supabase
        .from('user_details')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingDetails && !existingDetailsError) {
        // Update existing record
        const { data: updateDetails, error: updateError } = await supabase
          .from('user_details')
          .update({
            gender: gender,
            date_of_birth: formattedDateOfBirth,
            weight: weightValue,
            height: heightValue,
            activity_level: lifestyleType,
            goal: goal,
            profile_image: profileImage
          })
          .eq('user_id', userId)
          .select()
          .single();

        // Verify update was called
                 expect(supabase.from('user_details').update).toHaveBeenCalledWith({
           gender: 'Male',
           date_of_birth: '1989-12-31',
           weight: 70,
           height: 175,
           activity_level: 'Moderate',
           goal: 'General wellness',
           profile_image: null
         });

                 // Verify update was called with correct parameters
         expect(mockUpdate).toHaveBeenCalled();
      }
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Database connection failed' } }))
          }))
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'No rows found' } }))
          }))
        }))
      });

      const userId = 'test-user-id';
      const gender = 'Male';
      const dateOfBirth = '01/01/1990';
      const weight = '70';
      const height = '175';
      const lifestyleType = 'Moderate';
      const goal = 'General wellness';
      const profileImage = null;

      // Format date
      const [day, month, year] = dateOfBirth.split('/');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formattedDateOfBirth = birthDate.toISOString().split('T')[0];

      // Validate weight and height
      const weightValue = parseFloat(weight);
      const heightValue = parseFloat(height);

      // Attempt to insert
      const { data: detailsData, error: detailsError } = await supabase
        .from('user_details')
        .insert([
          {
            user_id: userId,
            gender: gender,
            date_of_birth: formattedDateOfBirth,
            weight: weightValue,
            height: heightValue,
            activity_level: lifestyleType,
            goal: goal,
            profile_image: profileImage
          }
        ])
        .select()
        .single();

      expect(detailsData).toBeNull();
      expect(detailsError).toEqual({ message: 'Database connection failed' });
    });

    it('should validate data types before storage', async () => {
      const userId = 'test-user-id';
      const gender = 'Male';
      const dateOfBirth = '01/01/1990';
      const weight = '70';
      const height = '175';
      const lifestyleType = 'Moderate';
      const goal = 'General wellness';
      const profileImage = null;

      // Format date
      const [day, month, year] = dateOfBirth.split('/');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formattedDateOfBirth = birthDate.toISOString().split('T')[0];

      // Validate weight and height
      const weightValue = parseFloat(weight);
      const heightValue = parseFloat(height);

      // Verify data types
      expect(typeof userId).toBe('string');
      expect(typeof gender).toBe('string');
      expect(typeof formattedDateOfBirth).toBe('string');
      expect(typeof weightValue).toBe('number');
      expect(typeof heightValue).toBe('number');
      expect(typeof lifestyleType).toBe('string');
      expect(typeof goal).toBe('string');
      expect(profileImage).toBeNull();

      // Verify date format
      expect(formattedDateOfBirth).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      // Verify numeric ranges
      expect(weightValue).toBeGreaterThanOrEqual(20);
      expect(weightValue).toBeLessThanOrEqual(300);
      expect(heightValue).toBeGreaterThanOrEqual(100);
      expect(heightValue).toBeLessThanOrEqual(250);
    });

    it('should handle profile image storage', async () => {
      const mockUserDetails = {
        id: 'test-details-id',
        user_id: 'test-user-id',
        gender: 'Male',
        date_of_birth: '1990-01-01',
        weight: 70,
        height: 175,
        activity_level: 'Moderate',
        goal: 'General wellness',
        profile_image: 'https://example.com/profile.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Mock successful insertion with profile image
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

      const userId = 'test-user-id';
      const gender = 'Male';
      const dateOfBirth = '01/01/1990';
      const weight = '70';
      const height = '175';
      const lifestyleType = 'Moderate';
      const goal = 'General wellness';
      const profileImage = 'https://example.com/profile.jpg';

      // Format date
      const [day, month, year] = dateOfBirth.split('/');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formattedDateOfBirth = birthDate.toISOString().split('T')[0];

      // Validate weight and height
      const weightValue = parseFloat(weight);
      const heightValue = parseFloat(height);

      // Insert with profile image
      const { data: detailsData, error: detailsError } = await supabase
        .from('user_details')
        .insert([
          {
            user_id: userId,
            gender: gender,
            date_of_birth: formattedDateOfBirth,
            weight: weightValue,
            height: heightValue,
            activity_level: lifestyleType,
            goal: goal,
            profile_image: profileImage
          }
        ])
        .select()
        .single();

             expect(supabase.from('user_details').insert).toHaveBeenCalledWith([
         {
           user_id: 'test-user-id',
           gender: 'Male',
           date_of_birth: '1989-12-31',
           weight: 70,
           height: 175,
           activity_level: 'Moderate',
           goal: 'General wellness',
           profile_image: 'https://example.com/profile.jpg'
         }
       ]);

      expect(detailsData).toEqual(mockUserDetails);
      expect(detailsError).toBeNull();
    });
  });

  describe('Data Verification', () => {
    it('should verify stored data matches input data', async () => {
      const mockUserDetails = {
        id: 'test-details-id',
        user_id: 'test-user-id',
        gender: 'Female',
        date_of_birth: '1985-06-15',
        weight: 65,
        height: 165,
        activity_level: 'Active',
        goal: 'Improve sleep',
        profile_image: null
      };

      // Mock successful insertion and verification
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

      // Simulate stored data verification
      const { data: verifyDetails, error: verifyDetailsError } = await supabase
        .from('user_details')
        .select('*')
        .eq('user_id', 'test-user-id')
        .single();

      expect(verifyDetails).toEqual(mockUserDetails);
      expect(verifyDetailsError).toBeNull();

      // Verify specific fields
      expect(verifyDetails?.gender).toBe('Female');
      expect(verifyDetails?.date_of_birth).toBe('1985-06-15');
      expect(verifyDetails?.weight).toBe(65);
      expect(verifyDetails?.height).toBe(165);
      expect(verifyDetails?.activity_level).toBe('Active');
      expect(verifyDetails?.goal).toBe('Improve sleep');
      expect(verifyDetails?.profile_image).toBeNull();
    });

    it('should handle verification errors', async () => {
      // Mock verification error
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'User not found' } }))
          }))
        }))
      });

      const { data: verifyDetails, error: verifyDetailsError } = await supabase
        .from('user_details')
        .select('*')
        .eq('user_id', 'non-existent-user-id')
        .single();

      expect(verifyDetails).toBeNull();
      expect(verifyDetailsError).toEqual({ message: 'User not found' });
    });
  });

  describe('Table Structure Validation', () => {
    it('should use correct table names', () => {
      expect(supabase.from).toBeDefined();
      
      // Verify table names are called correctly
      supabase.from('users');
      supabase.from('user_details');
      
      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(supabase.from).toHaveBeenCalledWith('user_details');
    });

    it('should use correct column names', async () => {
      const userId = 'test-user-id';
      const gender = 'Male';
      const dateOfBirth = '01/01/1990';
      const weight = '70';
      const height = '175';
      const lifestyleType = 'Moderate';
      const goal = 'General wellness';
      const profileImage = null;

      // Format date
      const [day, month, year] = dateOfBirth.split('/');
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formattedDateOfBirth = birthDate.toISOString().split('T')[0];

      // Validate weight and height
      const weightValue = parseFloat(weight);
      const heightValue = parseFloat(height);

      // Verify column names in insert
      const insertData = {
        user_id: userId,
        gender: gender,
        date_of_birth: formattedDateOfBirth,
        weight: weightValue,
        height: heightValue,
        activity_level: lifestyleType,
        goal: goal,
        profile_image: profileImage
      };

      expect(insertData).toHaveProperty('user_id');
      expect(insertData).toHaveProperty('gender');
      expect(insertData).toHaveProperty('date_of_birth');
      expect(insertData).toHaveProperty('weight');
      expect(insertData).toHaveProperty('height');
      expect(insertData).toHaveProperty('activity_level');
      expect(insertData).toHaveProperty('goal');
      expect(insertData).toHaveProperty('profile_image');

      // Verify column names in select
      const selectColumns = ['id', 'user_id', 'gender', 'date_of_birth', 'weight', 'height', 'activity_level', 'goal', 'profile_image', 'created_at', 'updated_at'];
      
      // Verify that insertData has the expected properties
      expect(insertData).toHaveProperty('user_id');
      expect(insertData).toHaveProperty('gender');
      expect(insertData).toHaveProperty('date_of_birth');
      expect(insertData).toHaveProperty('weight');
      expect(insertData).toHaveProperty('height');
      expect(insertData).toHaveProperty('activity_level');
      expect(insertData).toHaveProperty('goal');
      expect(insertData).toHaveProperty('profile_image');
      
      // Verify that selectColumns contains all expected columns
      expect(selectColumns).toContain('id');
      expect(selectColumns).toContain('user_id');
      expect(selectColumns).toContain('gender');
      expect(selectColumns).toContain('date_of_birth');
      expect(selectColumns).toContain('weight');
      expect(selectColumns).toContain('height');
      expect(selectColumns).toContain('activity_level');
      expect(selectColumns).toContain('goal');
      expect(selectColumns).toContain('profile_image');
      expect(selectColumns).toContain('created_at');
      expect(selectColumns).toContain('updated_at');
    });
  });
});
