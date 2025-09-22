'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MovieListings() {
  const [activeTab, setActiveTab] = useState('now-playing')

  // Mock movie data (replace with API calls to your Django backend)
  const movies = {
    'now-playing': [
      {
        id: 1,
        title: "The Batman",
        poster: "/api/placeholder/400/600", // Will come from your backend/OMDB
        rating: "PG-13",
        genre: "Action, Crime",
        duration: "2h 56m",
        showtimes: ["2:30 PM", "6:00 PM", "9:30 PM"],
        imdbRating: "7.8",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham..."
      },
      {
        id: 2,
        title: "Dune",
        poster: "/api/placeholder/400/600", 
        rating: "PG-13",
        genre: "Sci-Fi, Adventure",
        duration: "2h 35m",
        showtimes: ["1:00 PM", "4:30 PM", "8:00 PM"],
        imdbRating: "8.0",
        description: "Paul Atreides leads nomadic tribes in a war against the enemies of his father..."
      },
      {
        id: 3,
        title: "No Time to Die",
        poster: "/api/placeholder/400/600",
        rating: "PG-13", 
        genre: "Action, Thriller",
        duration: "2h 43m",
        showtimes: ["3:15 PM", "7:00 PM", "10:15 PM"],
        imdbRating: "7.3",
        description: "James Bond has left active service. His peace is short-lived when Felix asks for help..."
      },
      {
        id: 4,
        title: "Eternals",
        poster: "/api/placeholder/400/600",
        rating: "PG-13",
        genre: "Action, Adventure",
        duration: "2h 37m", 
        showtimes: ["2:00 PM", "5:45 PM", "9:15 PM"],
        imdbRating: "6.3",
        description: "The saga of the Eternals, immortal aliens who have been living on Earth..."
      }
    ],
    'coming-soon': [
      {
        id: 5,
        title: "Doctor Strange 2",
        poster: "/api/placeholder/400/600",
        rating: "PG-13",
        genre: "Action, Adventure",
        duration: "2h 6m",
        releaseDate: "May 6, 2022",
        description: "Dr. Stephen Strange casts a forbidden spell that opens the doorway to the multiverse..."
      },
      {
        id: 6,
        title: "Thor: Love and Thunder", 
        poster: "/api/placeholder/400/600",
        rating: "PG-13",
        genre: "Action, Comedy",
        duration: "1h 59m",
        releaseDate: "July 8, 2022",
        description: "Thor embarks on a journey unlike anything he's ever faced..."
      }
    ]
  }

  const MovieCard = ({ movie, isComingSoon = false }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <Image
          src={movie.poster}
          alt={movie.title}
          width={400}
          height={600}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
            {movie.rating}
          </span>
        </div>
        {movie.imdbRating && (
          <div className="absolute top-3 right-3">
            <div className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
              ⭐ {movie.imdbRating}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            {isComingSoon ? '🔔 Notify Me' : '▶️ Watch Trailer'}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>{movie.genre}</span>
          <span className="mx-2">•</span>
          <span>{movie.duration}</span>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {movie.description}
        </p>
        
        {isComingSoon ? (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-red-600">
              Coming {movie.releaseDate}
            </div>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors">
              Add to Watchlist
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {movie.showtimes.map((time, index) => (
                <button
                  key={index}
                  className="bg-gray-100 hover:bg-red-600 hover:text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Get Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section id="movies" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Movies</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest blockbusters and coming attractions at your local theater
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('now-playing')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'now-playing'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Now Playing
            </button>
            <button
              onClick={() => setActiveTab('coming-soon')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'coming-soon'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies[activeTab].map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              isComingSoon={activeTab === 'coming-soon'} 
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            View All Movies
          </button>
        </div>
      </div>
    </section>
  )
}