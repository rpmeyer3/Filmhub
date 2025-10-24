'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [bookingInfo, setBookingInfo] = useState({
    movie: '',
    showtime: '',
    movieId: ''
  })
  const [savedCards, setSavedCards] = useState([])
  const [selectedCardId, setSelectedCardId] = useState('')
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [loadingCards, setLoadingCards] = useState(false)
  const [newCard, setNewCard] = useState({
    cardholderName: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: ''
  })

  useEffect(() => {
    const movie = searchParams.get('movie') || ''
    const showtime = searchParams.get('showtime') || ''
    const movieId = searchParams.get('movieId') || ''
    
    setBookingInfo({ movie, showtime, movieId })
  }, [searchParams])

  // Fetch saved cards when user is available
  useEffect(() => {
    if (user) {
      fetchSavedCards()
    }
  }, [user])

  const fetchSavedCards = async () => {
    if (!user) return
    
    try {
      setLoadingCards(true)
      const response = await fetch(`http://localhost:8000/api/payment-cards/?supabase_id=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setSavedCards(data.cards)
        if (data.cards.length > 0 && !selectedCardId) {
          setSelectedCardId(data.cards[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoadingCards(false)
    }
  }

  const handleNewCardChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s/g, '')
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
      setNewCard(prev => ({ ...prev, [name]: formatted }))
    } else {
      setNewCard(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddNewCard = async () => {
    if (!user) {
      alert('Please sign in to add a payment card')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/payment-cards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabase_id: user.id,
          cardholder_name: newCard.cardholderName,
          card_number: newCard.cardNumber.replace(/\s/g, ''),
          expiration_month: parseInt(newCard.expirationMonth),
          expiration_year: parseInt(newCard.expirationYear),
          cvv: newCard.cvv
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Card added successfully!')
        setShowNewCardForm(false)
        setNewCard({
          cardholderName: '',
          cardNumber: '',
          expirationMonth: '',
          expirationYear: '',
          cvv: ''
        })
        fetchSavedCards()
      } else {
        alert('Failed to add card: ' + JSON.stringify(data.errors))
      }
    } catch (error) {
      alert('Failed to add card. Please try again.')
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i)
  const months = [
    { value: 1, label: '01' }, { value: 2, label: '02' }, { value: 3, label: '03' },
    { value: 4, label: '04' }, { value: 5, label: '05' }, { value: 6, label: '06' },
    { value: 7, label: '07' }, { value: 8, label: '08' }, { value: 9, label: '09' },
    { value: 10, label: '10' }, { value: 11, label: '11' }, { value: 12, label: '12' },
  ]

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
                      defaultValue={user?.user_metadata?.first_name || ''}
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
                      defaultValue={user?.user_metadata?.last_name || ''}
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
                      defaultValue={user?.email || ''}
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

              {/* Payment Method Selection */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                
                {!user ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      Please{' '}
                      <Link href="/login" className="font-medium underline">
                        sign in
                      </Link>{' '}
                      to use saved payment methods or{' '}
                      <Link href="/register" className="font-medium underline">
                        create an account
                      </Link>
                      .
                    </p>
                  </div>
                ) : loadingCards ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading payment methods...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedCards.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Select a saved card
                        </label>
                        {savedCards.map((card) => (
                          <div
                            key={card.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedCardId === card.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={() => {
                              setSelectedCardId(card.id)
                              setShowNewCardForm(false)
                            }}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="paymentCard"
                                checked={selectedCardId === card.id}
                                onChange={() => setSelectedCardId(card.id)}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{card.brand}</p>
                                <p className="text-sm text-gray-600">•••• •••• •••• {card.last_four}</p>
                                <p className="text-xs text-gray-500">{card.cardholder_name}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCardForm(!showNewCardForm)
                        setSelectedCardId('')
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      {showNewCardForm ? '- Cancel adding new card' : '+ Add new payment card'}
                    </button>

                    {showNewCardForm && (
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-4">
                        <h4 className="font-medium text-gray-900">New Card Details</h4>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            name="cardholderName"
                            value={newCard.cardholderName}
                            onChange={handleNewCardChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={newCard.cardNumber}
                            onChange={handleNewCardChange}
                            maxLength="19"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Month
                            </label>
                            <select
                              name="expirationMonth"
                              value={newCard.expirationMonth}
                              onChange={handleNewCardChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">MM</option>
                              {months.map(m => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Year
                            </label>
                            <select
                              name="expirationYear"
                              value={newCard.expirationYear}
                              onChange={handleNewCardChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="">YYYY</option>
                              {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={newCard.cvv}
                              onChange={handleNewCardChange}
                              maxLength="4"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddNewCard}
                          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
                        >
                          Save Card
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
                  {selectedCardId && (
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <span className="font-medium">
                        {savedCards.find(c => c.id === selectedCardId)?.brand} ••••{' '}
                        {savedCards.find(c => c.id === selectedCardId)?.last_four}
                      </span>
                    </div>
                  )}
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
                  Complete Booking
                </button>
              </div>
            </form>

            {/* Note for Demo */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Note:</strong> This is a prototype booking page. 
                Seat selection, pricing calculation, and payment processing will be fully implemented in later sprints.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}