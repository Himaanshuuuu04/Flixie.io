// src/components/TopBar.js
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  fetchSearchMovies,
  setSearchTerm,
  setSearchActive,
} from "./Redux/Slice/searchSlice.js";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchAiRecommendations } from "./Redux/Slice/aiSearchSlice.js";
import { fetchMoviesByGenre } from "./Redux/Slice/genreSlice";
import { logoutUser } from "./Redux/Slice/authSlice";
export default function TopBar() {
  const logged = useSelector((state) => state.auth.logged);
  const { searchTerm } = useSelector((state) => state.search, shallowEqual);
  const dispatch = useDispatch();
  const router = useRouter();
  const expandArrowSrc = "/assets/ExpandArrow.png";
  const searchSrc = "/assets/Search.png";
  const notificationSrc = "/assets/Notification.png";
  const enterSrc = "/assets/Enter.png";
  const chatgptSrc = "/assets/ChatGPT.png";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option) => {
    setSelectedOption(option.name);
    setIsOpen(false);
    dispatch(fetchMoviesByGenre(option.id));
  };

  const genresObject = {
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Sci-Fi" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ],
  };
  const loggingout = () => {
    if (logged) {
      dispatch(logoutUser());
      router.push("/Login");
    }
  };
  return (
    <div className="flex flex-col w-full md:mr-0 md:ml-0 mr-5 ml-5 z-40 ">
      {/* TopBar */}
      <div className="flex items-center justify-between w-full h-12 px-0 font-sans font-light text-white text-lg">
        {/* Dropdown */}
        <div className="relative md:flex items-center hidden">
          <div
            className={`${isOpen ? "border-blue-400" : "border-white/20"} flex items-center justify-center w-fit xl:w-36 h-full p-2 border rounded-2xl cursor-pointer bg-white/5 backdrop-blur-xl`}
            onClick={toggleDropdown}
          >
            <h2 className="ml-2">{selectedOption}</h2>
            <Image
              src={expandArrowSrc}
              alt="arrow"
              width={12}
              height={12}
              className={`ml-2 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
          {isOpen && (
            <div className="absolute top-16 bg-white/5 border border-white/20 rounded-xl backdrop-blur-3xl  text-white z-50 text-center tansition-all duration-200">
              {genresObject.genres.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 hover:bg-black/30 cursor-pointer  transition-all duration-300 transform hover:scale-105"
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-[60%] h-full p-2 border border-white/20 bg-white/5 rounded-2xl backdrop-blur-xl  ">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            className="bg-transparent focus:outline-none ml-2 w-full h-full"
            onChange={(e) => {
              dispatch(setSearchTerm(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch(fetchSearchMovies(e.target.value));
                dispatch(setSearchActive(true));
                // Fetch data when Enter key is pressed
              }
            }}
          />
          <button
            type="submit"
            onClick={() => {
              dispatch(fetchAiRecommendations(searchTerm));
              dispatch(setSearchActive(true));
            }}
          >
            <Image src={chatgptSrc} alt="search" width={24} height={24} className="ml-2 mr-2" />
          </button>

          <button
            type="submit"
            onClick={() => {
              dispatch(fetchSearchMovies(searchTerm));
              dispatch(setSearchActive(true));
            }}
          >
            <Image src={searchSrc} alt="search" width={24} height={24} className="ml-2 mr-2" />
          </button>
        </div>

        {/* Notification Button */}
        <button className="hidden md:flex justify-center items-center h-12 p-2 border border-white/20 rounded-full backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400">
          <Image src={notificationSrc} alt="Notification" width={24} height={24} />
        </button>

        {/* Profile Section */}
        <button onClick={loggingout} className="hidden md:flex h-12">
          <div className="flex items-center h-full p-2 border border-white/20 rounded-full backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400">
            <Image
              src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
              alt="Profile"
              width={32}
              height={32}
              unoptimized
              className="rounded-full"
            />
            <h2 className="ml-4">John Doe</h2>
            <Image src={enterSrc} alt="Logout" width={24} height={24} className="ml-2" />
          </div>
        </button>
      </div>
    </div>
  );
}
