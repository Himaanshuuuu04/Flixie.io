import { Link } from "react-router-dom";

export default function Card({ img, title, link }) {
    // Define the maximum number of characters for the title
    const maxTitleLength = 21;
    
    // Truncate the title if it exceeds the max length
    const truncatedTitle = title.length > maxTitleLength 
        ? `${title.slice(0, maxTitleLength)}...` 
        : title;

    return (
        <Link to={link || "/"} className="flex flex-col items-center cursor-pointer w-full sm:w-36 md:w-44 lg:w-52 overflow-hidden">
            <div className="border-2 border-white/20 rounded-2xl backdrop-filter backdrop-blur-3xl bg-white/20 shadow-xl text-white transition-all duration-300 hover:bg-blue-400">
            <img
                src={img}
                alt="logo"
                className="w-40 h-52 sm:w-44 sm:h-64 md:w-48 md:h-52 rounded-t-2xl object-cover"
                />

                <h2 className="m-1 text-sm md:text-base font-light text-center">
                    {truncatedTitle}
                </h2>
            </div>
        </Link>
    );
}
