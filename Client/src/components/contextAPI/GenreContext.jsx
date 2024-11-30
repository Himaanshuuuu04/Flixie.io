import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; // For runtime type checking

// Create the Genre context
const GenreContext = createContext({
  moviesByGenre: [],
  loading: false,
  fetchMoviesByGenre: () => {}, // Default is an empty function
});

// Provider component
export const GenreProvider = ({ children }) => {
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMoviesByGenre = async (genreId) => {
    if (!import.meta.env.VITE_API_TOKEN) {
      console.error("API token is missing. Please add VITE_API_TOKEN to your environment variables.");
      return;
    }

    setLoading(true);
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
      },
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`API request failed with status: ${res.status}`);
      const data = await res.json();
      setMoviesByGenre(data.results || []);
      console.log(data.results || []);
    } catch (err) {
      console.error("Failed to fetch movies by genre:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenreContext.Provider value={{ moviesByGenre, loading, fetchMoviesByGenre }}>
      {children}
    </GenreContext.Provider>
  );
};

GenreProvider.propTypes = {
  children: PropTypes.node.isRequired, // Ensure `children` is passed
};

// Custom hook to use the Genre context
export const useGenreContext = () => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error("useGenreContext must be used within a GenreProvider");
  }
  return context;
};
