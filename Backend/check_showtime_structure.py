"""
Check showtime_table structure
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def check_showtime_structure():
    with connection.cursor() as cursor:
        # Check showtime_table
        print("Checking showtime_table structure...")
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'showtime_table'
            ORDER BY ordinal_position;
        """)
        
        columns = cursor.fetchall()
        print("\nShowtime_table columns:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]}")
        
        # Check a sample showtime
        cursor.execute("""
            SELECT id, showroom_id, movie_id, showtime
            FROM showtime_table
            LIMIT 1
        """)
        
        sample = cursor.fetchone()
        if sample:
            print(f"\nSample showtime:")
            print(f"  - id: {sample[0]} (type: {type(sample[0])})")
            print(f"  - showroom_id: {sample[1]} (type: {type(sample[1])})")
            print(f"  - movie_id: {sample[2]} (type: {type(sample[2])})")

if __name__ == '__main__':
    check_showtime_structure()
