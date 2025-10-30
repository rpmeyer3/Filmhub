import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'movie_project.settings')
django.setup()

from django.db import connection

# Read the SQL file
with open('create_promotions.sql', 'r') as f:
    sql = f.read()

# Execute the SQL
with connection.cursor() as cursor:
    cursor.execute(sql)
    
print("✅ Promotions table created successfully!")
