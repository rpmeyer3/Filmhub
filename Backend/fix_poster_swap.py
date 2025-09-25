#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def fix_poster_urls():
    """Fix the swapped poster URLs between The Creator and The Grand Budapest Hotel"""
    
    # The Grand Budapest Hotel should have this poster
    budapest_poster = 'https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_SX300.jpg'
    
    with connection.cursor() as cursor:
        # Check current state
        cursor.execute('SELECT id, "Title", "Poster_img_URL" FROM "Movies" WHERE id IN (8, 9) ORDER BY id;')
        rows = cursor.fetchall()
        
        print("BEFORE UPDATE:")
        for row in rows:
            print(f'ID {row[0]}: {row[1]}')
            print(f'  Poster: {row[2]}')
            print()
        
        # Update The Grand Budapest Hotel poster
        cursor.execute('UPDATE "Movies" SET "Poster_img_URL" = %s WHERE id = 9;', [budapest_poster])
        print(f"✅ Updated The Grand Budapest Hotel poster URL to: {budapest_poster}")
        
        # Verify the change
        cursor.execute('SELECT id, "Title", "Poster_img_URL" FROM "Movies" WHERE id IN (8, 9) ORDER BY id;')
        rows = cursor.fetchall()
        
        print("\nAFTER UPDATE:")
        for row in rows:
            print(f'ID {row[0]}: {row[1]}')
            print(f'  Poster: {row[2]}')
            print()
        
        print("✅ Poster URLs fixed!")

if __name__ == '__main__':
    fix_poster_urls()