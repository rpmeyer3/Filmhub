import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Check if showtimes table exists
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'showtimes'
        ORDER BY ordinal_position
    """)
    rows = cursor.fetchall()
    if rows:
        print("SHOWTIMES TABLE (UUID-based):")
        for row in rows:
            print(f"  {row[0]}: {row[1]}")
    else:
        print("No 'showtimes' table found")
        
    print("\nCHECKING FOREIGN KEY CONSTRAINTS ON BOOKINGS:")
    cursor.execute("""
        SELECT
            tc.constraint_name, 
            tc.table_name, 
            kcu.column_name, 
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name 
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='bookings'
    """)
    print("\nForeign keys:")
    for row in cursor.fetchall():
        print(f"  {row[1]}.{row[2]} -> {row[3]}.{row[4]} (constraint: {row[0]})")
