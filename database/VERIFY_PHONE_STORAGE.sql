-- VERIFY PHONE NUMBER STORAGE
-- Run this to check if phone numbers are being stored

-- Check current database state
SELECT 'CURRENT DATABASE STATE' as status;

-- 1. Check if the phone column exists in public.users
SELECT 
    'Phone Column Check' as check_type,
    column_name,
    data_type,
    is_nullable,
    CASE 
        WHEN column_name = 'phone' THEN 'Phone column exists'
        ELSE 'Phone column missing'
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name = 'phone';

-- 2. Check current user data in auth.users
SELECT 
    'Auth Users Phone Data' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN raw_user_meta_data->>'phone' IS NOT NULL THEN 1 END) as users_with_phone_metadata,
    COUNT(CASE WHEN raw_user_meta_data->>'phone' != '' THEN 1 END) as users_with_non_empty_phone
FROM auth.users;

-- 3. Check current user data in public.users
SELECT 
    'Public Users Phone Data' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as users_with_phone,
    COUNT(CASE WHEN phone != '' THEN 1 END) as users_with_non_empty_phone
FROM public.users;

-- 4. Show sample user data comparison
SELECT 
    'User Data Comparison' as check_type,
    au.email,
    au.raw_user_meta_data->>'phone' as auth_phone,
    pu.phone as public_phone,
    CASE 
        WHEN au.raw_user_meta_data->>'phone' IS NOT NULL AND pu.phone IS NOT NULL 
        AND au.raw_user_meta_data->>'phone' = pu.phone THEN 'Phone synced'
        WHEN au.raw_user_meta_data->>'phone' IS NOT NULL AND pu.phone IS NULL THEN 'Phone not synced'
        WHEN au.raw_user_meta_data->>'phone' IS NULL THEN 'No phone in auth'
        ELSE 'Unknown state'
    END as sync_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.raw_user_meta_data->>'phone' IS NOT NULL
LIMIT 10;

-- 5. Check if triggers are working
SELECT 
    'Trigger Check' as check_type,
    trigger_name,
    event_manipulation,
    action_timing,
    CASE 
        WHEN trigger_name IS NOT NULL THEN 'Trigger exists'
        ELSE 'Trigger missing'
    END as status
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')
ORDER BY trigger_name;

-- 6. Check if functions exist
SELECT 
    'Function Check' as check_type,
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name IS NOT NULL THEN 'Function exists'
        ELSE 'Function missing'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')
ORDER BY routine_name;

-- 7. Test the handle_new_user function manually
SELECT 'MANUAL FUNCTION TEST' as status;

-- This will test if the function can be called (won't actually insert data)
SELECT 
    'Function Test' as test_name,
    CASE 
        WHEN public.handle_new_user() IS NOT NULL THEN 'Function is callable'
        ELSE 'Function failed'
    END as status;

-- 8. Summary
SELECT 'SUMMARY' as status;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone') > 0
        AND (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')) = 3
        AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')) = 3
        AND (SELECT COUNT(*) FROM public.users WHERE phone IS NOT NULL AND phone != '') = (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'phone' IS NOT NULL AND raw_user_meta_data->>'phone' != '')
        THEN 'SUCCESS: Phone number storage is working correctly!'
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone') = 0
        THEN 'ERROR: Phone column does not exist in public.users table'
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')) < 3
        THEN 'ERROR: Database triggers are missing. Run PHONE_NUMBER_FIX.sql first.'
        WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')) < 3
        THEN 'ERROR: Database functions are missing. Run PHONE_NUMBER_FIX.sql first.'
        WHEN (SELECT COUNT(*) FROM public.users WHERE phone IS NOT NULL AND phone != '') != (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'phone' IS NOT NULL AND raw_user_meta_data->>'phone' != '')
        THEN 'WARNING: Phone numbers are not synced between tables. Check function logic.'
        ELSE 'ERROR: Multiple issues detected. Review all checks above.'
    END as overall_status;
