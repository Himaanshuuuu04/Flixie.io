// MainLayout.js
import React from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import Logo from "./Logo";
import CardMapper from "./CardMapper"
export default function MainLayout() {
  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col md:flex-row overflow-y-auto  flex-wrap">
        <div className="hidden md:flex flex-row w-full justify-center mr-10">
          <div>
            <NavBar />
          </div>
          <div className="mt-10 flex flex-col gap-10 w-full ">
            <TopBar />
            <Carousel />
            <CardMapper/>
          </div>
          
           
          
        </div>


        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-row w-full justify-around mt-5">
          <Logo />
          <TopBar />
          <NavBar />
        </div>
        <div className="m-5 md:hidden">
          <Carousel />
          
        </div>
        <div className="m-5 md:hidden">
        <CardMapper/>
        </div>
      </div>

      {/* Main Content */}
     
    </div>
  );
}
