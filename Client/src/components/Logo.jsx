import { NavLink } from "react-router-dom";
import logo from '../assets/logo.png';
import { useMovieContext} from "./contextAPI/MovieContext.jsx"

export default function Logo() {
    const {setSearchActive } = useMovieContext();
    return (
        <NavLink to="/" className="min-w-12 h-12 cursor-pointer ml-5">
            <div className="w-full h-full rounded-full border-2 border-white/20 flex justify-center items-center backdrop-filter backdrop-blur-3xl hover:bg-blue-300 transition-transform duration-300 hover:scale-105"
            onClick={()=>setSearchActive(false)}>
                <img src={logo} alt="logo" className="h-10 w-10" />
            </div>
        </NavLink>
    );
}
