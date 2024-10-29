import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import Home from "../assets/Home.png";
import Settings from "../assets/Settings.png";
import Arrow from "../assets/Arrow.png";
import Bussinessman from "../assets/Businessman.png";
import Heart from "../assets/Heart.png";

export default function NavBar() {
  return (
    <nav className="flex flex-col items-center justify-between  w-64 border-2 p-8 rounded-3xl border-slate-700 bg-slate-900 backdrop-filter backdrop-blur-xl shadow-xl text-white absolute left-10 bottom-10 top-10 opacity-90">
      
      {/* Logo Section */}
      <div className="flex flex-col items-center space-y-2 mt-8 ">
        <Link to="/" className="flex items-center -space-x-1">
          <img src={Logo} alt="logo" className="h-12 w-12" />
          <h2 className="text-4xl font-semibold mt-2 ">Flixie</h2>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="nav-links flex flex-col -mt-40 items-start w-full space-y-8">
        <ul className="space-y-6 font-light">
          <li className="text-lg ">
            <Link to="/" className="flex items-center space-x-3">
              <img src={Home} alt="home" className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="text-lg ">
            <Link to="/TopGrossing" className="flex items-center space-x-3">
              <img src={Arrow} alt="top grossing" className="h-5 w-5" />
              <span>Top Grossing</span>
            </Link>
          </li>
          <li className="text-lg ">
            <Link to="/Favourite" className="flex items-center space-x-3">
              <img src={Heart} alt="favourite" className="h-5 w-5" />
              <span>Favourite</span>
            </Link>
          </li>
        </ul>
        
        <hr className="border-gray-600 h-1 w-full" />

        <ul className="space-y-6 font-light">
          <li className="text-lg  ">
            <Link to="/Profile" className="flex items-center space-x-3">
              <img src={Bussinessman} alt="profile" className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </li>
          <li className="text-lg ">
            <Link to="/Settings" className="flex items-center space-x-3">
              <img src={Settings} alt="settings" className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Optional Bottom Padding for Layout Consistency */}
      
    </nav>
  );
}
