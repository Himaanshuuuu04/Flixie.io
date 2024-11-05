import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Logo() {
    return (
        <NavLink to="/" className="w-20 h-12 cursor-pointer ml-10">
            <div className="w-full h-full rounded-full border-2 border-slate-800 flex justify-center items-center backdrop-filter backdrop-blur-3xl hover:bg-blue-400 transition-transform duration-300 hover:scale-105">
                <img src={logo} alt="logo" className="h-10 w-10" />
            </div>
        </NavLink>
    );
}
