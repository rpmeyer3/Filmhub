"""
Check what tables and columns exist
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def check_tables():
    with connection.cursor() as cursor:
        # Check seats table structure
        print("Checking seats table...")
        try:
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'seats'
                ORDER BY ordinal_position;
            """)
            columns = cursor.fetchall()
            if columns:
                print("✓ Seats table columns:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
            else:
                print("❌ Seats table not found")
        except Exception as e:
            print(f"Error checking seats: {e}")
        
        # Check bookings table
        print("\nChecking bookings table...")
        try:
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'bookings'
                ORDER BY ordinal_position;
            """)
            columns = cursor.fetchall()
            if columns:
                print("✓ Bookings table columns:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
            else:
                print("❌ Bookings table not found")
        except Exception as e:
            print(f"Error checking bookings: {e}")
        
        # Check booking_seats table
        print("\nChecking booking_seats table...")
        try:
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'booking_seats'
                ORDER BY ordinal_position;
            """)
            columns = cursor.fetchall()
            if columns:
                print("✓ Booking_seats table columns:")
                for col in columns:
                    print(f"  - {col[0]}: {col[1]}")
            else:
                print("❌ Booking_seats table not found")
        except Exception as e:
            print(f"Error checking booking_seats: {e}")

if __name__ == '__main__':
    check_tables()
