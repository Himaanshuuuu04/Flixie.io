import React, { useEffect } from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import Logo from "./Logo";
import CardMapper from "./CardMapper";
import MovieResults from "./MovieResults";
import { useSearchContext } from "./contextAPI/SearchContext.jsx";
import GenreResults from "./GenreResults.jsx";
import { useGenreContext } from "./contextAPI/GenreContext.jsx";

export default function MainLayout() {
  const { movieByGenre } = useGenreContext();
  const { searchActive, setSearchActive, searchTerm } = useSearchContext();

  useEffect(() => {
    if (!searchTerm) {
      setSearchActive(false); // Reset when searchTerm becomes empty
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
        <div className="flex flex-col flex-grow overflow-y-auto overflow-x-visible">
          <div className="mt-10 mb-10 flex flex-col gap-5 mr-10">
            <TopBar />
            {movieByGenre && <GenreResults />}
            {searchActive ? (
              <MovieResults />
            ) : (
              <>
                <Carousel />
                <CardMapper />
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
              <Carousel />
              <CardMapper />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
