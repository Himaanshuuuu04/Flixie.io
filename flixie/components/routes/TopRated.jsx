"use client";

import React, { useEffect } from "react";
import TopBar from "../TopBar";
import NavBar from "../NavBar";
import Logo from "../Logo";
import MovieResults from "../MovieResults";
import {
  fetchTopRatedMovies,
  setSearchActive,
} from "../Redux/Slice/searchSlice";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TopRatedLogic from "../TopRatedLogic.jsx";
export default function TopRated() {
  const dispatch = useDispatch();
  const topRatedMovies = useSelector((state) => state.search.topRatedMovies);
  const loading = useSelector((state) => state.search.loading);
  const { searchActive, searchTerm } = useSelector(
    (state) => state.search,
    shallowEqual,
  );

  useEffect(() => {
    if (!searchTerm) {
      dispatch(setSearchActive(false));
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (loading || topRatedMovies.length > 0) {
      return;
    }

    dispatch(
      fetchTopRatedMovies(
        {
          sort_by: "vote_average.desc",
          vote_count: "5000",
          primary_release_date: {
            gte: "2010-01-01",
            lte: new Date().toISOString().split("T")[0],
          },
          with_genres: "",
        },
        1,
      ),
    );
  }, [dispatch, loading, topRatedMovies.length]);

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
            <TopRatedLogic />
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
              <TopRatedLogic />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
