import { Link } from "react-router-dom";

const formatISODate = (isoDate) => {
  if (!isoDate) return "N/A";

  const parsedDate = new Date(isoDate);

  if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
  }

  return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
       // Use 12-hour format with AM/PM
  });
};


export default function Card({ id, img, title, link, year, rating, media_type, playedOn }) {
    const media = media_type || "movie";
    const yearSliced = new Date(year).getFullYear();
    const formattedPlayedOn = playedOn ? formatISODate(playedOn) : null;
    return (
        <Link 
            to={`/Moviedetails/${media}/${id}`} 
            className="flex flex-col items-center cursor-pointer w-fit"
        >
            <div className="relative group border border-white/30 rounded-xl backdrop-filter backdrop-blur-xl text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 shadow-xl">
                {/* Image */}
                <img
                    src={img}
                    alt="logo"
                    className="w-36 h-52 sm:w-44 sm:h-64 md:w-36 md:h-52 rounded-xl object-cover opacity-85 transition-all duration-300 group-hover:blur-sm"
                />
                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100  transition-opacity duration-300 bg-black/50 rounded-xl gap-2">
                    <h2 className="text-lg font-bold text-white text-center">{title}</h2>
                    <p className="text-sm text-gray-300">{yearSliced}</p>
                    <p className="text-sm text-blue-400">{rating} / 10</p>
                    {formattedPlayedOn && (
                        <p className="text-sm text-gray-300 text-center">{formattedPlayedOn}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
