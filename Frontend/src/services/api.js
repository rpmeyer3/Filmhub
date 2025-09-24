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

  // Movie endpoints
  async getMovies() {
    return this.request('/movies/');
  }

  async getMovie(imdbId) {
    return this.request(`/movies/${imdbId}/`);
  }

  async searchMovies(query) {
    return this.request(`/movies/search/${encodeURIComponent(query)}/`);
  }

  // User favorites (for future use)
  async getFavorites() {
    return this.request('/favorites/');
  }

  async toggleFavorite(imdbId) {
    return this.request(`/favorites/${imdbId}/`, {
      method: 'POST',
    });
  }

  // Reviews (for future use)
  async getMovieReviews(imdbId) {
    return this.request(`/reviews/${imdbId}/`);
  }
}

export default new ApiService();