// Test the frontend API call directly
const testFrontendAPI = async () => {
  const API_BASE_URL = 'http://localhost:8000/api';
  
  try {
    console.log('Testing API call to:', `${API_BASE_URL}/movies/`);
    
    const response = await fetch(`${API_BASE_URL}/movies/`);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    console.log('Number of movies:', data.movies ? data.movies.length : 0);
    
    if (data.movies && data.movies.length > 0) {
      console.log('First movie sample:', data.movies[0]);
      
      // Test the mapping transformation
      const movie = data.movies[0];
      const mappedMovie = {
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
      };
      
      console.log('Mapped movie:', mappedMovie);
      console.log('Is running:', mappedMovie.is_running);
      console.log('Is coming soon:', mappedMovie.is_coming_soon);
    }
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

testFrontendAPI();