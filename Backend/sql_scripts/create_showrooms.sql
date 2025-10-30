-- Update showrooms table in Supabase to add new columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to existing showrooms table
ALTER TABLE showrooms 
ADD COLUMN IF NOT EXISTS name VARCHAR(100) DEFAULT 'Showroom 1',
ADD COLUMN IF NOT EXISTS rows INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS seats_per_row INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Set default values for all existing showrooms
UPDATE showrooms 
SET 
    name = COALESCE(name, 'Showroom'),
    rows = COALESCE(rows, 10),
    seats_per_row = COALESCE(seats_per_row, 12);

-- Update capacity to match rows * seats_per_row
UPDATE showrooms SET capacity = rows * seats_per_row;

-- Update names to be unique if they're all 'Showroom'
WITH numbered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY capacity) as row_num
    FROM showrooms
)
UPDATE showrooms s
SET name = 'Showroom ' || n.row_num
FROM numbered n
WHERE s.id = n.id AND s.name = 'Showroom';

-- Optionally, set specific names for the first 3 showrooms
-- First, let's see what we have:
-- SELECT id, name, capacity, rows, seats_per_row FROM showrooms ORDER BY capacity LIMIT 3;

-- Then manually update if needed (replace <uuid-here> with actual UUIDs from above query):
-- UPDATE showrooms SET name = 'Showroom 1', rows = 10, seats_per_row = 12 WHERE id = '<uuid-1>';
-- UPDATE showrooms SET name = 'Showroom 2', rows = 15, seats_per_row = 10 WHERE id = '<uuid-2>';
-- UPDATE showrooms SET name = 'Showroom 3', rows = 8, seats_per_row = 10 WHERE id = '<uuid-3>';

-- If you need to add more showrooms (optional)
-- INSERT INTO showrooms (name, capacity, rows, seats_per_row) VALUES
--     ('Showroom 4', 100, 10, 10);

-- Verify the showrooms were updated
SELECT * FROM showrooms ORDER BY id;
