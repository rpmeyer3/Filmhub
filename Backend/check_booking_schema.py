import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Check bookings table
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' 
        ORDER BY ordinal_position
    """)
    print("BOOKINGS TABLE:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]}")
    
    print("\nBOOKING_SEATS TABLE:")
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'booking_seats' 
        ORDER BY ordinal_position
    """)
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]}")
