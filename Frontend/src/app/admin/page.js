'use client'

import AdminRoute from '@/components/AdminRoute'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Back to Homepage
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
            <p className="text-gray-600">
              Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
            </p>
          </div>

          {/* Admin Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Manage Movies */}
            <Link 
              href="/admin/movies"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">Manage Movies</h2>
              </div>
              <p className="text-gray-600">Add, edit, and remove movies from the catalog</p>
            </Link>

            {/* Manage Showtimes */}
            <Link 
              href="/admin/showtimes"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">Manage Showtimes</h2>
              </div>
              <p className="text-gray-600">Schedule movie showtimes and manage showrooms</p>
            </Link>

            {/* Manage Promotions */}
            <Link 
              href="/admin/promotions"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">Manage Promotions</h2>
              </div>
              <p className="text-gray-600">Create and manage promotional codes and discounts</p>
            </Link>

            {/* Manage Users */}
            <Link 
              href="/admin/users"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-lg p-3 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">Manage Users</h2>
              </div>
              <p className="text-gray-600">View and manage user accounts and permissions</p>
            </Link>

            {/* View Bookings */}
            <Link 
              href="/admin/bookings"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-lg p-3 group-hover:bg-red-200 transition-colors">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">View Bookings</h2>
              </div>
              <p className="text-gray-600">View all ticket bookings and reservations</p>
            </Link>

            {/* Reports */}
            <Link 
              href="/admin/reports"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 rounded-lg p-3 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">Reports</h2>
              </div>
              <p className="text-gray-600">View analytics and generate reports</p>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">--</p>
                <p className="text-gray-600 mt-1">Active Movies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">--</p>
                <p className="text-gray-600 mt-1">Today's Showtimes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">--</p>
                <p className="text-gray-600 mt-1">Active Promotions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">--</p>
                <p className="text-gray-600 mt-1">Total Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}
