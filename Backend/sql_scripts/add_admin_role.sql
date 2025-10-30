-- SQL Script to add admin role functionality to profiles table
-- Run this in your Supabase SQL Editor

-- Add is_admin column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create an index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_user_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set yourself as an admin (replace with your actual user ID)
-- You can find your user ID in Authentication > Users in Supabase dashboard
-- UPDATE profiles SET is_admin = TRUE WHERE id = 'YOUR-USER-ID-HERE';

-- Example: To make the first user an admin automatically
-- UPDATE profiles SET is_admin = TRUE WHERE id = (SELECT id FROM profiles LIMIT 1);

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'is_admin';
