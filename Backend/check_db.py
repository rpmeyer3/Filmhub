#!/usr/bin/env python3
"""
Database connection checker for Supabase integration.
This script verifies the Django-Supabase connection and lists available tables.
"""

import os
import sys
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def check_database_connection():
    """Check if the database connection is working and list tables."""
    try:
        with connection.cursor() as cursor:
            # Test basic connection
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"SUCCESS: Database connection successful!")
            print(f"PostgreSQL version: {version[0]}")
            
            # List all tables
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """)
            tables = cursor.fetchall()
            
            print(f"\nFound {len(tables)} tables in database:")
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
                count = cursor.fetchone()[0]
                print(f"  - {table[0]}: {count} records")
                
    except Exception as e:
        print(f"ERROR: Database connection failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("Checking Supabase database connection...")
    success = check_database_connection()
    sys.exit(0 if success else 1)