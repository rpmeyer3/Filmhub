-- SQL Script to create payment_cards table in Supabase
-- Run this in your Supabase SQL editor
-- This links directly to the profiles table via user_id

-- Drop and recreate if needed (commented out for safety)
-- DROP TABLE IF EXISTS payment_cards CASCADE;

-- Create payment_cards table
CREATE TABLE IF NOT EXISTS payment_cards (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cardholder_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(16) NOT NULL,
    expiration_date DATE NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups (only if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_cards_user_id'
    ) THEN
        CREATE INDEX idx_payment_cards_user_id ON payment_cards(user_id);
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE payment_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own payment cards" ON payment_cards;
DROP POLICY IF EXISTS "Users can insert own payment cards" ON payment_cards;
DROP POLICY IF EXISTS "Users can update own payment cards" ON payment_cards;
DROP POLICY IF EXISTS "Users can delete own payment cards" ON payment_cards;

-- Create policy: Users can only see their own payment cards
CREATE POLICY "Users can view own payment cards" ON payment_cards
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy: Users can insert their own payment cards
CREATE POLICY "Users can insert own payment cards" ON payment_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own payment cards
CREATE POLICY "Users can update own payment cards" ON payment_cards
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy: Users can delete their own payment cards
CREATE POLICY "Users can delete own payment cards" ON payment_cards
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON payment_cards TO authenticated;

-- Grant sequence permissions (only if sequence exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_class WHERE relname = 'payment_cards_id_seq'
    ) THEN
        GRANT USAGE, SELECT ON SEQUENCE payment_cards_id_seq TO authenticated;
    END IF;
END $$;

COMMENT ON TABLE payment_cards IS 'Stores user payment card information, linked to Supabase profiles';

-- Verify the table was created
SELECT 'payment_cards table created successfully!' as status;