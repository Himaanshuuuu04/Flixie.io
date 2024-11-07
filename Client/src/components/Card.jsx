import { Link } from "react-router-dom";

export default function Card({ img, title, link }) {
    return (
        <Link to={link || "/"} className="flex flex-col items-center cursor-pointer w-full sm:w-36 md:w-44 lg:w-52 overflow-hidden">
            <div className="border-2 border-white/20 rounded-2xl backdrop-filter backdrop-blur-3xl bg-white/20 shadow-xl text-white transition-all duration-300 hover:bg-blue-400">
                <img src={img} alt="logo" className="rounded-t-2xl object-cover w-full h-36 sm:h-40 md:h-52" />
                <h2 className="m-2 text-sm md:text-base font-light text-center">{title}</h2>
            </div>
        </Link>
    );
}
