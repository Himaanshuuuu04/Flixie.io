import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import Home from "../assets/Home.png";
import Settings from "../assets/Settings.png";
import Arrow from "../assets/Arrow.png";
import Bussinessman from "../assets/Businessman.png";
import Heart from "../assets/Heart.png";

export default function NavBar() {
  return (
    <nav className="flex flex-col items-center w-64 border-2 p-8 rounded-3xl border-slate-800 backdrop-filter backdrop-blur-3xl shadow-xl text-white absolute left-10 bottom-10 top-10 opacity-90 z-50">

      
      {/* Logo Section */}
      <div className="flex flex-col items-center space-y-2 mt-8">
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
                `flex items-center space-x-3 ${isActive ? "font-bold" : ""}`
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
                `flex items-center space-x-3 ${isActive ? "font-bold" : ""}`
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
                `flex items-center space-x-3 ${isActive ? "font-bold" : ""}`
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
              to="/Profile"
              className={({ isActive }) => 
                `flex items-center space-x-3 ${isActive ? "font-bold" : ""}`
              }
            >
              <img src={Bussinessman} alt="profile" className="h-6" />
              <span>Profile</span>
            </NavLink>
          </li>
          <li className="text-lg">
            <NavLink
              to="/Settings"
              className={({ isActive }) => 
                `flex items-center space-x-3 ${isActive ? "font-bold" : ""}`
              }
            >
              <img src={Settings} alt="settings" className="h-6 -mt-1" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
