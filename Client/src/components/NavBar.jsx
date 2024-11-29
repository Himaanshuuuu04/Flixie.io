import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import Home from "../assets/Home.png";
import Settings from "../assets/Settings.png";
import Arrow from "../assets/Arrow.png";
import Businessman from "../assets/Businessman.png";
import Heart from "../assets/Heart.png";
import Switch from "./Hamberger"; // Switch component acting as hamburger icon
import { useMovieContext } from "./contextAPI/MovieContext.jsx";
import { useEffect } from "react";
import { useAuthContext } from "./contextAPI/AuthContext.jsx";
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setSearchActive } = useMovieContext();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const { logged } = useAuthContext();
  return (
    <>
      {/* Blur Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-filter bg-opacity-90 backdrop-blur-3xl transition-opacity duration-300 z-30"
          onClick={toggleMenu} // Close menu when clicking outside
        ></div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col items-center md:w-64 w-40 h-[calc(100vh-5rem)] border-2 p-8 rounded-3xl border-white/20 backdrop-blur-3xl shadow-xl text-white float-left sticky ml-10 mt-10 mr-10 opacity-90 md:z-40 z-50 overflow-auto">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-2 mt-4" onClick={() => setSearchActive(false)}>
          <NavLink to="/" className="flex items-center -space-x-1">
            <img src={Logo} alt="logo" className="h-12 -ml-2" />
            <h2 className="text-4xl font-semibold mt-2">Flixie</h2>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="nav-links flex flex-col mt-10 items-start w-full space-y-8">
          <ul className="space-y-6 font-light">

            {/* Link items */}
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
            {/* Add other NavLinks similarly */}
            {/* <li className="text-lg">
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
            </li> */}
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
              {logged ? (
                < div
                  className="flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 text-gray-500 cursor-not-allowed"
                  title="You are already logged in. Profile cannot be accessed!"
                >
                  <img src={Businessman} alt="profile" className="h-6" />
                  <span>Profile</span>
                </div>
              ) : (
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
              )}
            </li>
            <li className="text-lg">
              <NavLink
                to="/Settings"
                className={({ isActive }) =>
                  ` flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
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
      <div className="md:hidden flex flex-col">
        {/* Hamburger Icon */}
        <div className="z-50 mr-5">
          <Switch isOpen={isOpen} toggleMenu={toggleMenu} />
        </div>

        {/* Mobile Menu */}
        <ul
          className={`fixed inset-0 bg-black/20 backdrop-filter backdrop-blur-3xl text-white text-2xl space-y-6 items-center justify-center h-screen w-screen text-center flex flex-col transition-all duration-500 ease-in-out z-40 ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
        >
          <div className="nav-links flex flex-col mt-10 items-start space-y-8 h-[60%] w-[80%] border-2 rounded-3xl border-white/20 p-10 bg-white/10">
            <ul className="space-y-6 font-light">

              {/* Link items */}
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
              {/* Add other NavLinks similarly */}
              {/* <li className="text-lg">
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
              </li> */}
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
                {logged ? (
                  < div
                    className="flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 text-gray-500 cursor-not-allowed"
                    title="You are already logged in. Profile cannot be accessed!"
                  >
                    <img src={Businessman} alt="profile" className="h-6" />
                    <span>Profile</span>
                  </div>
                ) : (
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
                )}
              </li>

              <li className="text-lg">
                <NavLink
                  to="/Settings"
                  className={({ isActive }) =>
                    ` flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 
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
        </ul >
      </div >
    </>
  );
}
