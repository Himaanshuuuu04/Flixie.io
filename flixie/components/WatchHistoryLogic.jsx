import React, { useEffect } from "react";
import Card from "./Card";
import SkeletonLoaderCard from "./SkeletonLoaderCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesPoster } from "./Redux/Slice/searchSlice";
export default function WatchHistoryLogic() {
  const dispatch = useDispatch();
  const watchedMovies = useSelector((state) => state.like.watchedMovies);
  const likeLoading = useSelector((state) => state.like.loading);
  const movies = useSelector((state) => state.search.movies);
  const searchLoading = useSelector((state) => state.search.loading);

  useEffect(() => {
    dispatch(fetchMoviesPoster({ movies: watchedMovies }));
  }, [watchedMovies, dispatch]); // Trigger fetch when likedMovies changes

  const addMediaType = (movies) => {
    return movies.map((movie) => {
      const watchedMovie = watchedMovies.find(
        (watched) => watched.movieId == movie.id,
      );
      return {
        ...movie,
        media_type: watchedMovie?.type,
        playedOn: watchedMovie?.playedOn,
      };
    });
  };

  return (
    <>
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
              key={`${movie.id}-${movie.media_type || "movie"}-${movie.playedOn || "watched"}`}
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
              playedOn={movie.playedOn || null}
            />
          ))}
        </div>
      )}
    </>
  );
}
