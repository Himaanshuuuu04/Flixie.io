// src/components/TopBar.js
import React, { useState } from 'react';
import { useSearchContext } from "./contextAPI/SearchContext.jsx"
import { useGenreContext } from './contextAPI/GenreContext.jsx';
import ExpandArrow from '../assets/ExpandArrow.png';
import Search from '../assets/Search.png';
import Notification from '../assets/Notification.png';
import Enter from '../assets/Enter.png';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './contextAPI/AuthContext.jsx';



export default function TopBar() {
    const { logout, logged } = useAuthContext();
    const { fetchMoviesByGenre } = useGenreContext();
    const { movies, loading, setSearchTerm, fetchData, searchTerm, setSearchActive } = useSearchContext();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All");
    

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => {
        setSelectedOption(option.name);
        setIsOpen(false);
        fetchMoviesByGenre(option.id);
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
            { id: 878, name: "Science Fiction" },
            { id: 53, name: "Thriller" },
            { id: 10752, name: "War" },
            { id: 37, name: "Western" }
        ]
    };
    const loggingout = () => {
        if (logged) {
            logout();
            navigate('/login');
        }
    };
    const navigate = useNavigate();
    return (
        <div className="flex flex-col w-full md:mr-0 md:ml-0 mr-5 ml-5 z-40">
            {/* TopBar */}
            <div className="flex items-center justify-between w-full h-12 px-0 font-sans font-light text-white text-lg">
                {/* Dropdown */}
                <div className="relative md:flex items-center hidden">
                    <div
                        className={`${isOpen ? "border-blue-400" : "border-white/20"} flex items-center justify-center w-fit xl:w-36 h-full p-2 border-2 rounded-2xl cursor-pointer`}
                        onClick={toggleDropdown}
                    >
                        <h2 className="ml-2">{selectedOption}</h2>
                        <img src={ExpandArrow} alt="arrow" className={`ml-2 h-3 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isOpen && (
                        <div className="absolute top-16 w-40 border border-white/20 rounded-xl backdrop-blur-3xl shadow-lg text-white z-50 text-center tansition-transform duration-300">
                            {genresObject.genres.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => handleOptionClick(option)}
                                    className="px-4 py-1 hover:bg-blue-400 cursor-pointer rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="flex items-center w-full md:w-[40%] h-full p-2 border-2 border-white/20 rounded-2xl">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent focus:outline-none ml-2 w-full h-full"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}

                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchData(e.target.value);
                                setSearchActive(true);
                                // Fetch data when Enter key is pressed
                            }
                        }}
                    />
                    <button type="submit" onClick={() => {
                        fetchData(searchTerm);
                        setSearchActive(true);
                    }
                    }>
                        <img src={Search} className="ml-2 mr-2 h-6" alt="search" />
                    </button>
                </div>

                {/* Notification Button */}
                <button className="hidden md:flex justify-center items-center h-12 p-2 border-2 border-white/20 rounded-full backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400">
                    <img src={Notification} className="h-6" alt="Notification" />
                </button>

                {/* Profile Section */}
                <button onClick={loggingout} className="hidden md:flex h-12">
                    <div className="flex items-center h-full p-2 border-2 border-white/20 rounded-full backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400">
                        <img
                            src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
                            className="h-8 rounded-full"
                            alt="Profile"
                        />
                        {/* <h2 className="ml-4">John Doe</h2> */}
                        <img src={Enter} className="h-6 ml-2" alt="Logout" />
                    </div>
                </button>
            </div>

            {/* Display the MovieList component */}


        </div>
    );
}
