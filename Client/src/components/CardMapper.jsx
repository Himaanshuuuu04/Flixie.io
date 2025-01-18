import React, { useState, useEffect } from "react";
import Card from "./Card";
import SkeletonLoaderCard from "./SkeletonLoaderCard";
import {setPage,fetchHomePageMovies} from "./Redux/Slice/searchSlice";
import {useDispatch,useSelector,shallowEqual} from "react-redux";

export default function CardMapper() {
  const dispatch = useDispatch();
  const { homePageMovies, loading, hasMore, page } = useSelector(
    (state) => state.search,
    shallowEqual // Prevents unnecessary re-renders if values are the same
  );
  

  // const [movies, setMovies] = useState([]); // State to store movies
  // const [page, setPage] = useState(1); // State for pagination
  // const [loading, setLoading] = useState(false); // To handle loading state
  // const [hasMore, setHasMore] = useState(true); // To check if there are more movies
  // const TMDB_API_KEY = import.meta.env.VITE_API_KEY; // Replace with your TMDB API Key
  // const TMDB_BASE_URL = "https://api.themoviedb.org/3";

  // Fetch movies from the API
  // const fetchMovies = async (page) => {
  //   if (loading) return; // Prevent fetching while loading
  //   setLoading(true); // Set loading state to true
  //   try {
  //     const response = await fetch(
  //       `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  //     );
  //     const data = await response.json();
  //     if (data && data.results) {
  //       setMovies((prevMovies) => [...prevMovies, ...data.results]); // Append new movies to the list
  //       setHasMore(data.page < data.total_pages); // Check if there are more pages
  //     }
  //   } catch (error) {
  //     console.error("Error fetching movies:", error);
  //   } finally {
  //     setLoading(false); // Set loading state to false
  //   }
  // };

  // Fetch movies when the page state changes
 
  useEffect(() => {
    const now = Date.now();
    if (!loading  && homePageMovies.length === 0) { // Throttle by 2 second
      console.log('Fetching CardMapper Movies...',Math.random());
      dispatch(fetchHomePageMovies(page));
    }
  }, []);

  
  const loadMoreMovies = () => {
    if (!loading && hasMore) {
      
      dispatch(setPage(page + 1));
      dispatch(fetchHomePageMovies(page + 1));
    }
  };
  console.log('Loading more movies...' ,Math.random());
  


  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-5 justify-items-center ">
        {/* Display skeletons when loading */}
        

        {/* Display actual movie cards */}
        {!loading && homePageMovies.length > 0 &&
          homePageMovies.map((movie) => (
            <Card
              key={movie.id+Math.random()} // Ensure key is unique
              id={movie.id}
              img={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              title={movie.title}
              link={`/movie/${movie.id}`}
              year={movie.release_date}
              rating={movie.vote_average}
              media_type="movie" // Customize this link
            />
          ))}
      
      {loading &&
          Array.from({ length: 21 }).map((_, index) => (
            <SkeletonLoaderCard key={index} />
          ))}
      </div>

      
      {/* Show load more button when there's more content to load */}
      {hasMore && !loading && (
        <div className="text-center mt-8 md:mb-0 mb-10">
          <button
            onClick={loadMoreMovies}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/40 transition duration-300 ease-in-out backdrop-blur-2xl"
          >
            Load More
          </button>
        </div>
      )}

      {/* Show message when no more movies to load */}
      {!hasMore && !loading && (
        <div className="text-center my-4 text-gray-500">No more movies to load.</div>
      )}
    </div>
  );
}
