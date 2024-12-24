// src/components/MovieList.js
import React from 'react';

import { useSearchContext} from "./contextAPI/SearchContext.jsx"
import Loader from './Loading.jsx';
import {Link } from "react-router-dom";

function MovieResults() {
    const { movies, loading, searchTerm,setSearchActive } = useSearchContext();

    return (
        <div className="">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                <Loader/>
                </div>
            ) : (
                movies.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-5 ">
                        {movies.map((movie) => (
                            (movie.poster_path&&movie.vote_average>4) ? (
                               
                                <div
                                    key={movie.id}
                                    className="bg-white/10 rounded-2xl text-white border-2 border-white/20 overflow-hidden backdrop-filter backdrop-blur-3xl shadow-xl  hover:bg-blue-400 transition-all duration-300 "
                                    onClick={() => setSearchActive(false)}
                                >
                                <Link to={`/Moviedetails/${movie.media_type}/${movie.id}`}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                        alt={movie.title || movie.name}
                                        className="h-[70%] w-full object-cover"
                                        onError={(e) => e.currentTarget.classList.add('hidden')}
                                    />
                                    <div className="p-4 bg-white/10 h-[30%] flex flex-col justify-between">
                                        {/* Title */}
                                        <h3
                                            className="font-bold truncate max-w-full"
                                            title={movie.title || movie.name} // Tooltip for full title
                                        >
                                            {movie.title || movie.name}
                                        </h3>

                                        {/* Release Year */}
                                        <p className="text-sm opacity-60">
                                            Year: { movie.release_date || movie.first_air_date}
                                        </p>

                                        {/* Rating */}
                                        <p className="text-sm opacity-60">Rating: {movie.vote_average}</p>

                                        
                                    </div>
                                    </Link>
                                </div>
                                
                            ) : null
                        ))}
                    </div>
                )
            )}
            {movies.length === 0 && !loading && searchTerm && (
                <p className="text-white">No results found for "{searchTerm}".</p>
            )}
        </div>
    );
}

export default MovieResults;
