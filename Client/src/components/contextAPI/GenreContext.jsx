import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Genre context
const GenreContext = createContext();

// Provider component
export const GenreProvider = ({ children }) => {
    
    const [moviesByGenre, setMoviesByGenre] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMoviesByGenre = async (genreId) => {
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
            const data = await res.json();
            setMoviesByGenre(data.results || []);
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

// Custom hook to use the Genre context
export const useGenreContext = () => useContext(GenreContext);
