'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Mock featured movies data (replace with API calls to your Django backend)
  const featuredMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      poster: "/api/placeholder/400/600", // Will come from your backend
      backdrop: "/api/placeholder/1920/1080", // Will come from your backend
      rating: "PG-13",
      genre: "Action, Adventure",
      description: "The epic conclusion to the Infinity Saga that became a critically acclaimed worldwide phenomenon.",
      trailer: "#"
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home", 
      poster: "/api/placeholder/400/600",
      backdrop: "/api/placeholder/1920/1080",
      rating: "PG-13",
      genre: "Action, Adventure",
      description: "Spider-Man's identity is revealed and he must ask for help from Doctor Strange.",
      trailer: "#"
    },
    {
      id: 3,
      title: "Top Gun: Maverick",
      poster: "/api/placeholder/400/600",
      backdrop: "/api/placeholder/1920/1080",
      rating: "PG-13", 
      genre: "Action, Drama",
      description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
      trailer: "#"
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featuredMovies.length])

  const currentMovie = featuredMovies[currentSlide]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentMovie.backdrop}
          alt={currentMovie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <span className="bg-red-600 px-3 py-1 rounded">{currentMovie.rating}</span>
                <span className="text-gray-300">{currentMovie.genre}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                {currentMovie.title}
              </h1>
            </div>
            
            <p className="text-xl text-gray-200 max-w-lg leading-relaxed">
              {currentMovie.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                <span>🎫</span>
                <span>Get Tickets</span>
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-black text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                <span>▶️</span>
                <span>Watch Trailer</span>
              </button>
            </div>

            {/* Quick Theater Search */}
            <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Find Showtimes</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Enter ZIP code or city"
                  className="flex-1 px-4 py-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-medium transition-colors">
                  Find Movies
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Movie Poster */}
          <div className="hidden lg:block">
            <div className="relative">
              <Image
                src={currentMovie.poster}
                alt={currentMovie.title}
                width={400}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">★ 8.5</div>
                  <div className="text-sm">IMDb Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-3">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-red-600' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  )
}