#!/usr/bin/env python
import requests
import json

def check_coming_soon_data():
    """Check what data is being returned for Coming Soon movies"""
    response = requests.get('http://localhost:8000/api/movies/')
    data = response.json()

    print('=== COMING SOON MOVIES DATA ===')
    coming_soon_movies = [movie for movie in data['movies'] if movie['is_coming_soon']]

    for i, movie in enumerate(coming_soon_movies, 1):
        print(f'\n{i}. {movie["title"]} (ID: {movie["id"]})')
        print(f'   Synopsis: {movie["synopsis"][:80]}...')
        print(f'   Poster: {movie["poster_url"]}')
        print(f'   Directors: {movie["directors"]}')
        print(f'   Cast: {movie["cast"][:3] if len(movie["cast"]) > 3 else movie["cast"]}')
        print(f'   Categories: {movie["categories"]}')
        print(f'   MPAA: {movie["mpaa_rating"]}')
        print(f'   Rating: {movie.get("rating", "N/A")}')

if __name__ == "__main__":
    check_coming_soon_data()