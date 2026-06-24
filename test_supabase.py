from supabase import create_client
import os

url = "https://vywxvkmnrjvnrwwyzwmj.supabase.co"
key = "sb_publishable_jkiX2-3Pb56Gwb9wsi4H8w_RPE4wWnp"

try:
    client = create_client(url, key)
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
