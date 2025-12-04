'use client'

import AdminRoute from '@/components/AdminRoute'
import { useState, useEffect } from 'react'
import Link from 'next/link'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    synopsis: '',
    director: '',
    producer: '',
    cast: '',
    category: '',
    mpaa_rating: 'PG',
    poster_url: '',
    trailer_url: '',
    trailer_pic_url: '',
    is_running: false,
    is_coming_soon: false
  })
  useEffect(() => {
    fetchMovies()
  }, [])
  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/movies/`)
      const data = await response.json()
      if (data.success) {
        setMovies(data.movies)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
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
      const categoryArray = formData.category ? formData.category.split(',').map(c => c.trim()) : []
      
      const payload = {
        ...formData,
        category: categoryArray
      }

      const url = editingMovie 
        ? `${API_URL}/admin/movies/${editingMovie.id}/`
        : `${API_URL}/admin/movies/`
      
      const method = editingMovie ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        alert(editingMovie ? 'Movie updated successfully!' : 'Movie created successfully!')
        setShowForm(false)
        setEditingMovie(null)
        resetForm()
        fetchMovies()
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving movie:', error)
      alert('Failed to save movie')
    }
  }

  const handleEdit = (movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title || '',
      year: movie.year || '',
      synopsis: movie.synopsis || '',
      director: movie.director || '',
      producer: movie.producer || '',
      cast: movie.cast || '',
      category: Array.isArray(movie.category) ? movie.category.join(', ') : '',
      mpaa_rating: movie.mpaa_rating || 'PG',
      poster_url: movie.poster_url || '',
      trailer_url: movie.trailer_url || '',
      trailer_pic_url: movie.trailer_pic_url || '',
      is_running: movie.is_running || false,
      is_coming_soon: movie.is_coming_soon || false
    })
    setShowForm(true)
  }

  const handleDelete = async (movieId) => {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/movies/${movieId}/`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Movie deleted successfully!')
        fetchMovies()
      } else {
        alert(`Error: ${data.error || 'Failed to delete movie'}`)
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
      alert('Failed to delete movie')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      year: '',
      synopsis: '',
      director: '',
      producer: '',
      cast: '',
      category: '',
      mpaa_rating: 'PG',
      poster_url: '',
      trailer_url: '',
      trailer_pic_url: '',
      is_running: false,
      is_coming_soon: false
    })
  }

  const cancelEdit = () => {
    setShowForm(false)
    setEditingMovie(null)
    resetForm()
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
                  go Back to Admin Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Manage Movies</h1>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              >
                {showForm ? 'Cancel' : '+ Add New Movie'}
              </button>
            </div>
          </div>
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      maxLength="4"
                      placeholder="2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Director *
                    </label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Producer
                    </label>
                    <input
                      type="text"
                      name="producer"
                      value={formData.producer}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MPAA Rating *
                    </label>
                    <select
                      name="mpaa_rating"
                      value={formData.mpaa_rating}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="NC-17">NC-17</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categories (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Action, Adventure, Drama"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cast (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="cast"
                    value={formData.cast}
                    onChange={handleInputChange}
                    placeholder="Actor 1, Actor 2, Actor 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Synopsis *
                  </label>
                  <textarea
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poster Image URL
                    </label>
                    <input
                      type="url"
                      name="poster_url"
                      value={formData.poster_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trailer URL
                    </label>
                    <input
                      type="url"
                      name="trailer_url"
                      value={formData.trailer_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trailer Thumbnail URL
                    </label>
                    <input
                      type="url"
                      name="trailer_pic_url"
                      value={formData.trailer_pic_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_running"
                      checked={formData.is_running}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Currently Running</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_coming_soon"
                      checked={formData.is_coming_soon}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Coming Soon</span>
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
                    {editingMovie ? 'Update Movie' : 'Create Movie'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Movies ({movies.length})</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading movies...</p>
            ) : movies.length === 0 ? (
              <p className="text-gray-600">No movies found. Add your first movie!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Director
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
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
                    {movies.map((movie) => (
                      <tr key={movie.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{movie.year}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{movie.director}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {movie.mpaa_rating}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {movie.is_running && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 mr-1">
                              Running
                            </span>
                          )}
                          {movie.is_coming_soon && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Coming Soon
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(movie)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(movie.id)}
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
