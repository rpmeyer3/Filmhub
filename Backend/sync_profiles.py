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

print("=== Syncing profiles from auth.users metadata ===\n")

# Get all users and their metadata
cursor.execute("""
    SELECT id, email, raw_user_meta_data
    FROM auth.users;
""")

users = cursor.fetchall()

for user_id, email, metadata in users:
    first_name = metadata.get('first_name', '')
    last_name = metadata.get('last_name', '')
    receive_promotions = metadata.get('receive_promotions', False)
    
    print(f"Updating profile for {email}")
    print(f"  First Name: {first_name}")
    print(f"  Last Name: {last_name}")
    print(f"  Receive Promotions: {receive_promotions}")
    
    # Update the profiles table
    cursor.execute("""
        UPDATE profiles
        SET first_name = %s,
            last_name = %s,
            receive_promotions = %s,
            updated_at = NOW()
        WHERE id = %s
    """, (first_name, last_name, receive_promotions, user_id))
    
    print(f"  ✓ Updated {cursor.rowcount} row(s)\n")

conn.commit()

print("\n=== Verification: Profiles with receive_promotions = TRUE ===")
cursor.execute("""
    SELECT p.id, p.email, p.first_name, p.last_name, p.receive_promotions, au.email as auth_email
    FROM profiles p
    JOIN auth.users au ON p.id = au.id
    WHERE p.receive_promotions = TRUE;
""")

print("ID | Email | First Name | Last Name | Receive Promotions")
for row in cursor.fetchall():
    print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]}")

if cursor.rowcount == 0:
    print("No users found with receive_promotions = TRUE")

cursor.close()
conn.close()

print("\n✅ Sync complete!")
