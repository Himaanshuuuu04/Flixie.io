import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Logo() {
    return (
        <NavLink to="/" className="min-w-12 h-12 cursor-pointer ml-5">
            <div className="w-full h-full rounded-full border-2 border-white/20 flex justify-center items-center backdrop-filter backdrop-blur-3xl hover:bg-blue-400 transition-transform duration-300 hover:scale-105">
                <img src={logo} alt="logo" className="h-10 w-10" />
            </div>
        </NavLink>
    );
}
