// Test the exact API call the frontend makes
const API_BASE_URL = 'http://localhost:8000/api';

class TestApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', url);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getMovies() {
    return this.request('/movies/');
  }
}

// Test the flow
const testApi = async () => {
  const apiService = new TestApiService();
  
  try {
    const response = await apiService.getMovies();
    console.log('API Response received:', response);
    
    // Test the exact mapping logic from frontend
    const movieData = response.movies ? response.movies.map(movie => ({
      id: movie.id,
      imdb_id: movie.id.toString(),
      title: movie.title,
      year: '2024',
      plot: movie.synopsis,
      poster_url: movie.poster_url,
      genre: movie.categories ? movie.categories.join(', ') : movie.mpaa_rating,
      director: movie.directors ? movie.directors.join(', ') : 'Director TBD',
      actors: movie.cast ? movie.cast.join(', ') : 'Cast TBD',
      producers: movie.producers ? movie.producers.join(', ') : 'Producers TBD',
      runtime: '120 min',
      imdb_rating: movie.rating?.toString() || '0',
      trailer_url: movie.trailer_url,
      trailer_pic: movie.trailer_pic_url,
      mpaa_rating: movie.mpaa_rating,
      is_running: movie.is_running,
      is_coming_soon: movie.is_coming_soon,
      categories: movie.categories || [],
      cast: movie.cast || [],
      directors: movie.directors || [],
      producers: movie.producers || []
    })) : [];
    
    console.log('Mapped movie data:', movieData);
    console.log('Total movies:', movieData.length);
    
    // Test filtering
    const currentlyRunning = movieData.filter(movie => movie.is_running === true);
    const comingSoon = movieData.filter(movie => movie.is_coming_soon === true);
    
    console.log('Currently running:', currentlyRunning.length, currentlyRunning.map(m => m.title));
    console.log('Coming soon:', comingSoon.length, comingSoon.map(m => m.title));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testApi();