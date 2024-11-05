// MainLayout.js
import React from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";

export default function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row ">
      {/* Sidebar Navigation (NavBar) */}
      <div className="md:w-1/4 md:h-screen ">
        <NavBar />
      </div>

      {/* Main Content Area with TopBar */}
      <div className=" mt-10 mr-10 ml-10 flex flex-row gap-10 w-full md:w-3/4">
        <TopBar />
      
      {/* Main content goes here if any */}
      </div>
    </div>
  );
}
