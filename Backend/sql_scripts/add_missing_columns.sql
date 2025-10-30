-- SQL Script to fix payment_cards table structure
-- Run this in your Supabase SQL editor

-- First, let's see what columns currently exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payment_cards'
ORDER BY ordinal_position;

-- Drop the table and recreate it with correct structure
DROP TABLE IF EXISTS payment_cards CASCADE;

-- Create payment_cards table with all required columns
CREATE TABLE payment_cards (
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

-- Create index on user_id for faster lookups
CREATE INDEX idx_payment_cards_user_id ON payment_cards(user_id);

-- Enable Row Level Security
ALTER TABLE payment_cards ENABLE ROW LEVEL SECURITY;

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
GRANT USAGE, SELECT ON SEQUENCE payment_cards_id_seq TO authenticated;

COMMENT ON TABLE payment_cards IS 'Stores user payment card information, linked to Supabase profiles';

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'payment_cards'
ORDER BY ordinal_position;
