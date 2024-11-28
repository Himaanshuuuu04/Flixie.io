import React, { useState } from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import Logo from "./Logo";
import CardMapper from "./CardMapper";
import MovieResults from "./MovieResults";
import { useMovieContext} from "./contextAPI/MovieContext.jsx"
import { useEffect } from "react";
import GenreResults from "./GenreResults.jsx";
import { useGenreContext } from "./contextAPI/GenreContext.jsx";

export default function MainLayout() {
  const {  movieByGenre } = useGenreContext();
  const { searchActive,setSearchActive,searchTerm} = useMovieContext();
  useEffect(() => {
    if (!searchTerm) {
        setSearchActive(false); // Reset when searchTerm becomes empty
    }
}, [searchTerm]); // Dependency array

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col md:flex-row overflow-y-auto flex-wrap">
        <div className="hidden md:flex flex-row w-full justify-center mr-10">
          <div className="sticky top-0 h-screen ">
            <NavBar />
          </div>
          <div className="mt-10 flex flex-col gap-10 w-full">
            <TopBar  /> {/* Pass state setter */}
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

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-row w-full justify-around mt-5">
          <Logo />
          <TopBar /> {/* Pass state setter */}
          <NavBar />
        </div>
        <div className="m-5 md:hidden">
          {movieByGenre && <GenreResults />}
          {searchActive ? <MovieResults /> : <Carousel />}
        </div>
        <div className="m-5 md:hidden">{!searchActive && <CardMapper />}</div>
      </div>
    </div>
  );
}
