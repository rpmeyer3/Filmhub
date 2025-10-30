import os
from dotenv import load_dotenv
import psycopg2
import json

# Load environment variables
load_dotenv()

# Database connection parameters
conn = psycopg2.connect(
    dbname=os.getenv('DATABASE_NAME'),
    user=os.getenv('DATABASE_USER'),
    password=os.getenv('DATABASE_PASSWORD'),
    host=os.getenv('DATABASE_HOST'),
    port=os.getenv('DATABASE_PORT')
)

cursor = conn.cursor()

print("=== Auth Users Metadata ===")
cursor.execute("""
    SELECT id, email, raw_user_meta_data
    FROM auth.users
    ORDER BY created_at DESC
    LIMIT 5;
""")
for row in cursor.fetchall():
    print(f"\nID: {row[0]}")
    print(f"Email: {row[1]}")
    print(f"Metadata: {json.dumps(row[2], indent=2)}")

cursor.close()
conn.close()
