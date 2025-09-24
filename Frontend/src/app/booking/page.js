'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const [bookingInfo, setBookingInfo] = useState({
    movie: '',
    showtime: '',
    imdbId: ''
  })

  useEffect(() => {
    const movie = searchParams.get('movie') || ''
    const showtime = searchParams.get('showtime') || ''
    const imdbId = searchParams.get('imdbId') || ''
    
    setBookingInfo({ movie, showtime, imdbId })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          ← Back to Movies
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Book Your Tickets
            </h1>

            {/* Movie and Showtime Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Movie:</span>
                  <p className="text-lg text-gray-800">{bookingInfo.movie}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Showtime:</span>
                  <p className="text-lg text-gray-800">{bookingInfo.showtime}</p>
                </div>
              </div>
            </div>

            {/* Booking Form (UI Only) */}
            <form className="space-y-6">
              {/* Number of Tickets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Adult Tickets
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Child Tickets
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Theater Selection */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Theater Selection</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Theater Location
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option value="">Choose a location...</option>
                    <option value="downtown">Downtown Cinema - Main Street</option>
                    <option value="mall">Mall Cinema - Shopping Center</option>
                    <option value="westside">Westside Theater - Oak Avenue</option>
                    <option value="eastend">East End Movies - Park Road</option>
                  </select>
                </div>
              </div>

              {/* Seat Selection Placeholder */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Seat Selection</h3>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-600 mb-4">🎭 Theater Seating Chart</p>
                  <p className="text-sm text-gray-500">
                    Seat selection and pricing will be implemented in future sprints.
                  </p>
                  <div className="mt-4 text-xs text-gray-400">
                    [Screen would go here]<br/>
                    [Seat layout would be displayed here]
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Movie:</span>
                    <span className="font-medium">{bookingInfo.movie}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Showtime:</span>
                    <span className="font-medium">{bookingInfo.showtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Theater:</span>
                    <span className="font-medium">To be selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span className="font-medium">To be selected</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">$XX.XX</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Booking functionality will be implemented in future sprints!')
                  }}
                >
                  Proceed to Payment
                </button>
              </div>
            </form>

            {/* Note for Demo */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Note:</strong> This is a prototype booking page as required for Sprint 1. 
                Seat selection, pricing calculation, and payment processing will be implemented in later sprints.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}