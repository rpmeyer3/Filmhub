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

print("=== Creating trigger to sync auth.users metadata to profiles ===\n")

# Create a function that will be called by the trigger
trigger_function = """
CREATE OR REPLACE FUNCTION public.sync_auth_metadata_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the profiles table when auth.users.raw_user_meta_data changes
  UPDATE public.profiles
  SET 
    first_name = NEW.raw_user_meta_data->>'first_name',
    last_name = NEW.raw_user_meta_data->>'last_name',
    receive_promotions = COALESCE((NEW.raw_user_meta_data->>'receive_promotions')::boolean, false),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
"""

print("Creating trigger function...")
try:
    cursor.execute(trigger_function)
    print("✓ Trigger function created successfully\n")
except Exception as e:
    print(f"✗ Error creating trigger function: {e}\n")
    conn.rollback()

# Drop the trigger if it exists
print("Dropping old trigger if exists...")
try:
    cursor.execute("DROP TRIGGER IF EXISTS sync_auth_metadata_trigger ON auth.users;")
    print("✓ Old trigger dropped\n")
except Exception as e:
    print(f"✗ Error dropping old trigger: {e}\n")
    conn.rollback()

# Create the trigger
trigger_sql = """
CREATE TRIGGER sync_auth_metadata_trigger
AFTER UPDATE OF raw_user_meta_data ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_auth_metadata_to_profile();
"""

print("Creating trigger...")
try:
    cursor.execute(trigger_sql)
    conn.commit()
    print("✓ Trigger created successfully\n")
    print("✅ Setup complete! The profiles table will now auto-sync with auth.users metadata.")
except Exception as e:
    print(f"✗ Error creating trigger: {e}\n")
    conn.rollback()

cursor.close()
conn.close()
