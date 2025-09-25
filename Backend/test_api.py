import requests
import json

try:
    # Test the main movies endpoint
    response = requests.get('http://127.0.0.1:8000/api/movies/')
    print('=== MOVIES ENDPOINT TEST ===')
    print(f'Status Code: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        print(f'Movies returned: {data.get("count", 0)}')
        if data.get('movies'):
            print('First movie sample:')
            movie = data['movies'][0]
            print(f'  Title: {movie.get("title")}')
            print(f'  Cast: {movie.get("cast", [])}')
            print(f'  Directors: {movie.get("directors", [])}')
            print(f'  Categories: {movie.get("categories", [])}')
            print(f'  Poster URL: {movie.get("poster_url")}')
    else:
        print('Error response:', response.text)
        
    # Test stats endpoint
    stats_response = requests.get('http://127.0.0.1:8000/api/stats/')
    print('\n=== STATS ENDPOINT TEST ===')
    print(f'Status Code: {stats_response.status_code}')
    if stats_response.status_code == 200:
        stats_data = stats_response.json()
        print('Database Statistics:')
        if stats_data.get('stats'):
            for key, value in stats_data['stats'].items():
                print(f'  {key}: {value}')
    
except Exception as e:
    print(f'Error testing API: {e}')