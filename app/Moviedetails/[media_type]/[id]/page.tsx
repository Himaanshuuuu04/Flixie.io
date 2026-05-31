"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ClockIcon,
  StarIcon,
  CalendarIcon,
  FilmIcon,
} from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails } from "../../../../components/Redux/Slice/searchSlice";
import {
  addLikedMovie,
  addWatchedMovie,
  removeLikedMovie,
} from "../../../../components/Redux/Slice/likeSlice";
import SkeletonLoaderMoviedetails from "../../../../components/SkeletonLoaderMoviedetils";
import { RootState, AppDispatch } from "../../../../components/Redux/Store";

const VIDSRCS_ME_API = "https://vidsrcme.ru/embed/";

interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  name: string;
  overview?: string;
  poster_path?: string;
  air_date?: string;
}

interface MovieRef {
  movieId: string;
  type: string;
  playedOn?: string;
}

interface MovieDetail {
  id: number | string;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  seasons?: Season[];
  genres?: { name: string }[];
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number;
  vote_average?: number;
}

export default function MovieDetailsPage() {
  const params = useParams();
  const media_type = params?.media_type;
  const id = params?.id;
  useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const likedMovies = useSelector((state: RootState) => state.like.likedMovies) as MovieRef[];
  const watchedMovies = useSelector((state: RootState) => state.like.watchedMovies) as MovieRef[];
  const { movieDetails: rawMovieDetails, trailerUrl, loading } = useSelector(
    (state: RootState) => state.search,
  );
  const movieDetails = rawMovieDetails as MovieDetail | null;

  const isTouched = useMemo(() => {
    if (!movieDetails) {
      return { Liked: false, Watched: false };
    }

    const liked = likedMovies?.some(
      (movie) =>
        movie.movieId === movieDetails.id.toString() &&
        movie.type === media_type,
    );
    const watched = watchedMovies?.some(
      (movie) =>
        movie.movieId === movieDetails.id.toString() &&
        movie.type === media_type &&
        movie.playedOn,
    );

    return { Liked: Boolean(liked), Watched: Boolean(watched) };
  }, [movieDetails, likedMovies, media_type, watchedMovies]);

  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const toggleLike = () => {
    const movieId = id;
    const mediaType = media_type;
    const isAlreadyLiked = likedMovies.some(
      (movie) => movie.movieId === movieId && movie.type === mediaType,
    );
    if (isAlreadyLiked) {
      dispatch(
        (removeLikedMovie as unknown as (arg: unknown) => { type: string })({
          movieId,
          media_type: mediaType,
        }),
      );
    } else {
      dispatch(
        (addLikedMovie as unknown as (arg: unknown) => { type: string })({
          movieId,
          media_type: mediaType,
        }),
      );
    }
  };

  const toggleWatch = () => {
    const movieId = id;
    const mediaType = media_type;
    const isAlreadyWatched = watchedMovies.some(
      (movie) =>
        movie.movieId === movieId && movie.type === mediaType && movie.playedOn,
    );
    if (!isAlreadyWatched) {
      dispatch(
        (addWatchedMovie as unknown as (arg: unknown) => { type: string })({
          movieId,
          media_type: mediaType,
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(
      (fetchMovieDetails as unknown as (arg: unknown) => { type: string })({
        id: id,
        mediaType: media_type,
      }),
    );
  }, [id, media_type, dispatch]);

  const seasons = (movieDetails?.seasons as Season[]) ?? [];
  const activeSeason = selectedSeason ?? seasons[0] ?? null;

  const handleSeasonChange = (seasonId: string) => {
    const season = seasons.find((s: Season) => s.id === parseInt(seasonId));
    setSelectedSeason(season || null);
    setSelectedEpisode(null);
  };

  const handleEpisodeChange = (episodeNumber: string) => {
    setSelectedEpisode(parseInt(episodeNumber));
  };

  if (loading || !movieDetails) {
    return <SkeletonLoaderMoviedetails />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-y-auto">
      <div className="bg-white/5 backdrop-blur-3xl border border-white/20 h-[95vh] md:h-[90vh] md:w-[95vw] md:m-10 m-5 flex flex-col md:flex-row rounded-2xl relative md:overflow-hidden overflow-auto">
        <div className="w-full md:w-1/2 h-72 md:h-full border-r-0 md:border-r md:border-white/20">
          {trailerUrl ? (
            <iframe
              src={trailerUrl}
              title="Movie Trailer"
              className="w-full h-full rounded-t-2xl md:rounded-none z-40"
              allowFullScreen
              loading="eager"
              allow="accelerometer; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={`https://image.tmdb.org/t/p/original/${movieDetails.poster_path}`}
                alt={movieDetails.title || movieDetails.name || "Movie Poster"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-t-2xl md:rounded-none object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 md:p-8 gap-6 w-full md:w-1/2 overflow-y-auto scrollbar-hide">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {movieDetails.title || movieDetails.name}
          </h1>

          <p className="text-white text-base font-light -mt-4">
            <strong>Overview :</strong> {movieDetails.overview}
          </p>
          <div className="flex gap-4 -mt-2">
            {seasons.length > 0 && (
              <div className="flex flex-col">
                <label
                  htmlFor="season-select"
                  className="text-white font-light mb-1 text-sm"
                >
                  Select Season:
                </label>
                <select
                  id="season-select"
                  className="flex items-center bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-2xl shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-500 focus:outline-none duration-200 ease-in-out text-sm -mb-1"
                  value={activeSeason?.id || ""}
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

            {activeSeason && activeSeason.episode_count > 0 && (
              <div className="flex flex-col">
                <label
                  htmlFor="episode-select"
                  className="text-white font-light mb-1 text-sm"
                >
                  Select Episode:
                </label>
                <select
                  id="episode-select"
                  className="flex items-center bg-white/10 border border-white/20 text-white font-medium py-2 px-4 rounded-2xl shadow-sm transition-transform transform hover:scale-105 hover:bg-blue-500 focus:outline-none duration-200 ease-in-out text-sm -mb-1"
                  value={selectedEpisode || ""}
                  onChange={(e) => handleEpisodeChange(e.target.value)}
                >
                  {[...Array(activeSeason.episode_count)].map((_, index) => (
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
              onClick={() => toggleWatch()}
              href={
                activeSeason && selectedEpisode
                  ? `${VIDSRCS_ME_API}${media_type}?tmdb=${id}&season=${activeSeason.season_number}&episode=${selectedEpisode}`
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
                />
              </svg>
              <span className="text-sm -mb-1 text-white">
                {isTouched.Watched ? "Watch Again" : "Watch Now"}
              </span>
            </a>

            <button
              onClick={() => toggleLike()}
              className={`flex items-center py-2 px-4 rounded-2xl shadow-sm transition-all transform hover:scale-105 focus:outline-none duration-200 ease-in-out ${
                isTouched.Liked
                  ? "bg-red-500 border border-red-500 text-white"
                  : "bg-white/10 border border-white/20 text-white"
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
                />
              </svg>
              <span className="text-sm -mb-1">
                {isTouched.Liked ? "Liked" : "Like"}
              </span>
            </button>
          </div>

          <hr className="border-white/30" />
          <div className="flex flex-col gap-2">
            <p className="text-white text-base font-thin flex items-center">
              <FilmIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Genres : </strong>
              {movieDetails.genres &&
                movieDetails.genres
                  .slice(0, 2)
                  .map((genre) => genre.name)
                  .join(", ")}
            </p>
            <p className="text-white text-base font-thin flex items-center ">
              <CalendarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Release Date : </strong>
              {movieDetails.release_date || movieDetails.first_air_date}
            </p>
            <p className="text-white text-base font-thin flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Runtime : </strong>
              {movieDetails.runtime || movieDetails.episode_run_time} minutes
            </p>
            <p className="text-white text-base font-thin flex items-center">
              <StarIcon className="w-5 h-5 mr-2 -mt-1 text-white" />
              <strong>Rating : </strong>
              {movieDetails.vote_average
                ? movieDetails.vote_average.toFixed(1)
                : "N/A"}{" "}
              / 10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
