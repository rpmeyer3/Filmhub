'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../../../components/Header'
import ApiService from '../../../services/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function MovieDetails() {
  const params = useParams()
  const router = useRouter()
  const { movieId } = params
  const [movie, setMovie] = useState(null)
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [allMovies, setAllMovies] = useState([])
  const [relatedMovieIndex, setRelatedMovieIndex] = useState(0)

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails()
      fetchShowtimes()
      fetchAllMovies()
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

  const fetchShowtimes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/showtimes/`)
      const data = await response.json()
      if (data.success) {
        setShowtimes(data.showtimes)
      }
    } catch (err) {
      console.error('Failed to fetch showtimes:', err)
    }
  }

  const fetchAllMovies = async () => {
    try {
      const response = await ApiService.getMovies()
      if (response.movies) {
        const otherMovies = response.movies
          .filter(m => m.id !== parseInt(movieId) && m.is_running)
          .map(m => ({
            id: m.id,
            title: m.title,
            poster_url: m.poster_url,
            genre: m.category?.join(', ') || '',
            rating: m.rating?.toString() || '0'
          }))
        setAllMovies(otherMovies)
      }
    } catch (err) {
      console.error('Failed to fetch related movies:', err)
    }
  }

  const formatShowtime = (datetimeString) => {
    const date = new Date(datetimeString)
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
    return { dateStr, timeStr, fullDate: date }
  }

  const groupShowtimesByDate = () => {
    const grouped = {}
    showtimes.forEach(showtime => {
      const { dateStr } = formatShowtime(showtime.showtime)
      if (!grouped[dateStr]) {
        grouped[dateStr] = []
      }
      grouped[dateStr].push(showtime)
    })
    return grouped
  }

  const handleShowtimeClick = (showtime) => {
    router.push(`/booking?movieId=${movieId}&showtimeId=${showtime.id}`)
  }

  const getTrailerUrl = () => {
    if (!movie?.title) return null
    if (movie.trailer_url) {
      return movie.trailer_url
    }
    const searchQuery = `${movie.title} ${movie.year} trailer`
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
  }

  const getEmbedTrailerUrl = () => {
    if (movie?.trailer_url && movie.trailer_url.includes('youtube.com/watch')) {
      const videoId = movie.trailer_url.split('v=')[1]?.split('&')[0]
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
    return "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }

  const handleRelatedPrev = () => {
    setRelatedMovieIndex((prev) => (prev - 1 + allMovies.length) % allMovies.length)
  }

  const handleRelatedNext = () => {
    setRelatedMovieIndex((prev) => (prev + 1) % allMovies.length)
  }

  const getRelatedMovieStyle = (index) => {
    const diff = index - relatedMovieIndex
    const total = allMovies.length
    let adjustedDiff = diff
    if (diff > total / 2) adjustedDiff = diff - total
    if (diff < -total / 2) adjustedDiff = diff + total
    
    const isCenter = adjustedDiff === 0
    const isVisible = Math.abs(adjustedDiff) <= 2
    
    if (!isVisible) {
      return { opacity: 0, transform: 'scale(0.5)', zIndex: 0, pointerEvents: 'none' }
    }

    const scale = isCenter ? 1 : 0.7 - Math.abs(adjustedDiff) * 0.1
    const translateX = adjustedDiff * 200
    const rotateY = adjustedDiff * -20
    
    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex: 10 - Math.abs(adjustedDiff),
      opacity: isCenter ? 1 : 0.5,
      filter: isCenter ? 'none' : 'brightness(0.6)',
      pointerEvents: isCenter ? 'auto' : 'none'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen animated-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl text-white font-medium">Loading movie details...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen animated-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center glass-dark rounded-2xl p-8">
            <div className="text-red-400 text-xl mb-4">{error || 'Movie not found'}</div>
            <Link href="/" className="inline-block bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all">
              Go Back to Home
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const groupedShowtimes = groupShowtimesByDate()
  const dates = Object.keys(groupedShowtimes)

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Background Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
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
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 group transition-all"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Movies
        </Link>

        {/* Main Movie Card */}
        <div className="glass-dark rounded-3xl overflow-hidden shadow-2xl mb-12">
          <div className="lg:flex">
            {/* Poster Section */}
            <div className="lg:w-1/3 relative group">
              <div className="relative aspect-[2/3] lg:aspect-auto lg:h-full overflow-hidden">
                {movie.poster_url && movie.poster_url !== 'N/A' ? (
                  <Image
                    src={movie.poster_url}
                    alt={movie.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500 text-xl">No Image</span>
                  </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r"></div>
              </div>
            </div>

            {/* Info Section */}
            <div className="lg:w-2/3 p-8 lg:p-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {movie.title}
              </h1>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="bg-gray-700/50 text-gray-200 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  📅 {movie.year}
                </span>
                {movie.runtime && movie.runtime !== 'N/A' && (
                  <span className="bg-blue-600/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    ⏱️ {movie.runtime}
                  </span>
                )}
                {movie.rating && movie.rating !== 'N/A' && (
                  <span className="bg-yellow-600/30 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {movie.rating}/10
                  </span>
                )}
                {movie.mpaa_rating && (
                  <span className="bg-red-600/30 text-red-300 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                    {movie.mpaa_rating}
                  </span>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {movie.genre && movie.genre !== 'N/A' && (
                  <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
                    <h3 className="text-gray-400 text-sm mb-1">Genre</h3>
                    <p className="text-white font-medium">{movie.genre}</p>
                  </div>
                )}
                {movie.director && movie.director !== 'N/A' && (
                  <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
                    <h3 className="text-gray-400 text-sm mb-1">Director</h3>
                    <p className="text-white font-medium">{movie.director}</p>
                  </div>
                )}
                {movie.actors && movie.actors !== 'N/A' && (
                  <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm md:col-span-2">
                    <h3 className="text-gray-400 text-sm mb-1">Cast</h3>
                    <p className="text-white font-medium">{movie.actors}</p>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              {movie.synopsis && movie.synopsis !== 'N/A' && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        {movie.is_running && !movie.is_coming_soon && (
          <div className="glass-dark rounded-3xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="text-gradient">🎟️ Available Showtimes</span>
            </h2>
            
            {showtimes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-gray-400 text-lg">No showtimes available at the moment.</p>
                <p className="text-gray-500 mt-2">Please check back later!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Date Selector Carousel */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {dates.map((date, index) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 px-6 py-4 rounded-2xl transition-all duration-300 ${
                        (selectedDate || dates[0]) === date
                          ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/30 scale-105'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-medium">{date}</div>
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {groupedShowtimes[selectedDate || dates[0]]?.map((showtime) => {
                    const { timeStr } = formatShowtime(showtime.showtime)
                    return (
                      <button
                        key={showtime.id}
                        onClick={() => handleShowtimeClick(showtime)}
                        className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 border border-gray-700/50 hover:border-red-500/50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative font-bold text-lg">{timeStr}</span>
                        <div className="text-xs text-gray-400 group-hover:text-red-200 mt-1">Book Now</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coming Soon Banner */}
        {movie.is_coming_soon && (
          <div className="glass-dark rounded-3xl p-8 mb-12 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-3xl font-bold text-gradient mb-4">Coming Soon!</h2>
            <p className="text-gray-400 text-lg">
              This movie will be available for booking soon. Stay tuned!
            </p>
          </div>
        )}

        {/* Trailer Section */}
        {movie.trailer_url && (
          <div className="glass-dark rounded-3xl p-8 mb-12 overflow-hidden">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="text-gradient">🎥 Watch Trailer</span>
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={getEmbedTrailerUrl()}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Related Movies Carousel */}
        {allMovies.length > 0 && (
          <div className="glass-dark rounded-3xl p-8 overflow-hidden">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="text-gradient">🎬 More Movies</span>
            </h2>
            
            <div className="relative h-[400px] perspective-1000">
              <div className="absolute inset-0 flex items-center justify-center preserve-3d">
                {allMovies.map((relatedMovie, index) => (
                  <div
                    key={relatedMovie.id}
                    className="absolute w-[200px] transition-all duration-500 ease-out"
                    style={getRelatedMovieStyle(index)}
                  >
                    <Link href={`/movie/${relatedMovie.id}`}>
                      <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700/50">
                          <div className="aspect-[2/3] relative">
                            {relatedMovie.poster_url ? (
                              <Image
                                src={relatedMovie.poster_url}
                                alt={relatedMovie.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="text-white font-semibold text-sm line-clamp-2">{relatedMovie.title}</h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <button
                onClick={handleRelatedPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleRelatedNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {allMovies.slice(0, Math.min(allMovies.length, 10)).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setRelatedMovieIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === relatedMovieIndex % allMovies.length
                      ? 'w-6 h-2 bg-gradient-to-r from-red-500 to-purple-500'
                      : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}