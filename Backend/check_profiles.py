import os
from dotenv import load_dotenv
import psycopg2

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

# Check profiles table structure
print("=== Profiles Table Structure ===")
cursor.execute("""
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    ORDER BY ordinal_position;
""")
for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]} (nullable: {row[2]})")

print("\n=== Profiles Data ===")
cursor.execute("""
    SELECT p.id, p.email, p.first_name, p.last_name, p.receive_promotions, au.email as auth_email
    FROM profiles p
    LEFT JOIN auth.users au ON p.id = au.id
    ORDER BY p.created_at DESC
    LIMIT 10;
""")
print("ID | Email (profile) | First Name | Last Name | Receive Promotions | Email (auth)")
for row in cursor.fetchall():
    print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]} | {row[5]}")

cursor.close()
conn.close()
