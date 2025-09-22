'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top bar with promotions */}
        <div className="hidden md:block bg-red-600 text-center py-1 text-sm">
          <span>🎬 Get AMC Stubs A-List for just $19.95/month - Watch up to 3 movies per week!</span>
        </div>

        {/* Main navigation */}
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-red-500 mr-8">
              🎬 MovieTheater
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#movies" className="hover:text-red-400 transition-colors font-medium">
              Movies
            </a>
            <a href="#theatres" className="hover:text-red-400 transition-colors font-medium">
              Theatres
            </a>
            <a href="#food" className="hover:text-red-400 transition-colors font-medium">
              Food & Drinks
            </a>
            <a href="#rewards" className="hover:text-red-400 transition-colors font-medium">
              Rewards
            </a>
            <a href="#on-demand" className="hover:text-red-400 transition-colors font-medium">
              On Demand
            </a>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white text-black p-4 rounded-lg shadow-lg">
                  <input
                    type="text"
                    placeholder="Search movies, theatres..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            {/* Location */}
            <button className="hidden md:flex items-center space-x-1 hover:text-red-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Atlanta, GA</span>
            </button>

            {/* Sign In */}
            <button className="hidden md:block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-medium transition-colors">
              Sign In
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gray-900 rounded-lg mb-4 overflow-hidden">
            <div className="py-2">
              <a href="#movies" className="block px-4 py-3 hover:bg-gray-800 transition-colors">
                Movies
              </a>
              <a href="#theatres" className="block px-4 py-3 hover:bg-gray-800 transition-colors">
                Theatres
              </a>
              <a href="#food" className="block px-4 py-3 hover:bg-gray-800 transition-colors">
                Food & Drinks
              </a>
              <a href="#rewards" className="block px-4 py-3 hover:bg-gray-800 transition-colors">
                Rewards
              </a>
              <a href="#on-demand" className="block px-4 py-3 hover:bg-gray-800 transition-colors">
                On Demand
              </a>
              <div className="border-t border-gray-700 mt-2 pt-2">
                <button className="block w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors">
                  📍 Atlanta, GA
                </button>
                <button className="block w-full text-left px-4 py-3 bg-red-600 hover:bg-red-700 transition-colors">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}