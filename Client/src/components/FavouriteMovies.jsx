import React, { useState, useEffect } from "react";
import Card from "./Card";

export default function FavouriteMovies() {
  const [movies, setMovies] = useState([]);
  const TMDB_API_KEY = import.meta.env.VITE_API_KEY;
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const storedLikedIds = JSON.parse(localStorage.getItem("likedMovies")) || [];
        if (storedLikedIds.length === 0) return;

        const response = await fetch(
          `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();

        if (data && data.results) {
          const filteredMovies = data.results.filter((movie) =>
            storedLikedIds.includes(movie.id)
          );
          setMovies(filteredMovies);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

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
