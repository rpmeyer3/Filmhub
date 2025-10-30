-- Create seats table for showroom seat inventory
-- Seats are linked to specific showtimes and track availability
CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    showtime_id INTEGER NOT NULL REFERENCES showtime_table(id) ON DELETE CASCADE,
    row_number INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    seat_label VARCHAR(10) NOT NULL,  -- e.g., 'A1', 'B5'
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(showtime_id, row_number, seat_number)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,  -- References Supabase profiles
    showtime_id INTEGER NOT NULL REFERENCES showtime_table(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL REFERENCES "Movies"(id) ON DELETE CASCADE,
    promotion_code VARCHAR(50),  -- Optional promo code used
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW(),
    payment_card_id INTEGER REFERENCES payment_cards(id) ON DELETE SET NULL
);

-- Create booking_seats junction table (many-to-many)
CREATE TABLE IF NOT EXISTS booking_seats (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id INTEGER NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    ticket_type VARCHAR(20) NOT NULL,  -- 'adult', 'child', 'senior'
    price DECIMAL(10, 2) NOT NULL,
    UNIQUE(booking_id, seat_id)
);

-- Create index for faster seat availability queries
CREATE INDEX IF NOT EXISTS idx_seats_showtime ON seats(showtime_id);
CREATE INDEX IF NOT EXISTS idx_seats_availability ON seats(showtime_id, is_available);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_seats_booking ON booking_seats(booking_id);
