import React, { useState, useEffect } from "react";
import Card from "./Card";
import { useSearchContext } from "./contextAPI/SearchContext";
import SkeletonLoaderCard from "./SkeletonLoaderCard";

export default function TopRatedLogic() {
  const { topRatedMovies, fetchTopRatedMovies, loading } = useSearchContext();

  // State to handle user inputs
  const [userInputs, setUserInputs] = useState({
    sort_by: "vote_average.desc",
    vote_count: "1000",
    start_date: "2010-01-01",
    end_date: new Date().toISOString().split("T")[0], // Current date
    with_genres: "", // New genre input
  });
    

  // Fetch movies on component load with default inputs
  useEffect(() => {
    fetchTopRatedMovies({
      sort_by: userInputs.sort_by,
      vote_count: userInputs.vote_count,
      primary_release_date: {
        gte: userInputs.start_date,
        lte: userInputs.end_date,
      },
      with_genres: userInputs.with_genres,
    });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTopRatedMovies({
      sort_by: userInputs.sort_by,
      vote_count: userInputs.vote_count,
      primary_release_date: {
        gte: userInputs.start_date,
        lte: userInputs.end_date,
      },
      with_genres: userInputs.with_genres,
    });
  };

  return (
    <div className="flex flex-col items-center">
      {/* Form for user inputs */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/20 backdrop-blur-3xl rounded-2xl shadow-lg p-4 flex flex-wrap gap-5 w-full mb-5 text-white font-light"
      >
        <label className="flex flex-col items-center gap-2">
          <span className="text-md">Sort By</span>
          <select
            name="sort_by"
            value={userInputs.sort_by}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20"
          >
            <option value="vote_average.desc">Top Rated</option>
            <option value="popularity.desc">Most Popular</option>
            <option value="release_date.desc">Newest Releases</option>
          </select>
        </label>
        <label className="flex flex-col items-center gap-2">
          <span className="text-md">Minimum Vote</span>
          <input
            type="number"
            name="vote_count"
            value={userInputs.vote_count}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20"
          />
        </label>
        <label className="flex flex-col items-center gap-2">
          <span className="text-md">From</span>
          <input
            type="date"
            name="start_date"
            value={userInputs.start_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20"
          />
        </label>
        <label className="flex flex-col items-center gap-2">
          <span className="text-md">Till</span>
          <input
            type="date"
            name="end_date"
            value={userInputs.end_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20"
          />
        </label>
        <label className="flex flex-col items-center gap-2">
          <span className="text-md">Genre</span>
          <select
            name="with_genres"
            value={userInputs.with_genres   }
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-white/50 bg-black/20 border-white/20"
          >
            <option value="" disabled>All</option>
            <option value="28">Action</option>
            <option value="12">Adventure</option>
            <option value="16">Animation</option>
            <option value="35">Comedy</option>
            <option value="80">Crime</option>
            <option value="99">Documentary</option>
            <option value="18">Drama</option>
            <option value="10751">Family</option>
            <option value="14">Fantasy</option>
            <option value="36">History</option>
            <option value="27">Horror</option>
            <option value="10402">Horror</option>
            <option value="9648">Mystery</option>
            <option value="10749">Romance</option>
            <option value="12">Science Fiction</option>
            <option value="53">Thriller</option>
            <option value="10752">War</option>
            <option value="37">Western</option>
          </select>
        </label>
        
        
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Movies
        </button>
      </form>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 md:gap-5 justify-items-center">
        {loading ? (
          <>
            {Array.from({ length: 20 }).map((_, index) => (
              <SkeletonLoaderCard key={index} />
            ))}
          </>
        ) : (
          topRatedMovies.map((movie) => (
            <Card
              key={movie.id}
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
          ))
        )}
      </div>
    </div>
  );
}

