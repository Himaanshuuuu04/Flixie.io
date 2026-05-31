"use client";

import React from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import Logo from "./Logo";
import CardMapper from "./CardMapper";
import MovieResults from "./MovieResults";
import { useSelector, shallowEqual } from "react-redux";

export default function MainLayout() {
  const { searchActive } = useSelector((state) => state.search, shallowEqual);

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Desktop Navigation */}
      <div className="hidden md:flex h-full w-full">
        {/* Sticky NavBar */}
        <div className="sticky top-0 h-screen flex-shrink-0 z-50">
          <NavBar />
        </div>
        {/* Main Content */}
        <div className="flex flex-col flex-grow overflow-y-auto ">
          <div className="mt-10 ml-5 mb-10 flex flex-col gap-5 mr-10">
            <TopBar />
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
