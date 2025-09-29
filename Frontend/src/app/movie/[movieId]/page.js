'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../../components/Header'
import ApiService from '../../../services/api'

export default function MovieDetails() {
  const params = useParams()
  const { movieId } = params
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const showTimes = ['2:00 PM', '5:00 PM', '8:00 PM']

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      const movieData = await ApiService.getMovie(movieId)
      setMovie(movieData)
    } catch (err) {
      setError('Failed to load movie details. Please try again later.')
      console.error('Error fetching movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleShowtimeClick = (showtime) => {
    window.location.href = `/booking?movie=${encodeURIComponent(movie.title)}&movieId=${movie.id}&showtime=${encodeURIComponent(showtime)}`
  }

  const getTrailerUrl = () => {
    if (!movie?.title) return null
    
    // Use actual trailer URL from database if available
    if (movie.trailer_url) {
      return movie.trailer_url
    }
    
    // Fallback to YouTube search
    const searchQuery = `${movie.title} ${movie.year} trailer`
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
  }

  const getEmbedTrailerUrl = () => {
    // Use actual trailer URL from database if available
    if (movie?.trailer_url && movie.trailer_url.includes('youtube.com/watch')) {
      const videoId = movie.trailer_url.split('v=')[1]?.split('&')[0]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
    
    // Fallback placeholder
    return "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading movie details...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">{error || 'Movie not found'}</div>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Go Back to Home
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          ← Back to Movies
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Movie Poster */}
            <div className="md:w-1/3">
              {movie.poster_url && movie.poster_url !== 'N/A' ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="w-full h-96 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-96 md:h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">No Image Available</span>
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded">
                  {movie.year}
                </span>
                {movie.runtime && movie.runtime !== 'N/A' && (
                  <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded">
                    {movie.runtime}
                  </span>
                )}
                {movie.rating && movie.rating !== 'N/A' && (
                  <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded flex items-center gap-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {movie.rating}/10
                  </span>
                )}
                {movie.mpaa_rating && (
                  <span className="bg-red-200 text-red-800 px-3 py-1 rounded">
                    {movie.mpaa_rating}
                  </span>
                )}
              </div>

              {movie.genre && movie.genre !== 'N/A' && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Genre:</h3>
                  <p className="text-gray-600">{movie.genre}</p>
                </div>
              )}

              {movie.director && movie.director !== 'N/A' && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Director:</h3>
                  <p className="text-gray-600">{movie.director}</p>
                </div>
              )}

              {movie.actors && movie.actors !== 'N/A' && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Cast:</h3>
                  <p className="text-gray-600">{movie.actors}</p>
                </div>
              )}

              {movie.synopsis && movie.synopsis !== 'N/A' && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Synopsis:</h3>
                  <p className="text-gray-600 leading-relaxed">{movie.synopsis}</p>
                </div>
              )}

              {/* Showtimes */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Available Showtimes:</h3>
                <div className="flex flex-wrap gap-3">
                  {showTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleShowtimeClick(time)}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trailer Section */}
              {movie.trailer_url && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Trailer:</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={getEmbedTrailerUrl()}
                      title={`${movie.title} Trailer`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}