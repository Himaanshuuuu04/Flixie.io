"use client";

import React, { useEffect } from "react";
import TopBar from "../../components/TopBar";
import NavBar from "../../components/NavBar";
import Logo from "../../components/Logo";
import MovieResults from "../../components/MovieResults";
import FriendsLogic from "../../components/FriendsLogic.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSearchActive } from "../../components/Redux/Slice/searchSlice";

export default function FriendsPage() {
  const dispatch = useDispatch();
  const searchActive = useSelector((state) => state.search.searchActive);
  const searchTerm = useSelector((state) => state.search.searchTerm);

  useEffect(() => {
    if (!searchTerm) {
      dispatch(setSearchActive(false));
    }
  }, [searchTerm, dispatch]);

  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex h-full w-full">
        <div className="sticky top-0 h-screen flex-shrink-0 z-50">
          <NavBar />
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="mt-10 mb-10 flex flex-col gap-5 px-5 mr-5">
            <FriendsLogic />
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col overflow-y-auto h-screen">
        <div className="flex flex-row w-full justify-around mt-5 mb-5">
          <Logo />
          <TopBar />
          <NavBar />
        </div>
        <div className="flex flex-col gap-5 px-5 items-center justify-items-center">
          {searchActive ? <MovieResults /> : <FriendsLogic />}
        </div>
      </div>
    </div>
  );
}
