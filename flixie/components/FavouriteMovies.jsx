import React, { useEffect } from "react";
import Card from "./Card";
import SkeletonLoaderCard from "./SkeletonLoaderCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesPoster } from "./Redux/Slice/searchSlice";
export default function FavouriteMovies() {
  const dispatch = useDispatch();
  const likedMovies = useSelector((state) => state.like.likedMovies);
  const movies = useSelector((state) => state.search.movies);
  const searchLoading = useSelector((state) => state.search.loading);
  const likeLoading = useSelector((state) => state.like.loading);

  useEffect(() => {
    dispatch(fetchMoviesPoster({ movies: likedMovies }));
  }, [likedMovies, dispatch]); // Trigger fetch when likedMovies changes

  const addMediaType = (movies) => {
    return movies.map((movie) => {
      const likedMovie = likedMovies.find((liked) => liked.movieId == movie.id);
      return {
        ...movie,
        media_type: likedMovie?.type,
      };
    });
  };

  return (
    <React.Fragment>
      {searchLoading || likeLoading ? (
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
              key={`${movie.id}-${movie.media_type || "movie"}`}
              id={movie.id}
              img={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750"
              }
              title={movie.title || movie.name}
              year={movie.release_date || movie.first_air_date}
              rating={movie.vote_average}
              media_type={movie.media_type}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
}
