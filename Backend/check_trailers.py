import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv('SUPABASE_HOST'),
    database=os.getenv('SUPABASE_DB_NAME'),
    user=os.getenv('SUPABASE_USER'),
    password=os.getenv('SUPABASE_PASSWORD'),
    port=os.getenv('SUPABASE_PORT')
)

cursor = conn.cursor()
query = 'SELECT "Title", "TrailerURL", "ImdbID" FROM "Movies" WHERE "TrailerURL" IS NOT NULL AND "TrailerURL" != \'N/A\' LIMIT 5'
cursor.execute(query)
rows = cursor.fetchall()

print('Movies with trailers:')
for row in rows:
    title, trailer_url, imdb_id = row
    print(f'Title: {title}')
    print(f'IMDB ID: {imdb_id}')
    print(f'Trailer: {trailer_url}')
    print('-' * 50)

cursor.close()
conn.close()