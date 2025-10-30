import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # List all tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
    """)
    print("All public tables:")
    for row in cursor.fetchall():
        print(f"  {row[0]}")
