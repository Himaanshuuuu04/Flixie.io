import React, { useEffect } from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import Logo from "./Logo";
import MovieResults from "./MovieResults";
import FavouriteMovies from "./FavouriteMovies";
import { useMovieContext } from "./contextAPI/MovieContext.jsx";
import GenreResults from "./GenreResults.jsx";
import { useGenreContext } from "./contextAPI/GenreContext.jsx";

export default function MainLayout() {
  const { movieByGenre } = useGenreContext();
  const { searchActive, setSearchActive, searchTerm } = useMovieContext();

  useEffect(() => {
    if (!searchTerm) {
      setSearchActive(false);
    }
  }, [searchTerm]);

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
            {movieByGenre && <GenreResults />}
            {searchActive ? (
              <MovieResults />
            ) : (
              <>
                <FavouriteMovies />
              </>
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
          {movieByGenre && <GenreResults />}
          {searchActive ? (
            <MovieResults />
          ) : (
            <>
              <FavouriteMovies />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
