#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def check_swapped_movies():
    """Check The Actor and Grand Budapest Hotel data"""
    with connection.cursor() as cursor:
        # Get specific movies
        cursor.execute('''
            SELECT 
                id,
                "Title",
                "Synopsis",
                "Poster_img_URL",
                "isRunning",
                "isComingSoon",
                "MPAA_US_Film_Rating"
            FROM "Movies" 
            WHERE "Title" IN ('The Actor', 'The Grand Budapest Hotel')
            ORDER BY id;
        ''')
        
        movies = cursor.fetchall()
        
        print("=== CHECKING SWAPPED MOVIE DATA ===\n")
        
        for movie in movies:
            movie_id, title, synopsis, poster_url, is_running, is_coming_soon, mpaa = movie
            
            print(f"Movie ID: {movie_id}")
            print(f"Title: {title}")
            print(f"Synopsis (first 100 chars): {synopsis[:100]}...")
            print(f"Poster URL: {poster_url}")
            print(f"Is Running: {is_running}")
            print(f"Is Coming Soon: {is_coming_soon}")
            print(f"MPAA Rating: {mpaa}")
            
            # Check if poster URL matches the title
            if title == "The Actor" and "budapest" in poster_url.lower():
                print("❌ ISSUE FOUND: The Actor has Grand Budapest Hotel poster!")
            elif title == "The Grand Budapest Hotel" and "actor" in poster_url.lower():
                print("❌ ISSUE FOUND: Grand Budapest Hotel has The Actor poster!")
            elif title == "The Actor" and "713kiC-8JhL" in poster_url:
                print("❌ ISSUE FOUND: The Actor has wrong poster URL!")
            elif title == "The Grand Budapest Hotel" and "61DCEg5XJ1L" in poster_url:
                print("❌ ISSUE FOUND: Grand Budapest Hotel has wrong poster URL!")
            else:
                print("✅ Poster appears correct")
                
            print("-" * 80)

if __name__ == "__main__":
    check_swapped_movies()