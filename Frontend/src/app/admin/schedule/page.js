'use client'

import AdminRoute from '@/components/AdminRoute'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

export default function AdminSchedulePage() {
  const [showtimes, setShowtimes] = useState([])
  const [movies, setMovies] = useState([])
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShowtime, setEditingShowtime] = useState(null)
  const [formData, setFormData] = useState({
    movie_id: '',
    showroom_id: '',
    showtime: '',
    price: '10.00',
    is_now_showing: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [showtimesRes, moviesRes, showroomsRes] = await Promise.all([
        fetch(`${API_URL}/admin/showtimes/`),
        fetch(`${API_URL}/movies/`),
        fetch(`${API_URL}/admin/showrooms/`)
      ])

      const showtimesData = await showtimesRes.json()
      const moviesData = await moviesRes.json()
      const showroomsData = await showroomsRes.json()

      if (showtimesData.success) setShowtimes(showtimesData.showtimes)
      if (moviesData.success) setMovies(moviesData.movies)
      if (showroomsData.success) setShowrooms(showroomsData.showrooms)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingShowtime 
        ? `${API_URL}/admin/showtimes/${editingShowtime.id}/`
        : `${API_URL}/admin/showtimes/`
      
      const method = editingShowtime ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert(editingShowtime ? 'Showtime updated successfully!' : 'Showtime created successfully!')
        setShowForm(false)
        setEditingShowtime(null)
        resetForm()
        fetchData()
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving showtime:', error)
      alert('Failed to save showtime')
    }
  }

  const handleEdit = (showtime) => {
    setEditingShowtime(showtime)
    // Format datetime for input field (YYYY-MM-DDTHH:MM)
    const date = new Date(showtime.showtime)
    const formatted = date.toISOString().slice(0, 16)
    
    setFormData({
      movie_id: showtime.movie_id,
      showroom_id: showtime.showroom_id,
      showtime: formatted,
      price: showtime.price,
      is_now_showing: showtime.is_now_showing
    })
    setShowForm(true)
  }

  const handleDelete = async (showtimeId) => {
    if (!confirm('Are you sure you want to delete this showtime?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/showtimes/${showtimeId}/`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Showtime deleted successfully!')
        fetchData()
      } else {
        alert(`Error: ${data.error || 'Failed to delete showtime'}`)
      }
    } catch (error) {
      console.error('Error deleting showtime:', error)
      alert('Failed to delete showtime')
    }
  }

  const resetForm = () => {
    setFormData({
      movie_id: '',
      showroom_id: '',
      showtime: '',
      price: '10.00',
      is_now_showing: true
    })
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingShowtime(null)
    resetForm()
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
                  ← Back to Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Schedule Showtimes</h1>
                <p className="text-gray-600 mt-1">Assign movies to showrooms with specific showtimes</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              >
                {showForm ? 'Cancel' : '+ Schedule New Showtime'}
              </button>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingShowtime ? 'Edit Showtime' : 'Schedule New Showtime'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Movie *
                    </label>
                    <select
                      name="movie_id"
                      value={formData.movie_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a movie</option>
                      {movies.map(movie => (
                        <option key={movie.id} value={movie.id}>
                          {movie.title} ({movie.year})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Showroom *
                    </label>
                    <select
                      name="showroom_id"
                      value={formData.showroom_id}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a showroom</option>
                      {showrooms.map(showroom => (
                        <option key={showroom.id} value={showroom.id}>
                          {showroom.name} (Capacity: {showroom.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Showtime *
                    </label>
                    <input
                      type="datetime-local"
                      name="showtime"
                      value={formData.showtime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_now_showing"
                      checked={formData.is_now_showing}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Currently Showing (Active)</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
                  >
                    {editingShowtime ? 'Update Showtime' : 'Schedule Showtime'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Showtimes List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scheduled Showtimes ({showtimes.length})</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading showtimes...</p>
            ) : showtimes.length === 0 ? (
              <p className="text-gray-600">No showtimes scheduled yet. Create your first showtime!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Movie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Showroom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Showtime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {showtimes.map((showtime) => (
                      <tr key={showtime.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{showtime.movie_title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{showtime.showroom_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDateTime(showtime.showtime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${parseFloat(showtime.price).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {showtime.is_now_showing ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(showtime)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(showtime.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}
