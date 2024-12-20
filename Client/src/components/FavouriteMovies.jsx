import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useLikedMoviesContext } from "./contextAPI/LikeContext";

export default function FavouriteMovies() {
  const { likedMovies } = useLikedMoviesContext(); // Get liked movie IDs from context
  const [movies, setMovies] = useState([]); // State to hold fetched movie data
  const TMDB_API_KEY = import.meta.env.VITE_API_KEY; // Fetch the TMDB API key from environment variables
  const TMDB_BASE_URL = "https://api.themoviedb.org/3"; // TMDB API base URL

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // If there are no liked movie IDs, return early
        if (likedMovies.length === 0) return;

        // Create an array of promises to fetch each movie by its ID
        const moviePromises = likedMovies.map((movieId) =>
          fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`)
            .then((response) => response.json())
        );

        // Wait for all promises to resolve
        const fetchedMovies = await Promise.all(moviePromises);

        // Filter out any invalid movie data (e.g., failed fetches)
        const validMovies = fetchedMovies.filter((movie) => movie.id);

        // Update the state with the fetched movies
        setMovies(validMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [likedMovies, TMDB_API_KEY, TMDB_BASE_URL]); // Trigger fetch when likedMovies changes

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
        <p className="text-center col-span-full text-gray-500">No favourite movies found!</p>
      )}
    </div>
  );
}
