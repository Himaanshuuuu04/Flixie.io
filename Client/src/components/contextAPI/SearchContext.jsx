// src/contexts/MovieContext.js
import React, { createContext, useState, useContext } from 'react';
import { useLikedMoviesContext } from './LikeContext';
const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
    
    const { likedMovies } = useLikedMoviesContext();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const[searchActive,setSearchActive] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [carouselMovies,setCarouselMovies]= useState([]);
   

    const fetchData = async (term) => {
        if (!term.trim()) return;
        const searchTerm = term.replaceAll(' ', '%20');
        console.log(searchTerm); // Prevent empty search
        setLoading(true);
        const url = `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=1`;

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
            setMovies(data.results || []);
            console.log(data.results || []); // Update movies state with results
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const fetchMovieDetails = async (id,mediaType) => {
    
        setLoading(true);
        const url = `https://api.themoviedb.org/3/${mediaType}/${id}?append_to_response=videos,credits,reviews`;
    
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        };
    
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setMovieDetails(data);
            console.log(data);
            const trailers = data.videos.results.filter(
                (video) => video.type === "Trailer" && video.site === "YouTube"
            );
            if (trailers.length > 0) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailers[0].key}?autoplay=1&mute=1`);
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        } finally {
            setLoading(false);
        }
    };




    const fetchMovies = async () => {
        setLoading(true);
    
        try {
            // If there are no liked movie IDs, return early
            if (likedMovies.length === 0) {
                setLoading(false);
                return;
            }
    
            // Create an array of promises to fetch each movie by its ID
            const moviePromises = likedMovies.map((movieId) => {
                const url = `https://api.themoviedb.org/3/movie/${movieId}`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                };
                return fetch(url, options).then((response) => response.json());
            });
    
            // Wait for all promises to resolve
            const fetchedMovies = await Promise.all(moviePromises);
    
            // Filter out any invalid movie data (e.g., failed fetches)
            const validMovies = fetchedMovies.filter((movie) => movie.id);
    
            // Update the state with the fetched movies
            setMovies(validMovies);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };


    const CarouselFetchMovies = async () => {
        setLoading(true);
        const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },};
        try {
                const response = await fetch(url, options);
                const data = await response.json();
                if (data && Array.isArray(data.results)) {
                    setCarouselMovies(data.results);
                } else {
                console.warn('No movies found or data format is incorrect.');
                }
        } catch (error) {
                console.error("Error fetching movie details:", error);
        } finally {
                setLoading(false);
        }
      };
      const topRatedFetchMovies = async () => {
        setLoading(true);
        const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },};
        try {
                const response = await fetch(url, options);
                const data = await response.json();
                if (data && Array.isArray(data.results)) {
                    setCarouselMovies(data.results);
                } else {
                console.warn('No movies found or data format is incorrect.');
                }
        } catch (error) {
                console.error("Error fetching movie details:", error);
        } finally {
                setLoading(false);
        }
      };

    
    

    return (
        <SearchContext.Provider value={{ movies, loading, setSearchTerm, fetchData,searchTerm,searchActive,setSearchActive,movieDetails,fetchMovieDetails,trailerUrl,fetchMovies,carouselMovies,CarouselFetchMovies }}>
            {children}
        </SearchContext.Provider>
    );
};


export const useSearchContext = () => useContext(SearchContext);
