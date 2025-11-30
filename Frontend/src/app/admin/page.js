"use client";

import AdminRoute from "@/components/AdminRoute";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to Homepage
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600">
              Welcome,{" "}
              {user?.user_metadata?.first_name || user?.email?.split("@")[0]}
            </p>
          </div>
          {/* Admin Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Manage Movies */}
            <Link
              href="/admin/movies"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">
                  Manage Movies
                </h2>
              </div>
              <p className="text-gray-600">
                Add, edit, and remove movies from the catalog
              </p>
            </Link>

            {/* Manage Showrooms */}
            <Link
              href="/admin/showtimes"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">
                  Manage Showrooms
                </h2>
              </div>
              <p className="text-gray-600">
                Create and configure theater showrooms with seat layouts
              </p>
            </Link>

            {/* Schedule Showtimes */}
            <Link
              href="/admin/schedule"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 rounded-lg p-3 group-hover:bg-teal-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">
                  Schedule Showtimes
                </h2>
              </div>
              <p className="text-gray-600">
                Assign movies to showrooms with specific showtimes
              </p>
            </Link>

            {/* Manage Promotions */}
            <Link
              href="/admin/promotions"
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 ml-4">
                  Manage Promotions
                </h2>
              </div>
              <p className="text-gray-600">
                Create and manage promotional codes and discounts
              </p>
            </Link>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
