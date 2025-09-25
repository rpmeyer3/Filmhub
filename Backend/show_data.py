#!/usr/bin/env python3
"""
Comprehensive database content analyzer for the Cinema E-Booking System.
This script displays detailed information about all data in the Supabase database.
"""

import os
import sys
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection
from movies.models import Movie, UserFavorite, MovieReview

def show_table_data(table_name, limit=None):
    """Display data from a specific table with optional limit."""
    try:
        with connection.cursor() as cursor:
            if limit:
                cursor.execute(f"SELECT * FROM {table_name} LIMIT {limit};")
            else:
                cursor.execute(f"SELECT * FROM {table_name};")
            
            rows = cursor.fetchall()
            if rows:
                # Get column names
                cursor.execute(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = '{table_name}' 
                    ORDER BY ordinal_position;
                """)
                columns = [col[0] for col in cursor.fetchall()]
                
                print(f"\n {table_name.upper()} ({len(rows)} records):")
                print("=" * 60)
                
                for row in rows:
                    for i, value in enumerate(row):
                        if i < len(columns):
                            print(f"  {columns[i]}: {value}")
                    print("-" * 40)
            else:
                print(f"\n{table_name.upper()}: No data found")
                
    except Exception as e:
        print(f" Error reading {table_name}: {e}")

def show_django_models_data():
    """Display data using Django ORM models."""
    print("\n DJANGO MODELS DATA")
    print("=" * 60)
    
    # Movies
    movies = Movie.objects.all()
    print(f"\n Movies (Django ORM): {movies.count()} records")
    for movie in movies:
        print(f"  - {movie.title} ({movie.release_date}) - Rating: {movie.rating}")
    
    # User Favorites
    favorites = UserFavorite.objects.all()
    print(f"\n User Favorites: {favorites.count()} records")
    for fav in favorites:
        print(f"  - User {fav.user.username}: {fav.movie.title}")
    
    # Movie Reviews
    reviews = MovieReview.objects.all()
    print(f"\n Movie Reviews: {reviews.count()} records")
    for review in reviews:
        print(f"  - {review.movie.title}: {review.rating}/5 by {review.user.username}")

def analyze_database():
    """Comprehensive database analysis."""
    print(" CINEMA E-BOOKING SYSTEM - DATABASE ANALYSIS")
    print("=" * 80)
    
    try:
        with connection.cursor() as cursor:
            # Database info
            cursor.execute("SELECT current_database(), current_user;")
            db_info = cursor.fetchone()
            print(f"Database: {db_info[0]}")
            print(f"User: {db_info[1]}")
            
            # Get all tables with record counts
            cursor.execute("""
                SELECT 
                    schemaname,
                    tablename,
                    (SELECT COUNT(*) FROM pg_class WHERE relname = tablename) as table_exists
                FROM pg_tables 
                WHERE schemaname = 'public' 
                ORDER BY tablename;
            """)
            tables = cursor.fetchall()
            
            print(f"\nSUMMARY: {len(tables)} tables found")
            
            # Show movie-related data first
            movie_tables = ['Movies', 'Cast', 'Category', 'movies_movie']
            for table_info in tables:
                table_name = table_info[1]
                if table_name in movie_tables or 'movie' in table_name.lower():
                    show_table_data(table_name, limit=10)
            
            # Show user-related data
            user_tables = ['auth_user', 'auth_group', 'movies_userfavorite', 'movies_moviereview']
            for table_info in tables:
                table_name = table_info[1]
                if table_name in user_tables:
                    show_table_data(table_name, limit=5)
            
            # Django system tables summary
            django_tables = [t[1] for t in tables if t[1].startswith('django_')]
            if django_tables:
                print(f"\nDJANGO SYSTEM TABLES ({len(django_tables)}):")
                for table_name in django_tables:
                    cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                    count = cursor.fetchone()[0]
                    print(f"  - {table_name}: {count} records")
                    
    except Exception as e:
        print(f"Analysis failed: {e}")
    
    # Show Django ORM data
    show_django_models_data()

if __name__ == "__main__":
    analyze_database()