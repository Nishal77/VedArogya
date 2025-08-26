-- PHONE NUMBER STORAGE DEBUG SCRIPT
-- This will help identify exactly why phone numbers are not being stored
-- Run this in your Supabase SQL Editor

-- 1. CHECK CURRENT DATABASE STATE
SELECT '=== CURRENT DATABASE STATE ===' as status;

-- Check auth.users table structure
SELECT 
    'Auth Users Table' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users' 
ORDER BY ordinal_position;

-- Check public.users table structure
SELECT 
    'Public Users Table' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
ORDER BY ordinal_position;

-- 2. CHECK EXISTING DATA
SELECT '=== EXISTING DATA ANALYSIS ===' as status;

-- Check auth.users with phone metadata
SELECT 
    'Auth Users with Phone Metadata' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN raw_user_meta_data->>'phone' IS NOT NULL THEN 1 END) as users_with_phone_metadata,
    COUNT(CASE WHEN raw_user_meta_data->>'phone' != '' THEN 1 END) as users_with_non_empty_phone,
    COUNT(CASE WHEN raw_user_meta_data->>'full_name' IS NOT NULL THEN 1 END) as users_with_name_metadata
FROM auth.users;

-- Check public.users phone data
SELECT 
    'Public Users Phone Data' as check_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as users_with_phone,
    COUNT(CASE WHEN phone != '' THEN 1 END) as users_with_non_empty_phone,
    COUNT(CASE WHEN full_name IS NOT NULL THEN 1 END) as users_with_name
FROM public.users;

-- 3. COMPARE DATA BETWEEN TABLES
SELECT '=== DATA COMPARISON ===' as status;

-- Show detailed comparison
SELECT 
    'User Data Comparison' as check_type,
    au.id,
    au.email,
    au.raw_user_meta_data->>'phone' as auth_phone,
    au.raw_user_meta_data->>'full_name' as auth_name,
    pu.phone as public_phone,
    pu.full_name as public_name,
    CASE 
        WHEN au.raw_user_meta_data->>'phone' IS NOT NULL AND pu.phone IS NOT NULL 
        AND au.raw_user_meta_data->>'phone' = pu.phone THEN 'Phone synced'
        WHEN au.raw_user_meta_data->>'phone' IS NOT NULL AND pu.phone IS NULL THEN 'Phone not synced'
        WHEN au.raw_user_meta_data->>'phone' IS NULL THEN 'No phone in auth'
        ELSE 'Unknown state'
    END as phone_sync_status,
    CASE 
        WHEN au.raw_user_meta_data->>'full_name' IS NOT NULL AND pu.full_name IS NOT NULL 
        AND au.raw_user_meta_data->>'full_name' = pu.full_name THEN 'Name synced'
        WHEN au.raw_user_meta_data->>'full_name' IS NOT NULL AND pu.full_name IS NULL THEN 'Name not synced'
        WHEN au.raw_user_meta_data->>'full_name' IS NULL THEN 'No name in auth'
        ELSE 'Unknown state'
    END as name_sync_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;

-- 4. CHECK TRIGGERS AND FUNCTIONS
SELECT '=== TRIGGERS AND FUNCTIONS ===' as status;

-- Check if triggers exist
SELECT 
    'Database Triggers' as check_type,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    CASE 
        WHEN trigger_name IS NOT NULL THEN 'Trigger exists'
        ELSE 'Trigger missing'
    END as status
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')
ORDER BY trigger_name;

-- Check if functions exist
SELECT 
    'Database Functions' as check_type,
    routine_name,
    routine_type,
    routine_definition,
    CASE 
        WHEN routine_name IS NOT NULL THEN 'Function exists'
        ELSE 'Function missing'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')
ORDER BY routine_name;

-- 5. CHECK RECENT USER CREATIONS
SELECT '=== RECENT USER CREATIONS ===' as status;

-- Show recent users and their metadata
SELECT 
    'Recent Users' as check_type,
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data,
    au.raw_user_meta_data->>'phone' as extracted_phone,
    au.raw_user_meta_data->>'full_name' as extracted_name,
    pu.phone as stored_phone,
    pu.full_name as stored_name
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 5;

-- 6. CHECK FOR ERRORS IN LOGS
SELECT '=== ERROR CHECK ===' as status;

-- Check if there are any recent errors (this might not show much in read-only mode)
SELECT 
    'Recent Activity' as check_type,
    au.id,
    au.email,
    au.last_sign_in_at,
    au.updated_at,
    CASE 
        WHEN pu.id IS NULL THEN 'Missing in public.users'
        ELSE 'Present in public.users'
    END as profile_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = au.id
WHERE au.created_at > NOW() - INTERVAL '1 hour'
ORDER BY au.created_at DESC;

-- 7. SUMMARY AND RECOMMENDATIONS
SELECT '=== SUMMARY AND RECOMMENDATIONS ===' as status;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated', 'on_auth_user_deletion')) = 3
        AND (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name IN ('handle_new_user', 'handle_user_update', 'handle_user_deletion')) = 3
        THEN 'Database functions and triggers are properly set up'
        ELSE 'Database functions and triggers are missing or incomplete'
    END as database_setup_status;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'phone' IS NOT NULL) = 
             (SELECT COUNT(*) FROM public.users WHERE phone IS NOT NULL)
        THEN 'Phone numbers are properly synced between tables'
        ELSE 'Phone numbers are NOT synced between tables - this is the issue!'
    END as phone_sync_status;

-- 8. IMMEDIATE ACTION ITEMS
SELECT '=== IMMEDIATE ACTION ITEMS ===' as status;

SELECT 
    'Action Required' as action,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') = 0 
        THEN 'Run PHONE_NUMBER_FIX.sql to create missing triggers'
        WHEN (SELECT COUNT(*) FROM auth.users WHERE raw_user_meta_data->>'phone' IS NOT NULL) != 
             (SELECT COUNT(*) FROM public.users WHERE phone IS NOT NULL)
        THEN 'Phone numbers not syncing - check trigger function logic'
        ELSE 'All systems operational'
    END as recommendation;
