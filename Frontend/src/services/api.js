const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  async getMovies() {
    return this.request('/movies/');
  }

  async getMovie(movieId) {
    return this.request(`/movies/${movieId}/`);
  }

  async searchMovies(query) {
    return this.request(`/movies/search/${encodeURIComponent(query)}/`);
  }
  async getFavorites() {
    return this.request('/favorites/');
  }

  async toggleFavorite(movieId) {
    return this.request(`/favorites/${movieId}/`, {
      method: 'POST',
    });
  }
  async getMovieReviews(movieId) {
    return this.request(`/reviews/${movieId}/`);
  }
}

export default new ApiService();