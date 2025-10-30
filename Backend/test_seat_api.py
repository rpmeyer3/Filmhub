"""
Test the seat API endpoint
"""

import requests

# Test getting seats for showtime ID 2
url = 'http://127.0.0.1:8000/api/showtimes/2/seats/'

try:
    print(f"Testing: GET {url}")
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:500]}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Success!")
        print(f"Number of seats: {len(data.get('seats', []))}")
        print(f"Layout: {data.get('layout')}")
    else:
        print("\n❌ Error!")
        
except Exception as e:
    print(f"\n❌ Exception: {str(e)}")
