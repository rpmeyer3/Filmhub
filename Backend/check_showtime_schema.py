import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Check showtime_table
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'showtime_table'
        ORDER BY ordinal_position
    """)
    print("SHOWTIME_TABLE:")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]}")
