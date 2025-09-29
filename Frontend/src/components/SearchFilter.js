'use client'

import { useState, useEffect } from 'react'

export default function SearchFilter({ onSearch, onFilter, movies = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])

  // Extract unique genres from movies
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search movies by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Genre Filter */}
        <div className="w-full md:w-auto min-w-48">
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedGenre) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active filters display */}
      {(searchTerm || selectedGenre) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedGenre && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              Genre: {selectedGenre}
            </span>
          )}
        </div>
      )}
    </div>
  );
}