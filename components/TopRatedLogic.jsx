import React, { useState } from "react";
import Card from "./Card";
import SkeletonLoaderCard from "./SkeletonLoaderCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopRatedMovies,
  setHasMore,
  setPage,
} from "./Redux/Slice/searchSlice";

export default function TopRatedLogic() {
  const dispatch = useDispatch();
  const topRatedMovies = useSelector((state) => state.search.topRatedMovies);
  const loading = useSelector((state) => state.search.loading);
  const hasMore = useSelector((state) => state.search.hasMore);
  const page = useSelector((state) => state.search.page);

  // State to handle user inputs
  const [userInputs, setUserInputs] = useState({
    sort_by: "vote_average.desc",
    vote_count: "5000",
    start_date: "2010-01-01",
    end_date: new Date().toISOString().split("T")[0], // Current date
    with_genres: "", // New genre input
  });

  const buildTopRatedOptions = (inputs) => ({
    sort_by: inputs.sort_by,
    vote_count: inputs.vote_count,
    primary_release_date: {
      gte: inputs.start_date,
      lte: inputs.end_date,
    },
    with_genres: inputs.with_genres,
  });

  const fetchMovies = (overridePage = 1, inputs = userInputs) => {
    dispatch(fetchTopRatedMovies(buildTopRatedOptions(inputs), overridePage));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadMoreMovies = () => {
    if (hasMore && !loading) {
      dispatch(setPage(page + 1));
      fetchMovies(page + 1); // Fetch next page
    }
  };

  const handleSubmit = (e) => {
    if (loading) return;
    e.preventDefault();
    dispatch(setPage(1)); // Reset to the first page
    dispatch(setHasMore(true)); // Reset `hasMore` in case new filters allow more data
    fetchMovies(1); // Fetch with updated filters
  };

  return (
    <div className="flex flex-col items-center ">
      {/* Form for user inputs */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/20 backdrop-blur-3xl rounded-2xl shadow-lg p-4 flex flex-wrap gap-5 w-full mb-5 text-white font-light text-center"
      >
        <label className="flex flex-col items-center gap-2 flex-grow ">
          <span className="text-md">Sort By</span>
          <select
            name="sort_by"
            value={userInputs.sort_by}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20 h-full text-center"
          >
            <option value="vote_average.desc" className="text-black">
              Top Rated
            </option>
            <option value="popularity.desc" className="text-black">
              Most Popular
            </option>
            <option value="release_date.desc" className="text-black">
              Newest Releases
            </option>
          </select>
        </label>
        <label className="flex flex-col items-center gap-2 flex-grow ">
          <span className="text-md">Minimum Vote</span>
          <input
            type="number"
            name="vote_count"
            value={userInputs.vote_count}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20 h-full text-center"
          />
        </label>
        <label className="flex flex-col items-center gap-2 flex-grow ">
          <span className="text-md">From</span>
          <input
            type="date"
            name="start_date"
            value={userInputs.start_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20 h-full text-center"
          />
        </label>
        <label className="flex flex-col items-center gap-2 flex-grow ">
          <span className="text-md">Till</span>
          <input
            type="date"
            name="end_date"
            value={userInputs.end_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20 h-full text-center"
          />
        </label>
        <label className="flex flex-col items-center gap-2 flex-grow ">
          <span className="text-md">Genre</span>
          <select
            name="with_genres"
            value={userInputs.with_genres}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20 h-full text-center transition-all duration-300 ease-in-out"
          >
            <option value="" disabled className="text-black">
              All
            </option>
            <option value="28" className="text-black">
              Action
            </option>
            <option value="12" className="text-black">
              Adventure
            </option>
            <option value="16" className="text-black">
              Animation
            </option>
            <option value="35" className="text-black">
              Comedy
            </option>
            <option value="80" className="text-black">
              Crime
            </option>
            <option value="99" className="text-black">
              Documentary
            </option>
            <option value="18" className="text-black">
              Drama
            </option>
            <option value="10751" className="text-black">
              Family
            </option>
            <option value="14" className="text-black">
              Fantasy
            </option>
            <option value="36" className="text-black">
              History
            </option>
            <option value="27" className="text-black">
              Horror
            </option>
            <option value="10402" className="text-black">
              Music
            </option>
            <option value="9648" className="text-black">
              Mystery
            </option>
            <option value="10749" className="text-black">
              Romance
            </option>
            <option value="12" className="text-black">
              Science Fiction
            </option>
            <option value="53" className="text-black">
              Thriller
            </option>
            <option value="10752" className="text-black">
              War
            </option>
            <option value="37" className="text-black">
              Western
            </option>
          </select>
        </label>
        <button
          type="submit"
          className="bg-white/30 text-white py-2 px-4 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-300 ease-in-out"
        >
          Search
        </button>
      </form>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-5  justify-items-center w-full">
        {loading
          ? Array.from({ length: 42 }).map((_, index) => (
              <SkeletonLoaderCard key={index} />
            ))
          : topRatedMovies.map((movie) => (
              <Card
                key={`${movie.id}-${movie.media_type || "movie"}`}
                id={movie.id}
                img={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750"
                }
                title={movie.title || movie.name}
                year={movie.release_date || movie.first_air_date}
                rating={movie.vote_average}
                media_type={movie.media_type}
              />
            ))}
      </div>
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
        <div className="text-center my-4 text-gray-500">
          No more movies to load.
        </div>
      )}
    </div>
  );
}
