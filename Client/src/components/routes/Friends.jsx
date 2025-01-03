import React, { useEffect } from "react";
import TopBar from "../TopBar";
import NavBar from "../NavBar";
import Logo from "../Logo";
import MovieResults from "../MovieResults";
import { useSearchContext } from "../contextAPI/SearchContext.jsx";
import FriendsLogic from "../FriendsLogic.jsx";

export default function Friends() {

  const { searchActive, setSearchActive, searchTerm } = useSearchContext();

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
          <div className="mt-10 mb-10 flex flex-col gap-5 px-5 mr-5">
                <FriendsLogic />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex flex-col  overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="flex flex-row w-full justify-around mt-5 mb-5   ">
          <Logo />
          <TopBar />
          <NavBar />
        </div>
        {/* Scrollable Content */}
        <div className="flex flex-col gap-5 px-5 items-center justify-items-center">
          {/* <div className="bg-white/10 p-2 px-4 border border-white/20 w-fit backdrop:filter backdrop-blur-sm rounded-xl mb-5">
            <h2 className="text-xl font-light text-white ">Favourites</h2>
          </div> */}
         
          {searchActive ? (
            <MovieResults />
          ) : (
            <>
              <FriendsLogic />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
