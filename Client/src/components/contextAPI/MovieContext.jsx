// src/contexts/MovieContext.js
import React, { createContext, useState, useContext } from 'react';
// Create a context
const MovieContext = createContext();

// Provider component
export const MovieProvider = ({ children }) => {
    
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const[searchActive,setSearchActive] = useState(false);

    const fetchData = async (term) => {
        if (!term.trim()) return; // Prevent empty search
        setLoading(true);
        const url = `https://api.themoviedb.org/3/search/movie?query=${term}&include_adult=false&language=en-US&region=US&page=1&with_original_language=en`;

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
            setMovies(data.results || []); // Update movies state with results
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MovieContext.Provider value={{ movies, loading, setSearchTerm, fetchData,searchTerm,searchActive,setSearchActive }}>
            {children}
        </MovieContext.Provider>
    );
};


export const useMovieContext = () => useContext(MovieContext);
