import { Link } from "react-router-dom";

export default function Card({ id,img, title, link,year,rating,media_type }) {
    // Define the maximum number of characters for the title
    const maxTitleLength = 16;
    const media=media_type || "movie";
    
    // Truncate the title if it exceeds the max length
    const truncatedTitle = title.length > maxTitleLength 
        ? `${title.slice(0, maxTitleLength)}...` 
        : title;
    const yearSliced = new Date(year).getFullYear();

    return (
        <Link 
        to={`/Moviedetails/${media}/${id}`} 
  className="flex flex-col items-center cursor-pointer w-fit"
>
  <div className="relative group border border-white/30 rounded-xl backdrop-filter backdrop-blur-3xl  text-white transition-all duration-300 hover:bg-white/30 hover:scale-105 hover:border-white/70">
    {/* Image */}
    <img
      src={img}
      alt="logo"
      className="w-40 h-52 sm:w-44 sm:h-64 md:w-36 md:h-48 rounded-xl object-cover opacity-85 transition-all duration-300 group-hover:blur-sm"
    />
      {/* Overlay */}
    <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-xl">
      <h2 className="text-lg font-bold text-white text-center">{title}</h2>
      <p className="text-sm text-gray-300">Year: {yearSliced}</p>
      <p className="text-sm text-yellow-400">Rating: {rating} / 10</p>
    </div>
  </div>
</Link>

      
    );
}
