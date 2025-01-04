import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useLikedMoviesContext } from "./contextAPI/LikeContext";
import { useSearchContext } from "./contextAPI/SearchContext";
import Loader from "./Loading";
import SkeletonLoaderCard from "./SkeletonLoaderCard";
export default function WatchHistoryLogic() {
  const { watchedMovies,loading } = useLikedMoviesContext(); 
  const {movies,fetchMovies}=useSearchContext();

  useEffect(() => {
        fetchMovies(watchedMovies);
  }, [watchedMovies]); // Trigger fetch when likedMovies changes

  const addMediaType = (movies) => {
    return movies.map((movie) => {
      const watchedMovie = watchedMovies.find((watched) => watched.movieId == movie.id);
      return {
        ...movie,
        media_type: watchedMovie?.type,
        playedOn: watchedMovie?.playedOn,
      };
    });
  };
  

  return ( 
    <> 
      {loading ? (
        // Show Skeleton Loaders when loading
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-5 justify-items-center">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonLoaderCard key={index} />
        ))}
        </div>
      ) : movies.length === 0 ? (
        // Show "No Movies Found" message if there are no movies
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h2 className="text-2xl font-semibold text-white text-center">
            No Movies Found
          </h2>
        </div>
      ) : (
        // Map through movies and display the cards
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-5 justify-items-center">
        {addMediaType(movies).map((movie) => (
        <Card
          key={movie.id}
          id={movie.id}
          img={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750"}
          title={movie.title || movie.name}
          year={movie.release_date || movie.first_air_date}
          rating={movie.vote_average}
          media_type={movie.media_type}
          playedOn={movie.playedOn || null}
        />
        ))}
        </div>
      )}
    </>
  );
}

