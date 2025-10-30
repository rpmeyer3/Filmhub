-- Create showtime_table (MovieShow) in Supabase
-- Run this in your Supabase SQL Editor

-- Drop and recreate the table to ensure correct structure
DROP TABLE IF EXISTS showtime_table CASCADE;

CREATE TABLE showtime_table (
    id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL,
    showroom_id UUID NOT NULL,
    showtime TIMESTAMP NOT NULL,
    price DECIMAL(6, 2) DEFAULT 10.00,
    is_now_showing BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_movie FOREIGN KEY (movie_id) REFERENCES "Movies"(id) ON DELETE CASCADE,
    CONSTRAINT fk_showroom FOREIGN KEY (showroom_id) REFERENCES showrooms(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_showtime_movie ON showtime_table(movie_id);
CREATE INDEX idx_showtime_showroom ON showtime_table(showroom_id);
CREATE INDEX idx_showtime_date ON showtime_table(showtime);
CREATE INDEX idx_showtime_now_showing ON showtime_table(is_now_showing);

-- Verify the table was created
SELECT * FROM showtime_table LIMIT 10;
