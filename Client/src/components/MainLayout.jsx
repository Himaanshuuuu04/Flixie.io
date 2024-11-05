// MainLayout.js
import React from "react";
import TopBar from "./TopBar";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import Logo from "./Logo";

export default function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row ">
      <div className="hidden md:flex  flex-row w-full justify-center">
     
        <div >
          <NavBar />
        </div>

        
        <div className=" mt-10  flex flex-row gap-10 w-full  ">
          <TopBar />
        
        
        </div>
        

      </div>
      
      <div className="md:hidden  flex flex-row w-full justify-center  mt-10 ">
        <Logo/>
        <TopBar />
        <NavBar />

      </div>
      
    </div>
  );
}
