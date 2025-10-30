"""
Script to create seats and bookings tables in Supabase
Run this script to set up the database for seat selection functionality
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def create_tables():
    with connection.cursor() as cursor:
        print("Creating seats and bookings tables...")
        
        # Create seats table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS seats (
                id SERIAL PRIMARY KEY,
                showtime_id INTEGER NOT NULL REFERENCES showtime_table(id) ON DELETE CASCADE,
                row_number INTEGER NOT NULL,
                seat_number INTEGER NOT NULL,
                seat_label VARCHAR(10) NOT NULL,
                is_available BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(showtime_id, row_number, seat_number)
            );
        """)
        print("✓ Created seats table")
        
        # Create bookings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL,
                showtime_id INTEGER NOT NULL REFERENCES showtime_table(id) ON DELETE CASCADE,
                movie_id INTEGER NOT NULL REFERENCES "Movies"(id) ON DELETE CASCADE,
                promotion_code VARCHAR(50),
                discount_amount DECIMAL(10, 2) DEFAULT 0.00,
                subtotal DECIMAL(10, 2) NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                booking_date TIMESTAMP DEFAULT NOW(),
                payment_card_id INTEGER REFERENCES payment_cards(id) ON DELETE SET NULL
            );
        """)
        print("✓ Created bookings table")
        
        # Create booking_seats junction table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS booking_seats (
                id SERIAL PRIMARY KEY,
                booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
                seat_id INTEGER NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
                ticket_type VARCHAR(20) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                UNIQUE(booking_id, seat_id)
            );
        """)
        print("✓ Created booking_seats table")
        
        # Create indexes
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_seats_showtime ON seats(showtime_id);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_seats_availability ON seats(showtime_id, is_available);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
        """)
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_booking_seats_booking ON booking_seats(booking_id);
        """)
        print("✓ Created indexes")
        
        print("\n✅ All tables created successfully!")
        
        # Check if tables exist
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name IN ('seats', 'bookings', 'booking_seats')
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print(f"\nVerified tables in database: {[t[0] for t in tables]}")

if __name__ == '__main__':
    try:
        create_tables()
    except Exception as e:
        print(f"\n❌ Error creating tables: {str(e)}")
        import traceback
        traceback.print_exc()
