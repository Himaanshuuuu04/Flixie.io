import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useLikedMoviesContext } from "./contextAPI/LikeContext";
import { useSearchContext } from "./contextAPI/SearchContext";
import Loader from "./Loading";
import SkeletonLoaderCard from "./SkeletonLoaderCard";
export default function FavouriteMovies() {
  const { likedMovies } = useLikedMoviesContext(); 
  const {movies,fetchMovies,loading}=useSearchContext();

  useEffect(() => {
        fetchMovies();
  }, [likedMovies]); // Trigger fetch when likedMovies changes

 
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <Card
            key={movie.id}
            id={movie.id}
            img={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750"}
            title={movie.title || "Untitled"}
            link={`/movie/${movie.id}`}
          />
        ))
      ) : (
        <>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonLoaderCard key={index} />
        ))}

        </>
      )}
    </div>
  );
}
