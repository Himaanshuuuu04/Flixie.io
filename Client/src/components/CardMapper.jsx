import React, { useState, useEffect } from "react";
import Card from "./Card";

export default function CardMapper() {
  const [movies, setMovies] = useState([]); // State to store movies
  const TMDB_API_KEY = import.meta.env.VITE_API_KEY; // Replace with your TMDB API Key
  const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  // Fetch latest movies from the API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&region=US`
        );
        const data = await response.json();
        if (data && data.results) {
          setMovies(data.results); // Store the fetched movies in state
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
      {movies.map((movie) => (
        <Card
          key={movie.id}
          id={movie.id}
          img={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // TMDB poster URL
          title={movie.title}
          link={`/movie/${movie.id}`} // You can customize this link
        />
      ))}
    </div>
  );
}
