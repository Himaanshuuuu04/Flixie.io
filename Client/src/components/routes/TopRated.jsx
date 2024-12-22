import React, { useEffect, useState } from "react";
import Card from "../Card";
import SkeletonLoaderCard from "../SkeletonLoaderCard";



import NavBar from "../NavBar";
import TopBar from "../TopBar";

const TopRated = () => {


  useEffect(() => {
    if (!searchTerm) {
      setSearchActive(false);
    }
  }, [searchTerm]);

  const [movies, setMovies] = useState([]); // Store movies
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // To check if more pages are available

  const API_URL = "https://api.themoviedb.org/3/movie/top_rated";
  const API_KEY = import.meta.env.VITE_API_KEY; // Replace with your TMDB API key

  // Fetch movies using fetch API
  const fetchMovies = async (page) => {
    try {
      const response = await fetch(`${API_URL}?api_key=${API_KEY}&language=en-US&page=${page}`);
      const data = await response.json();
      console.log('API Response:', data); // Log the API response
      const newMovies = data.results;
  
      if (newMovies.length === 0) {
        setHasMore(false);
      }
  
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Infinite scroll logic
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 // Adjust threshold to trigger load when near the bottom
    ) {
      setPage((prevPage) => prevPage + 1); // Increment page for next fetch
    }
  };

  // Fetch movies on page change
  useEffect(() => {
    fetchMovies(page); // Fetch movies whenever the page number changes
  }, [page]);

  // Add and clean up scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup scroll listener on component unmount
  }, []);

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full w-full">
        {/* Sticky NavBar */}
        <div className="sticky top-0 h-screen flex-shrink-0 z-50">
          <NavBar />
        </div>
        {/* Main Content */}
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="mt-10 mb-10 flex flex-col gap-10 px-5">
            <TopBar />
            <h1 className="text-center text-xl font-bold my-4">Top Rated Movies</h1>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
              {/* Check if movies are loading or empty */}
              {loading
                ? Array(5)
                    .fill()
                    .map((_, idx) => <SkeletonLoaderCard key={idx} />) // Show skeleton loaders while loading
                : movies.map((movie) => (
                    <Card
                      key={`${movie.id}-${movie.title}`} // Ensuring the key is unique
                      id={movie.id}
                      img={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "https://via.placeholder.com/500x750"
                      }
                      title={movie.title || "Untitled"}
                      link={`/movie/${movie.id}`}
                    />
                  ))}
            </div>
            {/* Show message if no more movies */}
            {!hasMore && (
              <div className="text-center text-lg text-gray-500 mt-4">
                No more movies to load.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex flex-col h-full overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex flex-row w-full justify-around mt-5 mb-5">
          <Logo />
          <TopBar />
          <NavBar />
        </div>
        {/* Scrollable Content */}
        <div className="flex flex-col gap-5 px-5">
          <h1 className="text-center text-xl font-bold my-4">Top Rated Movies</h1>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
            {/* Check if movies are loading or empty */}
            {loading
              ? Array(5)
                  .fill()
                  .map((_, idx) => <SkeletonLoaderCard key={idx} />) // Show skeleton loaders while loading
              : movies.map((movie) => (
                  <Card
                    key={`${movie.id}-${movie.title}`} // Ensuring the key is unique
                    id={movie.id}
                    img={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750"
                    }
                    title={movie.title || "Untitled"}
                    link={`/movie/${movie.id}`}
                  />
                ))}
          </div>
          {/* Show message if no more movies */}
          {!hasMore && (
            <div className="text-center text-lg text-gray-500 mt-4">
              No more movies to load.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRated;

