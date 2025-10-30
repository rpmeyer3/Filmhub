"""
Create seats for all showrooms
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection
import uuid

def create_seats_for_showrooms():
    with connection.cursor() as cursor:
        # Get all showrooms
        cursor.execute("""
            SELECT id, name, rows, seats_per_row
            FROM showrooms
        """)
        
        showrooms = cursor.fetchall()
        
        if not showrooms:
            print("No showrooms found!")
            return
        
        print(f"Found {len(showrooms)} showroom(s)")
        
        for showroom_id, name, rows, seats_per_row in showrooms:
            print(f"\nProcessing showroom: {name}")
            print(f"  Layout: {rows} rows x {seats_per_row} seats = {rows * seats_per_row} total seats")
            
            # Check if seats already exist
            cursor.execute("""
                SELECT COUNT(*) FROM seats WHERE showroom_id = %s
            """, [showroom_id])
            
            existing_count = cursor.fetchone()[0]
            
            if existing_count > 0:
                print(f"  ✓ Already has {existing_count} seats")
                continue
            
            # Create seats
            seats_to_insert = []
            for row_num in range(1, rows + 1):
                row_letter = chr(64 + row_num)  # A, B, C, etc.
                for seat_num in range(1, seats_per_row + 1):
                    seat_id = str(uuid.uuid4())
                    seats_to_insert.append((
                        seat_id,
                        showroom_id,
                        row_letter,
                        seat_num,
                        'standard'  # seat_type
                    ))
            
            # Insert seats
            cursor.executemany("""
                INSERT INTO seats (id, showroom_id, seat_row, seat_number, seat_type)
                VALUES (%s, %s, %s, %s, %s)
            """, seats_to_insert)
            
            print(f"  ✓ Created {len(seats_to_insert)} seats")
        
        print("\n✅ All showrooms now have seats!")

if __name__ == '__main__':
    try:
        create_seats_for_showrooms()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
