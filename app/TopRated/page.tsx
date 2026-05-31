"use client";

import React, { useEffect } from "react";
import TopBar from "../../components/TopBar";
import NavBar from "../../components/NavBar";
import Logo from "../../components/Logo";
import MovieResults from "../../components/MovieResults";
import {
  fetchTopRatedMovies,
  setSearchActive,
} from "../../components/Redux/Slice/searchSlice";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TopRatedLogic from "../../components/TopRatedLogic.jsx";

export default function TopRatedPage() {
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
      <div className="hidden md:flex h-full w-full">
        <div className="sticky top-0 h-screen flex-shrink-0 z-50">
          <NavBar />
        </div>
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="mt-10 mb-10 flex flex-col gap-5 px-5 mr-5">
            <TopRatedLogic />
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
          {searchActive ? <MovieResults /> : <TopRatedLogic />}
        </div>
      </div>
    </div>
  );
}
