import React, { useEffect } from 'react';
import { useGenreContext } from './contextAPI/GenreContext';
import Loader from './Loading'; // Assuming you have a Loader component

const GenreResults = ({ genreId }) => {
  const { moviesByGenre, loading,  } = useGenreContext();

  

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {moviesByGenre.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-5 mt-5">
              {moviesByGenre.map((movie) =>
                movie.poster_path ? (
                  <div
                    key={movie.id}
                    className="bg-white/10 rounded-2xl text-white border-2 border-white/20 overflow-hidden backdrop-filter backdrop-blur-3xl shadow-xl"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      alt={movie.title || 'Untitled'}
                      className="h-[70%] w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = ''; // Set fallback behavior for broken images
                        e.currentTarget.classList.add('hidden');
                      }}
                    />
                    <div className="p-4 bg-white/10 h-[30%] flex flex-col justify-between">
                      {/* Title */}
                      <h3
                        className="font-bold truncate max-w-full"
                        title={movie.title || 'Untitled'} // Tooltip for full title
                      >
                        {movie.title || 'Untitled'}
                      </h3>

                      {/* Release Year */}
                      <p className="text-sm opacity-60">
                        Year: {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                      </p>

                      {/* Rating */}
                      <p className="text-sm opacity-60">Rating: {movie.vote_average || 'N/A'}</p>

                      {/* Overview */}
                      <p
                        className="text-xs opacity-50 truncate"
                        title={movie.overview || 'No overview available'} // Tooltip for full overview
                      >
                        {movie.overview
                          ? movie.overview.substring(0, 60) + '...'
                          : 'No overview available'}
                      </p>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-white">No results found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default GenreResults;
