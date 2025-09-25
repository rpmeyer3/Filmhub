#!/usr/bin/env python
import requests
import time

def test_actor_data():
    """Test The Actor data with cache busting"""
    # Test with cache busting
    cache_buster = int(time.time())
    response = requests.get(f'http://localhost:8000/api/movies/?t={cache_buster}')
    data = response.json()

    # Focus on The Actor specifically
    actor_movie = next((m for m in data['movies'] if m['id'] == 7), None)

    if actor_movie:
        print('=== THE ACTOR (ID 7) - FRESH DATA ===')
        print(f'Title: {actor_movie["title"]}')
        print(f'Synopsis: {actor_movie["synopsis"][:100]}...')
        print(f'Poster URL: {actor_movie["poster_url"]}')
        print(f'Directors: {actor_movie["directors"]}')
        print(f'Cast: {actor_movie["cast"]}')
        print(f'Categories: {actor_movie["categories"]}')
        print(f'Is Coming Soon: {actor_movie["is_coming_soon"]}')
        print(f'MPAA: {actor_movie["mpaa_rating"]}')
        
        # Check if this matches what should be The Actor
        expected_synopsis_start = "Based on Donald E. Westlake"
        if actor_movie["synopsis"].startswith(expected_synopsis_start):
            print('✅ Synopsis matches The Actor')
        else:
            print('❌ Synopsis does NOT match The Actor')
            
        if 'André Holland' in actor_movie["cast"]:
            print('✅ Cast matches The Actor')
        else:
            print('❌ Cast does NOT match The Actor')
            
        if 'Duke Johnson' in actor_movie["directors"]:
            print('✅ Director matches The Actor')
        else:
            print('❌ Director does NOT match The Actor')
    else:
        print('The Actor not found!')

if __name__ == "__main__":
    test_actor_data()