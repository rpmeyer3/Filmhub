'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../../components/Header'
import ApiService from '../../../services/api'

export default function MovieDetails() {
  const params = useParams()
  const { imdbId } = params
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const showTimes = ['2:00 PM', '5:00 PM', '8:00 PM']

  useEffect(() => {
    if (imdbId) {
      fetchMovieDetails()
    }
  }, [imdbId])

  const fetchMovieDetails = async () => {
    try {
      setLoading(true)
      const movieData = await ApiService.getMovie(imdbId)
      setMovie(movieData)
    } catch (err) {
      setError('Failed to load movie details. Please try again later.')
      console.error('Error fetching movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleShowtimeClick = (showtime) => {
    window.location.href = `/booking?movie=${encodeURIComponent(movie.title)}&imdbId=${movie.imdb_id}&showtime=${encodeURIComponent(showtime)}`
  }

  const getTrailerUrl = () => {
    if (!movie?.title) return null
    
    // For demo purposes, create a YouTube search URL based on movie title
    // In a real app, you'd store trailer URLs in the database
    const searchQuery = `${movie.title} ${movie.year} trailer`
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
  }

  const getEmbedTrailerUrl = () => {
    // For demo, we'll use a placeholder YouTube video
    // In production, you'd have actual trailer IDs stored in the database
    return "https://www.youtube.com/embed/dQw4w9WgXcQ" // Rick Roll as placeholder
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
              ← Back to Home
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
                {movie.imdb_rating && movie.imdb_rating !== 'N/A' && (
                  <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded">
                    ⭐ {movie.imdb_rating}/10
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

              {movie.plot && movie.plot !== 'N/A' && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-2">Synopsis:</h3>
                  <p className="text-gray-600 leading-relaxed">{movie.plot}</p>
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
                <p className="text-sm text-gray-500 mt-2">
                  Note: This is a demo trailer. In production, actual movie trailers would be displayed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}