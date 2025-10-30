import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

# Check if promotions table exists and has data
with connection.cursor() as cursor:
    try:
        cursor.execute('''
            SELECT id, code, discount_percentage, start_date, end_date, is_active, created_at
            FROM promotions
            ORDER BY created_at DESC
        ''')
        
        rows = cursor.fetchall()
        
        if rows:
            print(f"✅ Found {len(rows)} promotions in database:\n")
            for row in rows:
                print(f"ID: {row[0]}")
                print(f"  Code: {row[1]}")
                print(f"  Discount: {row[2]}%")
                print(f"  Start: {row[3]}")
                print(f"  End: {row[4]}")
                print(f"  Active: {row[5]}")
                print(f"  Created: {row[6]}")
                print()
        else:
            print("⚠️ Promotions table exists but is EMPTY")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nPromotions table may not exist yet.")
