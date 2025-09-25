#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def check_movie_status():
    """Check for duplicate movies and categorization issues"""
    with connection.cursor() as cursor:
        # Check for any duplicate titles
        cursor.execute('SELECT "Title", COUNT(*) FROM "Movies" GROUP BY "Title" HAVING COUNT(*) > 1;')
        duplicates = cursor.fetchall()
        
        if duplicates:
            print('❌ DUPLICATE MOVIES FOUND:')
            for title, count in duplicates:
                print(f'  {title}: {count} entries')
        else:
            print('✅ No duplicate movie titles found')
        
        print()
        
        # Check the categories for movies with similar titles
        cursor.execute('SELECT id, "Title", "isRunning", "isComingSoon" FROM "Movies" WHERE "Title" LIKE \'%Actor%\' OR "Title" LIKE \'%Budapest%\' OR "Title" LIKE \'%Grand%\';')
        similar_movies = cursor.fetchall()
        
        print('Movies with Actor/Budapest/Grand in title:')
        for movie in similar_movies:
            movie_id, title, is_running, is_coming_soon = movie
            status = []
            if is_running: 
                status.append('RUNNING')
            if is_coming_soon: 
                status.append('COMING SOON')
            if not status: 
                status = ['NEITHER']
            print(f'  ID {movie_id}: "{title}" - {" and ".join(status)}')
        
        print()
        
        # Show all movies and their status
        cursor.execute('SELECT id, "Title", "isRunning", "isComingSoon" FROM "Movies" ORDER BY id;')
        all_movies = cursor.fetchall()
        
        print('ALL MOVIES STATUS:')
        for movie in all_movies:
            movie_id, title, is_running, is_coming_soon = movie
            status = []
            if is_running: 
                status.append('RUNNING')
            if is_coming_soon: 
                status.append('COMING SOON')
            if not status: 
                status = ['NEITHER']
            print(f'  ID {movie_id}: "{title}" - {" and ".join(status)}')

if __name__ == "__main__":
    check_movie_status()