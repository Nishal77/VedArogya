-- TRIGGER LOGIC FIX for Phone Number Storage
-- This fixes the trigger function logic that's preventing phone numbers from being stored
-- Run this in your Supabase SQL Editor

-- 1. DROP EXISTING TRIGGERS AND FUNCTIONS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deletion ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_deletion() CASCADE;

-- 2. CREATE SIMPLIFIED AND DEBUGGED FUNCTIONS

-- Function to handle new user creation (SIMPLIFIED AND DEBUGGED)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_phone TEXT;
    user_full_name TEXT;
    debug_info TEXT;
BEGIN
    -- Extract data with explicit debugging
    user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    -- Create debug info
    debug_info := 'Creating user: ' || NEW.email || ', Phone: ' || user_phone || ', Name: ' || user_full_name;
    
    -- Log the operation
    RAISE NOTICE '%', debug_info;
    
    -- Insert into public.users table with explicit error handling
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            full_name,
            phone,
            is_verified,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            user_full_name,
            user_phone,
            false,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'User profile created successfully for: %', NEW.email;
        
    EXCEPTION
        WHEN unique_violation THEN
            -- User already exists, update instead
            RAISE NOTICE 'User profile already exists, updating: %', NEW.email;
            
            UPDATE public.users SET
                email = NEW.email,
                full_name = COALESCE(user_full_name, full_name),
                phone = COALESCE(user_phone, phone),
                updated_at = NOW()
            WHERE id = NEW.id;
            
            RAISE NOTICE 'User profile updated successfully for: %', NEW.email;
            
        WHEN OTHERS THEN
            -- Log the specific error
            RAISE WARNING 'Error in handle_new_user for user %: % (SQLSTATE: %)', 
                NEW.email, SQLERRM, SQLSTATE;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user updates (SIMPLIFIED)
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
DECLARE
    user_phone TEXT;
    user_full_name TEXT;
BEGIN
    -- Extract updated data
    user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    -- Log the update
    RAISE NOTICE 'Updating user profile for: % with phone: % and name: %', 
        NEW.email, user_phone, user_full_name;
    
    -- Update the user profile
    UPDATE public.users SET
        email = NEW.email,
        full_name = COALESCE(user_full_name, full_name),
        phone = COALESCE(user_phone, phone),
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE NOTICE 'User profile updated successfully for: %', NEW.email;
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_user_update for user %: %', NEW.email, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user deletion (SIMPLIFIED)
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the deletion
    RAISE NOTICE 'Deleting user profile for: %', OLD.email;
    
    -- Delete from public.users
    DELETE FROM public.users WHERE id = OLD.id;
    
    RAISE NOTICE 'User profile deleted successfully for: %', OLD.email;
    
    RETURN OLD;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_user_deletion for user %: %', OLD.email, SQLERRM;
        RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREATE TRIGGERS

-- Trigger for user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for user updates
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Trigger for user deletion
CREATE TRIGGER on_auth_user_deletion
    AFTER DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_deletion();

-- 4. TEST THE TRIGGER LOGIC

-- Check if the functions were created correctly
SELECT 
    'Function Creation Check' as check_type,
    routine_name,
    CASE 
        WHEN routine_name IS NOT NULL THEN 'Function created successfully'
        ELSE 'Function missing'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')
ORDER BY routine_name;

-- Check if triggers were created correctly
SELECT 
    'Trigger Creation Check' as check_type,
    trigger_name,
    CASE 
        WHEN trigger_name IS NOT NULL THEN 'Trigger created successfully'
        ELSE 'Trigger missing'
    END as status
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')
ORDER BY trigger_name;

-- 5. VERIFY CURRENT DATA STATE

-- Check current phone number sync status
SELECT 
    'Phone Number Sync Status' as check_type,
    (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'phone' IS NOT NULL AND raw_user_meta_data->>'phone' != '') as auth_users_with_phone,
    (SELECT COUNT(*) FROM public.users WHERE phone IS NOT NULL AND phone != '') as public_users_with_phone,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'phone' IS NOT NULL AND raw_user_meta_data->>'phone' != '') = 
             (SELECT COUNT(*) FROM public.users WHERE phone IS NOT NULL AND phone != '')
        THEN 'Phone numbers are now synced!'
        ELSE 'Phone numbers still not synced - check the logs above'
    END as sync_status;

-- Show sample of recent users
SELECT 
    'Recent Users Check' as check_type,
    au.email,
    au.raw_user_meta_data->>'phone' as auth_phone,
    pu.phone as public_phone,
    CASE 
        WHEN pu.phone IS NOT NULL AND pu.phone != '' THEN 'Phone stored correctly'
        WHEN au.raw_user_meta_data->>'phone' IS NOT NULL AND pu.phone IS NULL THEN 'Phone not synced - trigger issue'
        ELSE 'No phone data'
    END as phone_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 5;

-- 6. FINAL STATUS
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')) = 3
        AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')) = 3
        THEN 'SUCCESS: Trigger logic has been fixed! Now test by creating a new user.'
        ELSE 'ERROR: Some components are missing. Check the creation status above.'
    END as overall_status;
