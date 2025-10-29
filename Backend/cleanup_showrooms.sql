-- Clean up duplicate showrooms and fix the data
-- Run this in your Supabase SQL Editor

-- First, let's see what columns exist in the showrooms table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'showrooms'
ORDER BY ordinal_position;

-- See what we currently have
SELECT * FROM showrooms ORDER BY name, capacity;

-- Delete all showrooms first (to start fresh)
TRUNCATE TABLE showrooms RESTART IDENTITY CASCADE;

-- Get a theater_id if the table requires it (check if theaters table exists)
-- If theater_id is required, we need to either:
-- 1. Make it nullable: ALTER TABLE showrooms ALTER COLUMN theater_id DROP NOT NULL;
-- 2. Or provide a theater_id from an existing theater

-- Option 1: Make theater_id nullable (recommended)
ALTER TABLE showrooms ALTER COLUMN theater_id DROP NOT NULL;

-- Now create 3 clean showrooms
INSERT INTO showrooms (name, capacity, rows, seats_per_row)
VALUES
    ('Theater 1 - Standard', 120, 10, 12),
    ('Theater 2 - Premium', 150, 15, 10),
    ('Theater 3 - Intimate', 80, 8, 10);

-- Verify the result
SELECT id, name, capacity, rows, seats_per_row, theater_id
FROM showrooms 
ORDER BY name;
