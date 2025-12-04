'use client'
import AdminRoute from '@/components/AdminRoute'
import { useState, useEffect } from 'react'
import Link from 'next/link'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
export default function AdminShowtimesPage() {
  const [showrooms, setShowrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingShowroom, setEditingShowroom] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    rows: 10,
    seats_per_row: 12,
    capacity: 120
  })
  useEffect(() => {
    fetchShowrooms()
  }, [])

  useEffect(() => {
    //calculate capacity when rows or seats_per_row change
    setFormData(prev => ({
      ...prev,
      capacity: prev.rows * prev.seats_per_row
    }))
  }, [formData.rows, formData.seats_per_row])

  const fetchShowrooms = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/showrooms/`)
      const data = await response.json()
      if (data.success) {
        setShowrooms(data.showrooms)
      }
    } catch (error) {
      console.error('Error fetching showrooms:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseInt(value) || 0
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingShowroom 
        ? `${API_URL}/admin/showrooms/${editingShowroom.id}/`
        : `${API_URL}/admin/showrooms/`
      
      const method = editingShowroom ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        alert(editingShowroom ? 'Showroom updated successfully!' : 'Showroom created successfully!')
        setShowForm(false)
        setEditingShowroom(null)
        resetForm()
        fetchShowrooms()
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving showroom:', error)
      alert('Failed to save showroom')
    }
  }
  const handleEdit = (showroom) => {
    setEditingShowroom(showroom)
    setFormData({
      name: showroom.name,
      rows: showroom.rows,
      seats_per_row: showroom.seats_per_row,
      capacity: showroom.capacity
    })
    setShowForm(true)
  }
  const handleDelete = async (showroomId) => {
    if (!confirm('Are you sure you want to delete this showroom? itll delte all other showtimes and bookings.')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/showrooms/${showroomId}/`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Showroom deleted successfully!')
        fetchShowrooms()
      } else {
        alert(`Error: ${data.error || 'Failed to delete showroom'}`)
      }
    } catch (error) {
      console.error('Error deleting showroom:', error)
      alert('Failed to delete showroom')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      rows: 10,
      seats_per_row: 12,
      capacity: 120
    })
  }
  const cancelEdit = () => {
    setShowForm(false)
    setEditingShowroom(null)
    resetForm()
  }
  const renderSeatLayout = (rows, seatsPerRow) => {
    const maxPreviewRows = 5
    const maxPreviewSeats = 10
    const displayRows = Math.min(rows, maxPreviewRows)
    const displaySeats = Math.min(seatsPerRow, maxPreviewSeats)
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="text-center mb-2">
          <div className="bg-gray-300 text-xs py-1 rounded-t-lg w-32 mx-auto">SCREEN</div>
        </div>
        <div className="space-y-1">
          {[...Array(displayRows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-1">
              {[...Array(displaySeats)].map((_, seatIndex) => (
                <div 
                  key={seatIndex}
                  className="w-4 h-4 bg-blue-500 rounded-sm"
                  title={`Row ${String.fromCharCode(65 + rowIndex)}, Seat ${seatIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
        {(rows > maxPreviewRows || seatsPerRow > maxPreviewSeats) && (
          <div className="text-center text-xs text-gray-500 mt-2">
            Preview limited to {maxPreviewRows}x{maxPreviewSeats} (Full: {rows}x{seatsPerRow})
          </div>
        )}
      </div>
    )
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
                <h1 className="text-3xl font-bold text-gray-800">Manage Showrooms</h1>
                <p className="text-gray-600 mt-1">Create and manage theater showrooms with custom seat layouts</p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
              >
                {showForm ? 'Cancel' : '+ Add New Showroom'}
              </button>
            </div>
          </div>
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingShowroom ? 'Edit Showroom' : 'Add New Showroom'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Showroom Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Showroom 1, IMAX Theater, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Rows *
                      </label>
                      <input
                        type="number"
                        name="rows"
                        value={formData.rows}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Between 1 and 20 rows</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seats Per Row *
                      </label>
                      <input
                        type="number"
                        name="seats_per_row"
                        value={formData.seats_per_row}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Between 1 and 30 seats</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-calculated: {formData.rows} × {formData.seats_per_row} = {formData.capacity}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seat Layout Preview
                    </label>
                    {renderSeatLayout(formData.rows, formData.seats_per_row)}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
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
                    {editingShowroom ? 'Update Showroom' : 'Create Showroom'}
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Showrooms ({showrooms.length})</h2>
            
            {loading ? (
              <p className="text-gray-600">Loading showrooms...</p>
            ) : showrooms.length === 0 ? (
              <p className="text-gray-600">No showrooms found. Add your first showroom to get started!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showrooms.map((showroom) => (
                  <div key={showroom.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{showroom.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(showroom)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(showroom.id)}
                          className="text-red-600 hover:text-red-800 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex justify-between">
                        <span>Rows:</span>
                        <span className="font-medium">{showroom.rows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seats per Row:</span>
                        <span className="font-medium">{showroom.seats_per_row}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Capacity:</span>
                        <span className="font-medium text-blue-600">{showroom.capacity}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      {renderSeatLayout(showroom.rows, showroom.seats_per_row)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}
