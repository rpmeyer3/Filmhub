'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import MovieCard from '../components/MovieCard'
import SearchFilter from '../components/SearchFilter'
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
      const movieData = await ApiService.getMovies()
      setMovies(movieData)
      setFilteredMovies(movieData)
    } catch (err) {
      // Fallback to demo data when backend is not available
      console.log('Backend not available, using demo data')
      const demoMovies = [
        {
          imdb_id: 'tt0133093',
          title: 'The Matrix',
          year: '1999',
          plot: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
          poster_url: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          genre: 'Action, Sci-Fi',
          director: 'Lana Wachowski, Lilly Wachowski',
          actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
          runtime: '136 min',
          imdb_rating: '8.7'
        },
        {
          imdb_id: 'tt1375666',
          title: 'Inception',
          year: '2010',
          plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
          poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
          genre: 'Action, Drama, Sci-Fi',
          director: 'Christopher Nolan',
          actors: 'Leonardo DiCaprio, Marion Cotillard, Ellen Page',
          runtime: '148 min',
          imdb_rating: '8.8'
        },
        {
          imdb_id: 'tt4154796',
          title: 'Avengers: Endgame',
          year: '2019',
          plot: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
          poster_url: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
          genre: 'Action, Adventure, Drama',
          director: 'Anthony Russo, Joe Russo',
          actors: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
          runtime: '181 min',
          imdb_rating: '8.4'
        },
        {
          imdb_id: 'tt15398776',
          title: 'Oppenheimer',
          year: '2023',
          plot: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
          poster_url: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg',
          genre: 'Biography, Drama, History',
          director: 'Christopher Nolan',
          actors: 'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
          runtime: '180 min',
          imdb_rating: '8.4'
        }
      ]
      setMovies(demoMovies)
      setFilteredMovies(demoMovies)
      setError(null) // Clear error since we have demo data
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
      setFilteredMovies(searchResults)
    } catch (err) {
      console.error('Search error:', err)
      // Fallback to local filtering
      const localResults = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMovies(localResults)
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

  // Separate movies into Currently Running and Coming Soon
  const currentYear = new Date().getFullYear()
  const currentlyRunning = filteredMovies.filter(movie =>
    parseInt(movie.year) >= currentYear - 1
  )
  const comingSoon = filteredMovies.filter(movie =>
    parseInt(movie.year) > currentYear
  )

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading movies...</div>
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
            Cinema E-Booking System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and book your favorite movies. Experience cinema like never before.
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
          {currentlyRunning.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentlyRunning.map((movie) => (
                <MovieCard key={movie.imdb_id} movie={movie} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comingSoon.map((movie) => (
                <MovieCard key={movie.imdb_id} movie={movie} />
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
    </div>
  )
}
