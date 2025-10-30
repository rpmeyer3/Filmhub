-- Create promotions table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes
CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_active ON promotions(is_active);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);

-- Insert some sample promotions for testing
INSERT INTO promotions (code, discount_percentage, start_date, end_date, is_active)
VALUES
    ('WELCOME10', 10.00, '2025-01-01', '2025-12-31', true),
    ('SUMMER25', 25.00, '2025-06-01', '2025-08-31', true),
    ('EARLYBIRD', 15.00, '2025-01-01', '2025-03-31', true);

-- Verify the table was created
SELECT * FROM promotions ORDER BY created_at DESC;
