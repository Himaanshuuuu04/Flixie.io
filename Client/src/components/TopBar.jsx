import React, { useEffect, useState } from 'react';
import ExpandArrow from '../assets/ExpandArrow.png';
import Search from '../assets/Search.png';
import Notification from '../assets/Notification.png';
import Enter from '../assets/Enter.png';

export default function TopBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All");
    const options = ["All", "Option 1", "Option 2", "Option 3"];
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const baseClasses = "transition-all duration-200 transform hover:scale-105";
    const buttonClasses = "h-full p-2 border-2 border-white/20 rounded-full backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400";
    const fetchData = () => {
        const url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=1`;
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `${import.meta.env.VITE_API_TOKEN}`
        }
        };

        fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error(err));
    }
    return (
        <div className="flex items-center justify-between md:mr-0 md:ml-0 mr-10 ml-10  w-full h-12 px-0   font-sans font-light text-white text-lg z-40 md:z-50">
            <div className="relative md:flex items-center hidden">
                <div
                    className={`${isOpen ? "border-blue-400" : "border-white/20"} ${baseClasses} flex items-center justify-center w-fit xl:w-36 h-full p-2 border-2 rounded-2xl cursor-pointer`}
                    onClick={toggleDropdown}
                >
                    <h2 className="ml-2">{selectedOption}</h2>
                    <img src={ExpandArrow} alt="arrow" className={`ml-2 h-3 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                    <div className="absolute top-16 w-48 border border-white/20 rounded-xl backdrop-blur-3xl shadow-lg text-white z-50 text-center opacity-100 translate-y-0 transition-transform duration-300">
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="px-4 py-2 hover:bg-blue-400 cursor-pointer rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={`${baseClasses} flex items-center w-full  md:w-[40%] h-full p-2 border-2 z-0  md:z-50 border-white/20 rounded-2xl`}>
                <input type="text" placeholder="Search" className="bg-transparent focus:outline-none ml-2 w-full h-full" onChange={(e) => setSearchTerm(e.target.value)} />
                <button type="submit" onClick={fetchData}>
                    <img src={Search} className="ml-2 mr-2 h-6" alt="search" />
                </button>
            </div>

            <button className={`${buttonClasses} hidden md:flex`}>
                <img src={Notification} className="h-6" alt="Notification" />
            </button>

            <button className={`${baseClasses} hidden md:flex h-12`}>
                <div className={`${buttonClasses} flex items-center`}>
                    <img src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" className="h-8 rounded-full" alt="Profile" />
                    <h2 className="ml-4  ">John Doe</h2>
                    <img src={Enter} className="h-6 ml-2" alt="Logout" />
                </div>
            </button>
        </div>
    );
}
