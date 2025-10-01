'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import MovieCard from '../components/MovieCard'
import SearchFilter from '../components/SearchFilter'
import Footer from '../components/Footer'
import ApiService from '../services/api'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getMovies()
      
      // Handle the Supabase Movies table data - using only database IDs
      const movieData = response.movies ? response.movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.year || '2024', // Use actual year from database, fallback to 2024
        plot: movie.synopsis,
        poster_url: movie.poster_url,
        genre: movie.category ? movie.category.join(', ') : movie.mpaa_rating, // Use category array as genres
        director: movie.director || 'Director TBD',
        actors: movie.cast || 'Cast TBD',
        producers: movie.producer || 'Producers TBD',
        runtime: '120 min', // Default running time for the movie
        rating: movie.rating?.toString() || '0',
        trailer_url: movie.trailer_url,
        trailer_pic: movie.trailer_pic_url,
        mpaa_rating: movie.mpaa_rating,
        is_running: movie.is_running,
        is_coming_soon: movie.is_coming_soon
      })) : []
      
      setMovies(movieData)
      setFilteredMovies(movieData)
    } catch (err) {
      console.error('Failed to fetch movies:', err)
      setError('Failed to load movies. Please check your connection and try again.')
      setMovies([])
      setFilteredMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredMovies(movies)
      return
    }

    try {
      setLoading(true)
      const searchResults = await ApiService.searchMovies(searchTerm)
      if (searchResults && searchResults.results) {
        setFilteredMovies(searchResults.results)
      } else {
        setFilteredMovies([])
      }
    } catch (err) {
      console.error('Search error:', err)
      setError('Search failed. Please try again.')
      setFilteredMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (selectedGenre) => {
    if (!selectedGenre) {
      setFilteredMovies(movies)
      return
    }

    const filtered = movies.filter(movie =>
      movie.genre && movie.genre.includes(selectedGenre)
    )
    setFilteredMovies(filtered)
  }

  // Separate movies into Currently Running and Coming Soon using database flags
  const currentlyRunning = filteredMovies.filter(movie => movie.is_running === true)
  const comingSoon = filteredMovies.filter(movie => movie.is_coming_soon === true)

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Fetching Movies!</div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Cinema E-Booking Deliverable #3 
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Just showing that it works...
          </p>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          movies={movies}
        />

        {/* Currently Running Movies */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Currently Running</h2>
          <hr className="border-gray-300 my-8" />
          
          {currentlyRunning.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentlyRunning.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No currently running movies found.</p>
            </div>
          )}
        </section>

        {/* Coming Soon Movies */}
        {comingSoon.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Coming Soon</h2>
            <hr className="border-gray-300 my-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comingSoon.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No movies found matching your criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
