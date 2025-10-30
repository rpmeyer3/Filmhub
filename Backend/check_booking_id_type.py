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

print("=== Bookings Table Structure ===")
cursor.execute("""
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'bookings'
    ORDER BY ordinal_position;
""")
for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]}")

print("\n=== Sample Booking IDs ===")
cursor.execute("""
    SELECT id, booking_number, user_id
    FROM bookings
    LIMIT 5;
""")
for row in cursor.fetchall():
    print(f"ID: {row[0]} (type: {type(row[0]).__name__}), Booking #: {row[1]}, User: {row[2]}")

cursor.close()
conn.close()
