// API service to connect to your Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class MovieService {
  // Get featured movies for hero section
  static async getFeaturedMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/featured/`);
      if (!response.ok) throw new Error('Failed to fetch featured movies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      return [];
    }
  }

  // Get now playing movies
  static async getNowPlayingMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/now-playing/`);
      if (!response.ok) throw new Error('Failed to fetch now playing movies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  }

  // Get coming soon movies
  static async getComingSoonMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/coming-soon/`);
      if (!response.ok) throw new Error('Failed to fetch coming soon movies');
      return await response.json();
    } catch (error) {
      console.error('Error fetching coming soon movies:', error);
      return [];
    }
  }

  // Get movie details by ID
  static async getMovieDetails(movieId) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/`);
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  // Search movies
  static async searchMovies(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/search/?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search movies');
      return await response.json();
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }
}

class TheaterService {
  // Get theaters by location
  static async getTheatersByLocation(location, radius = 25) {
    try {
      const response = await fetch(`${API_BASE_URL}/theaters/?location=${encodeURIComponent(location)}&radius=${radius}`);
      if (!response.ok) throw new Error('Failed to fetch theaters');
      return await response.json();
    } catch (error) {
      console.error('Error fetching theaters:', error);
      return [];
    }
  }

  // Get theater details
  static async getTheaterDetails(theaterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/theaters/${theaterId}/`);
      if (!response.ok) throw new Error('Failed to fetch theater details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching theater details:', error);
      return null;
    }
  }

  // Get showtimes for a theater
  static async getShowtimes(theaterId, date = null) {
    const dateParam = date ? `?date=${date}` : '';
    try {
      const response = await fetch(`${API_BASE_URL}/theaters/${theaterId}/showtimes/${dateParam}`);
      if (!response.ok) throw new Error('Failed to fetch showtimes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      return [];
    }
  }
}

export { MovieService, TheaterService };