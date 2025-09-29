'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie, showTimes = ['1:00 PM', '4:00 PM', '7:00 PM'] }) {
  const handleShowtimeClick = (showtime, e) => {
    e.preventDefault();
    // Navigate to booking page with movie and showtime
    window.location.href = `/booking?movie=${encodeURIComponent(movie.title)}&movieId=${movie.id}&showtime=${encodeURIComponent(showtime)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] bg-gray-100">
        <Link href={`/movie/${movie.id}`}>
          {movie.poster_url && movie.poster_url !== 'N/A' ? (
            <Image
              src={movie.poster_url}
              alt={movie.title}
              fill
              className="object-contain cursor-pointer hover:scale-102 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center cursor-pointer">
              <span className="text-gray-500 text-lg">No Image</span>
            </div>
          )}
        </Link>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-red-600 cursor-pointer line-clamp-2">
            {movie.title}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-2">
            {movie.year}
          </span>
          {movie.rating && movie.rating !== 'N/A' && (
            <span className="text-yellow-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {movie.rating}
            </span>
          )}
        </div>

        {movie.genre && movie.genre !== 'N/A' && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">
            {movie.genre}
          </p>
        )}

        {/* Showtimes only show for currently running movies */}
        {movie.is_running && !movie.is_coming_soon && (
          <div className="border-t pt-3">
            <p className="text-sm font-semibold text-gray-800 mb-2">Showtimes:</p>
            <div className="flex flex-wrap gap-2">
              {showTimes.map((time) => (
                <button
                  key={time}
                  onClick={(e) => handleShowtimeClick(time, e)}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon!!!!!!! */}
        {movie.is_coming_soon && (
          <div className="border-t pt-3">
            <div className="bg-blue-100 text-blue-800 text-sm px-3 py-2 rounded text-center font-semibold">
              Coming Soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}