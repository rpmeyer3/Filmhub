'use client'

import { useState } from 'react'

export default function TheaterLocator() {
  const [searchLocation, setSearchLocation] = useState('')
  const [selectedTheater, setSelectedTheater] = useState(null)

  // Mock theater data
  const theaters = [
    {
      id: 1,
      name: "MovieTheater Phipps Plaza",
      address: "3500 Peachtree Rd NE, Atlanta, GA 30326",
      distance: "2.3 miles",
      amenities: ["IMAX", "Dolby Cinema", "Premium Dining", "Reclining Seats"],
      phone: "(404) 266-8282",
      hours: "10:00 AM - 11:00 PM",
      screens: 14,
      rating: 4.5
    },
    {
      id: 2,
      name: "MovieTheater Lenox Square",
      address: "3393 Peachtree Rd NE, Atlanta, GA 30326", 
      distance: "3.1 miles",
      amenities: ["Dolby Cinema", "Premium Dining", "Reclining Seats", "Bar"],
      phone: "(404) 264-7744",
      hours: "10:00 AM - 11:30 PM",
      screens: 16,
      rating: 4.3
    },
    {
      id: 3,
      name: "MovieTheater Atlantic Station",
      address: "261 19th St NW, Atlanta, GA 30363",
      distance: "4.7 miles", 
      amenities: ["IMAX", "Dine-In Theater", "Reserved Seating"],
      phone: "(404) 745-1988",
      hours: "10:30 AM - 12:00 AM",
      screens: 16,
      rating: 4.2
    },
    {
      id: 4,
      name: "MovieTheater Perimeter",
      address: "1155 Mount Vernon Hwy, Atlanta, GA 30338",
      distance: "8.9 miles",
      amenities: ["Dolby Cinema", "Reclining Seats", "Concession Stand"],
      phone: "(770) 394-4502", 
      hours: "10:00 AM - 11:00 PM",
      screens: 18,
      rating: 4.1
    }
  ]

  const TheaterCard = ({ theater }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{theater.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{theater.address}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>📍 {theater.distance}</span>
            <span>🎬 {theater.screens} screens</span>
            <div className="flex items-center">
              <span>⭐ {theater.rating}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSelectedTheater(selectedTheater === theater.id ? null : theater.id)}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          {selectedTheater === theater.id ? 'Less Info' : 'More Info'}
        </button>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {theater.amenities.map((amenity, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Information */}
      {selectedTheater === theater.id && (
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-600">{theater.phone}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Hours:</span>
              <span className="ml-2 text-gray-600">{theater.hours}</span>
            </div>
          </div>
          <div className="flex space-x-3 pt-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
              View Showtimes
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium text-sm transition-colors">
              Get Directions
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex space-x-3 mt-4">
        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors">
          Buy Tickets
        </button>
        <button className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-lg font-semibold transition-colors">
          View Movies
        </button>
      </div>
    </div>
  )

  return (
    <section id="theatres" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find a Theater</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Locate your nearest theater and discover premium movie experiences
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter ZIP code, city, or address
                </label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Atlanta, GA or 30309"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Within 25 miles</option>
                  <option>Within 50 miles</option>
                </select>
              </div>
              <div className="md:w-32 flex items-end">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md font-semibold transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button className="bg-red-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-red-700 transition-colors">
            All Theaters
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-300 transition-colors">
            IMAX
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-300 transition-colors">
            Dolby Cinema
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-300 transition-colors">
            Dine-In
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-300 transition-colors">
            Premium
          </button>
        </div>

        {/* Results Summary */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{theaters.length} theaters</span> near Atlanta, GA
          </p>
        </div>

        {/* Theater Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {theaters.map((theater) => (
            <TheaterCard key={theater.id} theater={theater} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors">
            Load More Theaters
          </button>
        </div>
      </div>
    </section>
  )
}