import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Loader from "../Loading";
import {
  ClockIcon,
  StarIcon,
  CalendarIcon,
  FilmIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useLikedMoviesContext } from "../contextAPI/LikeContext";




const API_KEY_TMDB = import.meta.env.VITE_API_KEY;
const VIDSRCS_ME_API = "https://vidsrc.xyz/embed/movie?tmdb=";

const Moviedetails = () => { 
  const { likedMovies, addLikedMovie,removeLikedMovie } = useLikedMoviesContext(); // Access the context
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isLiked, setIsLiked] = useState(false); // State for dynamic liked status

  const toggleLike = () => {
    const movieId = id; // Use id directly as a string
    if (likedMovies.includes(movieId)) {
      removeLikedMovie(movieId); // Remove the movie from likedMovies
      setIsLiked(false); // Update state immediately
    } else {
      addLikedMovie(movieId); // Add the movie to likedMovies
      setIsLiked(true); // Update state immediately
    }
  };
  
  useEffect(() => {
    // Update the liked state whenever likedMovies or movieDetails change
    if (movieDetails && likedMovies) {
      setIsLiked(likedMovies.includes(movieDetails.id.toString())); // Ensure movieDetails.id is a string
    }
  }, [movieDetails, likedMovies]);
  
  
  

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY_TMDB}&append_to_response=videos,credits,reviews`
        );
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

    fetchMovieDetails();
  }, [id]);

  

  if (loading) {
    return <Loader />;
  }

  if (!movieDetails) {
    return <div className="text-white text-center mt-10">Movie not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-y-auto ">
    <div className="bg-white/10 backdrop-blur-3xl border-2 border-white/20 h-auto md:h-[90vh] md:w-[95vw] md:m-10 m-5 flex flex-col md:flex-row rounded-2xl relative md:overflow-hidden">
      {/* Left Column */}
      <div className="w-full md:w-1/2 h-48 md:h-full">
        {trailerUrl ? (
          <iframe
            src={trailerUrl}
            title="Movie Trailer"
            className="w-full h-full rounded-t-2xl md:rounded-none z-40"
            allowFullScreen
            loading="eager"
            allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className="w-full h-full rounded-t-2xl md:rounded-none object-cover"
          />
        )}
      </div>

      {/* Right Column */}
      <div className="flex flex-col p-4 md:p-8 gap-6 w-full md:w-1/2 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{movieDetails.title}</h1>
        <div className="flex gap-4 -mt-2">
          <a
            href={VIDSRCS_ME_API + movieDetails.id}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-2xl shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-500 focus:outline-none duration-200 ease-in-out"
          >
            <svg
              className="w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3l14 9-14 9V3z"
              ></path>
            </svg>
            <span className="text-sm -mb-1 text-white">Watch Now</span>
          </a>

          <button
            onClick={() => toggleLike(movieDetails.id)}
            className={`flex items-center py-2 px-4 rounded-2xl shadow-sm transition-transform transform hover:scale-105 focus:outline-none duration-200 ease-in-out ${
              isLiked ? "bg-red-500 text-white" : "bg-white/10 border border-white/20 text-white"
            }`}
          >
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C12.09 3.81 13.76 3 15.5 3 18.58 3 21 5.42 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              ></path>
            </svg>
            <span className="text-sm -mb-1">{isLiked ? "Liked" : "Like"}</span>
          </button>
        </div>

        <p className="text-white text-base font-light">
          <strong>Overview :</strong> {movieDetails.overview}
        </p>
        <hr />
        <div className="flex flex-col gap-2">
          <p className="text-white text-base font-thin flex items-center">
            <FilmIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Genres : </strong> {movieDetails.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p className="text-white text-base font-thin flex items-center ">
            <CalendarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Release Date : </strong> {movieDetails.release_date}
          </p>
          <p className="text-white text-base font-thin flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Runtime : </strong> {movieDetails.runtime} minutes
          </p>
          <p className="text-white text-base font-thin flex items-center">
            <StarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Rating : </strong> {movieDetails.vote_average} / 10 ({movieDetails.vote_count} votes)
          </p>
          <p className="text-white text-base font-thin flex items-center">
              <StarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Rating : </strong> {movieDetails.vote_average} / 10
            </p>
            <p className="text-white text-base font-thin flex items-center">
              <UserIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Reviews : </strong> {movieDetails.reviews.total_results} review(s)
            </p>
          </div>

          {/* Cast */}
          <div>
            <h2 className="text-white text-xl font-semibold">Cast:</h2>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              {movieDetails.credits.cast.length === 0 ? (
                <p className="text-white">No cast information available.</p>
              ) : (
                movieDetails.credits.cast.slice(0, 5).map((cast) => (
                  <div
                    key={cast.id}
                    className="bg-white/10 border border-white/20 rounded-2xl p-2 flex flex-col items-center w-[120px] sm:w-[140px] md:w-[100px]"
                  >
                    {cast.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                        alt={cast.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 rounded-full object-cover"
                      />
                    ) : (
                     
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 bg-gray-400 rounded-full" />
                    )}
                    <p className="text-white text-xs sm:text-sm md:text-base mt-2 text-center">
                      {cast.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
     
       {/* Back Button */}
    <svg
      className="bg-white/20 md:w-8 md:h-8 w-8 h-8 absolute top-3 right-8 cursor-pointer rounded-full p-2 z-50 hidden md:flex"
      onClick={() => navigate(-1)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path
        className="fill-white"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z"
      ></path>
    </svg>
    </div>
    
  </div>
  );
};

export default Moviedetails;
