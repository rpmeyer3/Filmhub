'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAdmin, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold group">
              <span className="text-gradient group-hover:opacity-80 transition-opacity">Film-Hub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 bg-gray-800/50 hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-14 w-80 glass-dark p-4 rounded-2xl shadow-2xl border border-gray-700/50 animate-modal-pop">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Location */}
            <button className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-xl transition-all duration-300">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-300">Athens, GA</span>
            </button>

            {/* User Menu */}
            {!loading && (
              <div className="hidden md:flex items-center">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-xl transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                        <span className="text-sm font-bold text-white">
                          {user.user_metadata?.first_name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-200">
                        {user.user_metadata?.first_name || user.email.split('@')[0]}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-14 w-56 glass-dark rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden animate-modal-pop">
                        {isAdmin && (
                          <>
                            <Link 
                              href="/admin" 
                              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 hover:from-blue-600/30 hover:to-purple-600/30 transition-all"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Admin Portal
                            </Link>
                            <div className="border-t border-gray-700/50"></div>
                          </>
                        )}
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <Link 
                          href="/payment-methods" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Payment Methods
                        </Link>
                        <Link 
                          href="/change-password" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Change Password
                        </Link>
                        <Link 
                          href="/profile?tab=bookings" 
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          My Bookings
                        </Link>
                        <div className="border-t border-gray-700/50"></div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-600/10 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="px-5 py-2.5 text-gray-300 hover:text-white font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-105"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 bg-gray-800/50 hover:bg-gray-700 rounded-xl transition-all"
            >
              <svg className={`w-6 h-6 text-gray-300 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass rounded-2xl mb-4 overflow-hidden animate-modal-pop border border-gray-700/50">
            <div className="py-2">
              <div className="border-t border-gray-700/50 mt-2 pt-2">
                <button className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Athens, GA
                </button>
                {!loading && (
                  user ? (
                    <div>
                      {isAdmin && (
                        <Link 
                          href="/admin" 
                          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                          Admin Portal
                        </Link>
                      )}
                      <Link 
                        href="/profile" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile ({user.user_metadata?.first_name || user.email.split('@')[0]})
                      </Link>
                      <Link 
                        href="/payment-methods" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Payment Methods
                      </Link>
                      <Link 
                        href="/change-password" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Change Password
                      </Link>
                      <Link 
                        href="/profile?tab=bookings" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut()
                          setIsMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-600/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Link
                        href="/login"
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}