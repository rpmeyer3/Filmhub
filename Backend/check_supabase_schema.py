#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

def get_all_tables():
    """Get all tables in the database"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name, table_schema
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        
        print("Available tables:")
        for table in tables:
            print(f"  - {table[0]} (schema: {table[1]})")
        
        return [table[0] for table in tables]

def describe_table(table_name):
    """Get column information for a specific table"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default,
                character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = %s AND table_schema = 'public'
            ORDER BY ordinal_position;
        """, [table_name])
        
        columns = cursor.fetchall()
        
        print(f"\nTable: {table_name}")
        print("Columns:")
        for col in columns:
            nullable = "NULL" if col[2] == "YES" else "NOT NULL"
            default = f" DEFAULT {col[3]}" if col[3] else ""
            length = f"({col[4]})" if col[4] else ""
            print(f"  - {col[0]}: {col[1]}{length} {nullable}{default}")
        
        return columns

def get_foreign_keys():
    """Get foreign key relationships"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_schema = 'public';
        """)
        
        fks = cursor.fetchall()
        
        print("\nForeign Key Relationships:")
        for fk in fks:
            print(f"  {fk[0]}.{fk[1]} -> {fk[2]}.{fk[3]}")
        
        return fks

def sample_data(table_name, limit=5):
    """Get sample data from a table"""
    try:
        with connection.cursor() as cursor:
            cursor.execute(f'SELECT * FROM "{table_name}" LIMIT %s;', [limit])
            rows = cursor.fetchall()
            
            # Get column names
            cursor.execute("""
                SELECT column_name
                FROM information_schema.columns 
                WHERE table_name = %s AND table_schema = 'public'
                ORDER BY ordinal_position;
            """, [table_name])
            columns = [col[0] for col in cursor.fetchall()]
            
            print(f"\nSample data from {table_name} (first {limit} rows):")
            if rows:
                for row in rows:
                    row_dict = dict(zip(columns, row))
                    print(f"  {row_dict}")
            else:
                print(f"  No data in {table_name}")
                
            return rows, columns
    except Exception as e:
        print(f"Error querying {table_name}: {e}")
        return [], []

if __name__ == "__main__":
    print("=== SUPABASE DATABASE SCHEMA ANALYSIS ===\n")
    
    # Get all tables
    tables = get_all_tables()
    
    print("\n" + "="*60)
    
    # Describe each table
    for table in tables:
        describe_table(table)
    
    print("\n" + "="*60)
    
    # Get foreign key relationships
    get_foreign_keys()
    
    print("\n" + "="*60)
    
    # Sample data from each table
    for table in tables:
        sample_data(table, 3)
        print()