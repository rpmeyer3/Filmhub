'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MovieCarousel({ movies, title, autoPlay = true, autoPlayInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const carouselRef = useRef(null)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || movies.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, movies.length])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  // Touch/Mouse drag support
  const handleDragStart = (e) => {
    setIsDragging(true)
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX)
  }

  const handleDragEnd = (e) => {
    if (!isDragging) return
    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
    setIsDragging(false)
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  const closeModal = () => {
    setSelectedMovie(null)
  }

  // Calculate positions for 3D effect
  const getCardStyle = (index) => {
    const diff = index - currentIndex
    const totalCards = movies.length
    
    // Handle wrapping
    let adjustedDiff = diff
    if (diff > totalCards / 2) adjustedDiff = diff - totalCards
    if (diff < -totalCards / 2) adjustedDiff = diff + totalCards

    const isCenter = adjustedDiff === 0
    const isVisible = Math.abs(adjustedDiff) <= 2

    if (!isVisible) {
      return {
        opacity: 0,
        transform: `translateX(${adjustedDiff * 100}%) scale(0.5) rotateY(${adjustedDiff * 45}deg)`,
        zIndex: 0,
        pointerEvents: 'none'
      }
    }

    const scale = isCenter ? 1 : 0.75 - Math.abs(adjustedDiff) * 0.1
    const translateX = adjustedDiff * 280
    const rotateY = adjustedDiff * -25
    const translateZ = isCenter ? 100 : -Math.abs(adjustedDiff) * 100
    const opacity = isCenter ? 1 : 0.7 - Math.abs(adjustedDiff) * 0.2

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      zIndex: 10 - Math.abs(adjustedDiff),
      opacity: Math.max(opacity, 0.3),
      filter: isCenter ? 'none' : 'brightness(0.7)',
      pointerEvents: isCenter ? 'auto' : 'none'
    }
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No movies available</p>
      </div>
    )
  }

  return (
    <div className="relative w-full py-8">
      {/* Section Title */}
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
        </div>
      )}

      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative h-[500px] perspective-1000 overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {/* 3D Cards Container */}
        <div className="absolute inset-0 flex items-center justify-center preserve-3d">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="absolute w-[280px] transition-all duration-500 ease-out cursor-pointer"
              style={getCardStyle(index)}
              onClick={() => index === currentIndex && handleMovieClick(movie)}
            >
              <div className="movie-card-3d group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                
                {/* Card Content */}
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.poster_url && movie.poster_url !== 'N/A' ? (
                      <Image
                        src={movie.poster_url}
                        alt={movie.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        sizes="280px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">No Image</span>
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    
                    {/* Rating Badge */}
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

                    {/* Movie Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 drop-shadow-lg">
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

                  {/* Action Button */}
                  <div className="p-4">
                    {movie.is_running && !movie.is_coming_soon ? (
                      <Link 
                        href={`/movie/${movie.id}`}
                        className="block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-center py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
                      >
                        View Showtimes
                      </Link>
                    ) : (
                      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-8 h-3 bg-gradient-to-r from-red-500 to-purple-500'
                : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Movie Quick View Modal */}
      {selectedMovie && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 transform animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="md:flex">
              {/* Poster */}
              <div className="md:w-1/3 relative">
                {selectedMovie.poster_url && selectedMovie.poster_url !== 'N/A' ? (
                  <Image
                    src={selectedMovie.poster_url}
                    alt={selectedMovie.title}
                    width={400}
                    height={600}
                    className="w-full h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="md:w-2/3 p-8">
                <h2 className="text-3xl font-bold text-white mb-4">{selectedMovie.title}</h2>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                    {selectedMovie.year}
                  </span>
                  {selectedMovie.rating && selectedMovie.rating !== 'N/A' && (
                    <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {selectedMovie.rating}
                    </span>
                  )}
                  {selectedMovie.mpaa_rating && (
                    <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                      {selectedMovie.mpaa_rating}
                    </span>
                  )}
                </div>

                {selectedMovie.genre && (
                  <p className="text-gray-400 mb-4">{selectedMovie.genre}</p>
                )}

                {selectedMovie.plot && (
                  <p className="text-gray-300 mb-6 line-clamp-4">{selectedMovie.plot}</p>
                )}

                <Link
                  href={`/movie/${selectedMovie.id}`}
                  className="inline-block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {selectedMovie.is_running && !selectedMovie.is_coming_soon 
                    ? 'View Showtimes & Book' 
                    : 'View Details'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
