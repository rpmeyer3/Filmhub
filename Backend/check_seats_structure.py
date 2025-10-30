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

print("=== Seats Table Structure ===")
cursor.execute("""
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'seats'
    ORDER BY ordinal_position;
""")
for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]}")

print("\n=== Booking_Seats Table Structure ===")
cursor.execute("""
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'booking_seats'
    ORDER BY ordinal_position;
""")
for row in cursor.fetchall():
    print(f"{row[0]}: {row[1]}")

print("\n=== Sample Booking_Seats Data ===")
cursor.execute("""
    SELECT bs.booking_id, bs.seat_id, s.seat_row, s.seat_number, s.showroom_id
    FROM booking_seats bs
    JOIN seats s ON bs.seat_id = s.id
    LIMIT 5;
""")
for row in cursor.fetchall():
    print(f"Booking: {row[0]}, Seat: {row[1]}, Row: {row[2]}, Number: {row[3]}, Showroom: {row[4]}")

cursor.close()
conn.close()
