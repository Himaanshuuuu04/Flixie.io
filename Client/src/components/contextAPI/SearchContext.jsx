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
    const [searchActive,setSearchActive] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [carouselMovies,setCarouselMovies]= useState([]);
    const [topRatedMovies,setTopRatedMovies]= useState([]);
    
   

    const fetchData = async (term) => {
        if (!term.trim()) return;
        const searchTerm = term.replaceAll(' ', '%20');
       
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
             // Update movies state with results
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
            if (!likedMovies || likedMovies.length === 0) {
                setMovies([]); // Ensure the state is cleared
                setLoading(false);
                return;
            }
    
            // Create an array of promises to fetch each movie by its ID and type
            const moviePromises = likedMovies.map(({ movieId, type }) => {
                const url = `https://api.themoviedb.org/3/${type}/${movieId}`;
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                    },
                };
                return fetch(url, options)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch movie with ID ${movieId}`);
                        }
                        return response.json();
                    })
                    .catch((error) => {
                        console.error(`Error fetching movie ID ${movieId}:`, error);
                        return null; // Return null for failed fetches
                    });
            });
    
            // Wait for all promises to resolve
            const fetchedMovies = await Promise.all(moviePromises);
    
            // Filter out any invalid movie data (e.g., failed fetches)
            const validMovies = fetchedMovies.filter((movie) => movie && movie.id);
    
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
        const url = 'https://api.themoviedb.org/3/trending/all/day?language=en-US';
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
      const fetchTopRatedMovies = async (userOptions = {}, page = 1) => {
        if (loading) return; // Prevent duplicate requests
        setLoading(true);
    
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = `0${date.getMonth() + 1}`.slice(-2);
            const day = `0${date.getDate()}`.slice(-2);
            return `${year}-${month}-${day}`;
        };
    
        const defaultOptions = {
            include_adult: false,
            include_video: false,
            language: "en-US",
            sort_by: "vote_average.desc",
            vote_count: "5000",
            primary_release_date: {
                gte: "2010-01-01",
                lte: formatDate(new Date()),
            },
            with_genres: "",
        };
    
        const options = {
            ...defaultOptions,
            ...userOptions,
            primary_release_date: {
                ...defaultOptions.primary_release_date,
                ...userOptions.primary_release_date,
            },
        };
    
        if (options.with_genres) {
            options.with_genres = options.with_genres.replace(/,/g, "%2C");
        }
    
        const queryParams = new URLSearchParams({
            page,
            include_adult: options.include_adult,
            include_video: options.include_video,
            language: options.language,
            sort_by: options.sort_by,
            [`vote_count.gte`]: options.vote_count,
            [`primary_release_date.gte`]: options.primary_release_date.gte,
            [`primary_release_date.lte`]: options.primary_release_date.lte,
        });
    
        if (options.with_genres) {
            queryParams.append("with_genres", options.with_genres);
        }
    
        const url = `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`;
        const fetchOptions = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        };
    
        try {
            const response = await fetch(url, fetchOptions);
            const data = await response.json();
    
            if (data.results) {
                setTopRatedMovies((prevMovies) => [...prevMovies, ...data.results]);
    
                if (page >= data.total_pages) {
                    setHasMore(false); // No more pages to fetch
                }
            } else {
                setHasMore(false); // Handle case where no results are returned
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
            setHasMore(false); // Stop loading on error
        } finally {
            setLoading(false);
        }
    };
    
    
    
    

    
    

    return (
        <SearchContext.Provider value={{ movies, loading, setSearchTerm, fetchData,searchTerm,searchActive,setSearchActive,movieDetails,fetchMovieDetails,trailerUrl,fetchMovies,carouselMovies,CarouselFetchMovies,topRatedMovies,fetchTopRatedMovies }}>
            {children}
        </SearchContext.Provider>
    );
};


export const useSearchContext = () => useContext(SearchContext);
