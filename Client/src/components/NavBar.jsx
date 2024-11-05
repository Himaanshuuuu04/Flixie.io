import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import Logo from "../assets/logo.png";
import Home from "../assets/Home.png";
import Settings from "../assets/Settings.png";
import Arrow from "../assets/Arrow.png";
import Businessman from "../assets/Businessman.png";
import Heart from "../assets/Heart.png";
import Switch from "./Hamberger"; // Switch component acting as hamburger icon

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col items-center md:w-64 w-40 border-2 p-8 rounded-3xl border-slate-800 backdrop-filter backdrop-blur-3xl shadow-xl text-white float-left ml-10 mt-10 md:h-[90%] opacity-90 md:z-40  mb-10 overflow-auto">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-2 mt-4">
          <NavLink to="/" className="flex items-center -space-x-1">
            <img src={Logo} alt="logo" className="h-12 -ml-2" />
            <h2 className="text-4xl font-semibold mt-2">Flixie</h2>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="nav-links flex flex-col mt-10 items-start w-full space-y-8">
          <ul className="space-y-6 font-light">
            <li className="text-lg">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
                   ${isActive ? "text-blue-400 font-bold" : "hover:text-blue-300"} 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500`
                }
              >
                <img src={Home} alt="home" className="h-6 -mt-1" />
                <span>Home</span>
              </NavLink>
            </li>
            <li className="text-lg">
              <NavLink
                to="/TopGrossing"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
                   ${isActive ? "text-blue-400 font-bold" : "hover:text-blue-300"} 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500`
                }
              >
                <img src={Arrow} alt="top grossing" className="h-6 -mt-1" />
                <span>Top Grossing</span>
              </NavLink>
            </li>
            <li className="text-lg">
              <NavLink
                to="/Favourite"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
                   ${isActive ? "text-blue-400 font-bold" : "hover:text-blue-300"} 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500`
                }
              >
                <img src={Heart} alt="favourite" className="h-6 -mt-1" />
                <span>Favourite</span>
              </NavLink>
            </li>
          </ul>

          <hr className="border-gray-600 h-1 w-full" />

          <ul className="space-y-6 font-light">
            <li className="text-lg">
              <NavLink
                to="/Auth"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
                   ${isActive ? "text-blue-400 font-bold" : "hover:text-blue-300"} 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500`
                }
              >
                <img src={Businessman} alt="profile" className="h-6" />
                <span>Profile</span>
              </NavLink>
            </li>
            <li className="text-lg">
              <NavLink
                to="/Settings"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
                   ${isActive ? "text-blue-400 font-bold" : "hover:text-blue-300"} 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500`
                }
              >
                <img src={Settings} alt="settings" className="h-6 -mt-1" />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden ">
        {/* Hamburger Icon */}
        <div className="absolute z-50 top-10 right-10 ml-10 mr-10">
          <Switch isOpen={isOpen} toggleMenu={toggleMenu} />
        </div>


        {/* Mobile Menu */}
        <ul
          className={`fixed inset-0 bg-opacity-90 backdrop-filter backdrop-blur-3xl text-white text-2xl flex flex-col space-y-6 items-center justify-center transition-all duration-500 ease-in-out z-40 ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <li>
            <NavLink
              to="/"
              className="hover:text-gray-400 transition-colors duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/TopGrossing"
              className="hover:text-gray-400 transition-colors duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Top Grossing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Favourite"
              className="hover:text-gray-400 transition-colors duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Favourite
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Auth"
              className="hover:text-gray-400 transition-colors duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Settings"
              className="hover:text-gray-400 transition-colors duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
