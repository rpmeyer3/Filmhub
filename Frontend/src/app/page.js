"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import MovieCarousel from "../components/MovieCarousel";
import SearchFilter from "../components/SearchFilter";
import Footer from "../components/Footer";
import ApiService from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' or 'grid'

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getMovies();

      // Map movie data from database
      const movieData = response.movies
        ? response.movies.map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: movie.year || "2024",
            plot: movie.synopsis,
            poster_url: movie.poster_url,
            genre: movie.category
              ? movie.category.join(", ")
              : movie.mpaa_rating,
            director: movie.director || "Director TBD",
            actors: movie.cast || "Cast TBD",
            producers: movie.producer || "Producers TBD",
            runtime: "120 min",
            rating: movie.rating?.toString() || "0",
            trailer_url: movie.trailer_url,
            trailer_pic: movie.trailer_pic_url,
            mpaa_rating: movie.mpaa_rating,
            is_running: movie.is_running,
            is_coming_soon: movie.is_coming_soon,
          }))
        : [];

      setMovies(movieData);
      setFilteredMovies(movieData);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError(
        "Failed to load movies. Please check your connection and try again."
      );
      setMovies([]);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredMovies(movies);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await ApiService.searchMovies(searchTerm);
      if (searchResults && searchResults.results) {
        setFilteredMovies(searchResults.results);
      } else {
        setFilteredMovies([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (selectedGenre) => {
    if (!selectedGenre) {
      setFilteredMovies(movies);
      return;
    }

    const filtered = movies.filter(
      (movie) => movie.genre && movie.genre.includes(selectedGenre)
    );
    setFilteredMovies(filtered);
  };

  const currentlyRunning = filteredMovies.filter(
    (movie) => movie.is_running === true
  );
  const comingSoon = filteredMovies.filter(
    (movie) => movie.is_coming_soon === true
  );

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen animated-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl text-white font-medium">Loading amazing movies...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center glass-dark rounded-2xl p-8">
            <div className="text-red-400 text-xl">{error}</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 hero-gradient py-12 rounded-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Welcome to </span>
            <span className="text-gradient">Film-Hub</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4">
            Your premier destination for movie tickets and entertainment.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Browse our selection of films and book your seats today.
          </p>
          
          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="glass-dark rounded-2xl p-6 mb-12">
          <SearchFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            movies={movies}
          />
          
          {/* View Mode Toggle */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                viewMode === 'carousel'
                  ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                Carousel View
              </span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid View
              </span>
            </button>
          </div>
        </div>

        {/* Currently Running Section */}
        {currentlyRunning.length > 0 && (
          <section className="mb-16">
            {viewMode === 'carousel' ? (
              <MovieCarousel 
                movies={currentlyRunning} 
                title="🎬 Now Playing"
                autoPlay={true}
                autoPlayInterval={4000}
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    🎬 Now Playing
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentlyRunning.map((movie) => (
                    <ModernMovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <section className="mb-16">
            {viewMode === 'carousel' ? (
              <MovieCarousel 
                movies={comingSoon} 
                title="🎥 Coming Soon"
                autoPlay={true}
                autoPlayInterval={5000}
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    🎥 Coming Soon
                  </h2>
                  <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {comingSoon.map((movie) => (
                    <ModernMovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-12 glass-dark rounded-2xl">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-xl">
              No movies found matching your criteria.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// Modern Movie Card Component for Grid View
function ModernMovieCard({ movie }) {
  return (
    <div className="group relative card-lift">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      
      {/* Card */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <a href={`/movie/${movie.id}`}>
            {movie.poster_url && movie.poster_url !== 'N/A' ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </a>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          
          {/* Rating */}
          {movie.rating && movie.rating !== 'N/A' && movie.rating !== '0' && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-white text-sm font-semibold">{movie.rating}</span>
            </div>
          )}

          {/* MPAA Rating */}
          {movie.mpaa_rating && (
            <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold">
              {movie.mpaa_rating}
            </div>
          )}

          {/* Movie Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>{movie.year}</span>
              {movie.genre && (
                <>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="line-clamp-1">{movie.genre.split(',')[0]}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="p-4">
          {movie.is_running && !movie.is_coming_soon ? (
            <a 
              href={`/movie/${movie.id}`}
              className="block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-center py-3 rounded-xl font-semibold transition-all duration-300"
            >
              View Showtimes
            </a>
          ) : (
            <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
