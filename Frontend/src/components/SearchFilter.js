'use client'

import { useState, useEffect } from 'react'

export default function SearchFilter({ onSearch, onFilter, movies = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (movies.length > 0) {
      const uniqueGenres = [...new Set(
        movies
          .map(movie => movie.genre)
          .filter(genre => genre && genre !== 'N/A')
          .flatMap(genre => genre.split(', '))
      )].sort();
      setGenres(uniqueGenres);
    }
  }, [movies]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    onFilter(genre);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    onSearch('');
    onFilter('');
  };

  return (
    <div className="rounded-2xl">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:w-auto">
          <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl blur opacity-0 transition-opacity duration-300 ${isFocused ? 'opacity-50' : ''}`}></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-5 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Genre Filter */}
        <div className="w-full md:w-auto min-w-52">
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="w-full px-5 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
            >
              <option value="" className="bg-gray-900">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-gray-900">
                  {genre}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Clear Button */}
        {(searchTerm || selectedGenre) && (
          <button
            onClick={clearFilters}
            className="px-5 py-3.5 bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white rounded-xl transition-all duration-300 whitespace-nowrap flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedGenre) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="bg-red-600/20 text-red-400 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border border-red-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              "{searchTerm}"
            </span>
          )}
          {selectedGenre && (
            <span className="bg-purple-600/20 text-purple-400 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border border-purple-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2m10 2V2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
              {selectedGenre}
            </span>
          )}
        </div>
      )}
    </div>
  );
}