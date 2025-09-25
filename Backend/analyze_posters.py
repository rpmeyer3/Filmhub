#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def analyze_poster_urls():
    """Analyze poster URLs for The Actor and Grand Budapest Hotel"""
    with connection.cursor() as cursor:
        cursor.execute('SELECT id, "Title", "Poster_img_URL" FROM "Movies" WHERE id IN (7, 9);')
        movies = cursor.fetchall()
        
        print('POSTER URL ANALYSIS:')
        for movie_id, title, poster_url in movies:
            print(f'\nID {movie_id}: {title}')
            print(f'Poster URL: {poster_url}')
            
            # Analyze the URL to determine what it should be
            if '61DCEg5XJ1L' in poster_url:
                print('  → This appears to be "The Actor" poster (based on URL pattern)')
            elif '713kiC-8JhL' in poster_url:
                print('  → This appears to be "The Creator" or similar movie poster')
            elif 'budapest' in poster_url.lower():
                print('  → This appears to be "Grand Budapest Hotel" poster (based on URL)')
            else:
                print('  → Cannot determine movie from URL pattern')
                
        # Let's also check what The Creator has
        cursor.execute('SELECT id, "Title", "Poster_img_URL" FROM "Movies" WHERE "Title" = \'The Creator\';')
        creator = cursor.fetchone()
        if creator:
            movie_id, title, poster_url = creator
            print(f'\nFor comparison - ID {movie_id}: {title}')
            print(f'Poster URL: {poster_url}')

if __name__ == "__main__":
    analyze_poster_urls()