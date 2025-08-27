import requests
from django.conf import settings


class OMDBService:
    """Service for interacting with OMDB API"""
    
    def __init__(self):
        self.api_key = settings.OMDB_API_KEY
        self.base_url = settings.OMDB_BASE_URL
    
    def get_movie_by_id(self, imdb_id):
        """Get movie details by IMDB ID"""
        if not self.api_key:
            return None
            
        params = {
            'apikey': self.api_key,
            'i': imdb_id,
            'plot': 'full'
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            data = response.json()
            
            if data.get('Response') == 'True':
                return self._format_movie_data(data)
            return None
        except Exception as e:
            print(f"Error fetching movie data: {e}")
            return None
    
    def search_movies(self, query, page=1):
        """Search for movies by title"""
        if not self.api_key:
            return {'results': [], 'total_results': 0}
            
        params = {
            'apikey': self.api_key,
            's': query,
            'page': page
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            data = response.json()
            
            if data.get('Response') == 'True':
                return {
                    'results': data.get('Search', []),
                    'total_results': int(data.get('totalResults', 0))
                }
            return {'results': [], 'total_results': 0}
        except Exception as e:
            print(f"Error searching movies: {e}")
            return {'results': [], 'total_results': 0}
    
    def _format_movie_data(self, omdb_data):
        """Format OMDB API response to match our model"""
        return {
            'title': omdb_data.get('Title', ''),
            'year': omdb_data.get('Year', ''),
            'imdb_id': omdb_data.get('imdbID', ''),
            'plot': omdb_data.get('Plot', ''),
            'poster_url': omdb_data.get('Poster', ''),
            'genre': omdb_data.get('Genre', ''),
            'director': omdb_data.get('Director', ''),
            'actors': omdb_data.get('Actors', ''),
            'runtime': omdb_data.get('Runtime', ''),
            'imdb_rating': omdb_data.get('imdbRating', ''),
        }
