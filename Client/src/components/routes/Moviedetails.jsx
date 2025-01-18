import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClockIcon,
  StarIcon,
  CalendarIcon,
  FilmIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useLikedMoviesContext } from "../contextAPI/LikeContext";
const VIDSRCS_ME_API = "https://vidsrc.xyz/embed/";
import {useDispatch,useSelector} from "react-redux";
import {fetchMovieDetails} from "../Redux/Slice/searchSlice";
// import { useSearchContext } from "../contextAPI/SearchContext";
import SkeletonLoaderMoviedetails from "../SkeletonLoaderMoviedetils";

const Moviedetails = () => {
  const { likedMovies, addLikedMovie, removeLikedMovie ,watchedMovies,addWatchedMovie,} = useLikedMoviesContext();
  const { media_type, id } = useParams();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {movieDetails, trailerUrl,  loading } = useSelector((state) => state.search);

  const [isTouched, setIsTouched] = useState({
    Liked:false,
    Watched:false
  });
  // const { movieDetails, trailerUrl, fetchMovieDetails, loading } = useSearchContext();
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const toggleLike = () => {
    const movieId = id;
    const mediaType = media_type;
    const isAlreadyLiked = likedMovies.some(
      (movie) => movie.movieId === movieId && movie.type === mediaType
    );
    if (isAlreadyLiked) {
      removeLikedMovie(movieId, mediaType);
      setIsTouched(prev => ({ ...prev, Liked: true }));
    } else {
      addLikedMovie(movieId, mediaType);
      setIsTouched(prev => ({ ...prev, Liked: false }));
    }
  };

  const toggleWatch = () => {
    const movieId = id;
    const mediaType = media_type;
    const isAlreadyWatched = watchedMovies.some(
      (movie) => movie.movieId === movieId && movie.type === mediaType && movie.playedOn
    );
    if (isAlreadyWatched) {
      setIsTouched(prev => ({ ...prev, Watched: true }));
    } else {
      addWatchedMovie(movieId, mediaType);
    }
  };

  useEffect(() => {
    if (movieDetails && likedMovies) {
      const isAlreadyLiked = likedMovies.some(
        (movie) =>
          movie.movieId === movieDetails.id.toString() &&
          movie.type === media_type
      );
      setIsTouched(prev => ({ ...prev, Liked: isAlreadyLiked }));
    }
    if (movieDetails && watchedMovies) {
      const isAlreadyWatched = watchedMovies.some(
        (movie) =>
          movie.movieId === movieDetails.id.toString() &&
          movie.type === media_type &&
          movie.playedOn
      );
      setIsTouched(prev => ({ ...prev, Watched: isAlreadyWatched }));
    }

  
  }, [movieDetails, likedMovies, media_type,watchedMovies,]);

  useEffect(() => {
 
    dispatch(fetchMovieDetails({id: id, mediaType: media_type}));
  }, [id, media_type]);

  useEffect(() => {
    if (movieDetails) {
      if (movieDetails.seasons) {
        // If the media has seasons (a series), initialize state accordingly
        setSeasons(movieDetails.seasons);
        setSelectedSeason(movieDetails.seasons[0]);
        setSelectedEpisode(null);
      } else {
        // If the media is a movie, clear seasons and reset state
        setSeasons([]);
        setSelectedSeason(null);
        setSelectedEpisode(null);
      }
    }
  }, [movieDetails]);

  const handleSeasonChange = (seasonId) => {
    const season = seasons.find((s) => s.id === parseInt(seasonId));
    setSelectedSeason(season);
    setSelectedEpisode(null);
  };

  const handleEpisodeChange = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
  };

  if (loading || !movieDetails) {
    return <SkeletonLoaderMoviedetails />;
  }
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center overflow-y-auto ">
    <div className="bg-white/5 backdrop-blur-3xl border border-white/20 h-[95vh] md:h-[90vh] md:w-[95vw] md:m-10 m-5 flex flex-col md:flex-row rounded-2xl relative md:overflow-hidden overflow-auto">
      {/* Left Column */}
      <div className="w-full md:w-1/2 h-72 md:h-full border-r-0 md:border-r md:border-white/20">
        {trailerUrl ? (
          <iframe
            src={trailerUrl}
            title="Movie Trailer"
            className="w-full h-full rounded-t-2xl md:rounded-none z-40"
            allowFullScreen
            loading="earger"
            allow="accelerometer;  gyroscope; picture-in-picture"
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
      <div className="flex flex-col p-4 md:p-8 gap-6 w-full md:w-1/2 overflow-y-auto scrollbar-hide">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{movieDetails.title || movieDetails.name}</h1>
        

        <p className="text-white text-base font-light -mt-4">
          <strong>Overview :</strong> {movieDetails.overview} 
        </p>
        <div className="flex gap-4 -mt-2">
          {seasons.length > 0 && (
            <div className="flex flex-col">
              <label htmlFor="season-select" className="text-white font-light mb-1 text-sm">
                Select Season:
              </label>
              <select
                id="season-select"
                className="flex items-center bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-2xl shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-500 focus:outline-none duration-200 ease-in-out text-sm -mb-1"
                value={selectedSeason?.id || ""}
                onChange={(e) => handleSeasonChange(e.target.value)}
              >
                {seasons.map((season) => (
                  <option
                    key={season.id}
                    value={season.id}
                    className="text-white bg-black/60"
                  >
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedSeason && selectedSeason.episode_count > 0 && (
            <div className="flex flex-col">
              <label htmlFor="episode-select" className="text-white  font-light mb-1 text-sm">
                Select Episode:
              </label>
              <select
                id="episode-select"
                className="flex items-center bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-2xl shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-500 focus:outline-none duration-200 ease-in-out text-sm -mb-1"
                value={selectedEpisode || ""}
                onChange={(e) => handleEpisodeChange(e.target.value)}
              >
                {[...Array(selectedSeason.episode_count)].map((_, index) => (
                  <option
                    key={index + 1}
                    value={index + 1}
                    className="text-white bg-black/60"
                  >
                    Episode {index + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-4 -mt-2">
          <a
            onClick={() => toggleWatch(movieDetails.id,media_type)}
            href={
              selectedSeason && selectedEpisode
                ? `${VIDSRCS_ME_API}${media_type}?tmdb=${id}&season=${selectedSeason.season_number}&episode=${selectedEpisode}`
                : `${VIDSRCS_ME_API}${media_type}?tmdb=${id}`
            }
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
            <span className="text-sm -mb-1 text-white">{isTouched.Watched ? "Watch Again" : "Watch Now"}</span>
          </a>
            
          <button
            onClick={() => toggleLike(movieDetails.id,media_type)}
            className={`flex items-center py-2 px-4 rounded-2xl shadow-sm transition-all transform hover:scale-105 focus:outline-none duration-200 ease-in-out ${
              isTouched.Liked ? "bg-red-500 border border-red-500 text-white" : "bg-white/10 border border-white/20 text-white"
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
            <span className="text-sm -mb-1">{isTouched.Liked ? "Liked" : "Like"}</span>
          </button>
        </div>
        
        <hr className="border-white/30" />
        <div className="flex flex-col gap-2">
          <p className="text-white text-base font-thin flex items-center">
            <FilmIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Genres : </strong> {movieDetails.genres && movieDetails.genres.slice(0, 2).map((genre) => genre.name).join(", ")}
          </p>
          <p className="text-white text-base font-thin flex items-center ">
            <CalendarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Release Date : </strong> {movieDetails.release_date || movieDetails.first_air_date}
          </p>
          <p className="text-white text-base font-thin flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
            <strong>Runtime : </strong> {movieDetails.runtime || movieDetails.episode_run_time} minutes
          </p>
          
          <p className="text-white text-base font-thin flex items-center">
              <StarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Rating : </strong> {movieDetails.vote_average ? movieDetails.vote_average.toFixed(1) : "N/A"} / 10
            </p>
            <p className="text-white text-base font-thin flex items-center">
              <UserIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Reviews : </strong> {movieDetails.reviews.total_results} review(s)
            </p>
          </div>

          {/* Cast */}
          <div>
            <h2 className="text-white text-base font-semibold">Cast:</h2>
            <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-evenly">
              {movieDetails.credits.cast.length === 0 ? (
                <p className="text-white">No cast information available.</p>
              ) : (
                movieDetails.credits.cast.slice(0, 5).map((cast) => (
                  <div
                    key={cast.id}
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(cast.name)}`, '_blank')}
                    className="cursor-pointer bg-white/10 border border-white/20 rounded-2xl flex flex-col items-center w-[90px] sm:w-[140px] md:w-[110px] overflow-hidden"
                  >
                    {cast.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${cast.profile_path}`}
                        alt={cast.name}
                        className="w-full h-20 sm:h-24 md:h-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-full md:h-24 bg-gray-400 rounded-full" />
                    )}
                    <p className="text-white font-light text-xs sm:text-sm md:text-sm m-2 text-center">
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
      className="bg-white/20 md:w-8 md:h-8 w-8 h-8 absolute top-5 right-8  cursor-pointer rounded-full p-2 z-50 hidden md:flex hover:scale-110 transition-all duration-300 ease-in-out"
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

