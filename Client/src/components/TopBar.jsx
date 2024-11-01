import React, { useState } from 'react';
import ExpandArrow from '../assets/ExpandArrow.png';
import Search from '../assets/Search.png';
import Notification from '../assets/Notification.png';
import Enter from '../assets/Enter.png';

export default function TopBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("All");

    const options = ["All", "Option 1", "Option 2", "Option 3"];

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="flex  space-x-10 mt-10 w-full mr-10 ml-10 md:ml-[21rem] font-sans font-light text-white text-lg z-40">
            
            {/* Custom Select Dropdown */}
            <div className="relative md:flex flex-col items-center z-50 transition-all duration-300  hover:scale-105 hidden ">
                <div
                    className={`flex justify-center items-center w-36 p-2 border-2 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl text-white cursor-pointer hover:bg-blue-400 transition-all duration-300
                    ${isOpen ? "border-blue-400" : "border-slate-800"} transition-all duration-300`}
                    onClick={toggleDropdown}
                >
                    <h2 className="ml-2 -mb-1">{selectedOption}</h2>
                    <img
                        src={ExpandArrow}
                        alt="arrow"
                        className={`ml-2 h-3 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                </div>

                {/* Dropdown Options with Transition */}
                {isOpen && (
                    <div
                        className="absolute mt-[3.5rem] w-48 border border-slate-800 rounded-xl backdrop-filter backdrop-blur-3xl shadow-lg  text-white z-40 text-center
                        transition-all duration-300 opacity-0 translate-y-2 transform "
                        style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(10px)' }}
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="px-4 py-2 hover:bg-blue-400 hover:text-white cursor-pointer rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Search Input */}
            <div className="flex justify-center items-center md:w-[40%] w-auto mr-10  p-2 border-2 border-slate-800 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl text-white z-40 hover:border-blue-400 hover:scale-105 transition-all duration-200 ">
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent focus:outline-none ml-2 -mb-1 w-[100%]"
                />
                <button type="submit">
                    <img src={Search} className="ml-2 mr-2 h-6" alt="search" />
                </button>
            </div>

            {/* Notifications Button */}
            <button className="transition-all duration-200 transform hover:scale-125 z-40 md:flex hidden ">
                <div className="flex  justify-center items-center p-2 border-2 border-slate-800 rounded-full backdrop-filter backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400 transition-colors duration-200">
                    <img src={Notification} className="h-6" alt="Notification" />
                </div>
            </button>

            {/* Profile Button */}
            <button className="transition-transform duration-200 transform hover:scale-105 z-40 md:flex hidden ">
                <div className="flex justify-center items-center p-2 border-2 border-slate-800 rounded-full backdrop-filter backdrop-blur-3xl shadow-xl text-white hover:bg-blue-400 transition-colors duration-200 z-40">
                    <img src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" className="h-10 -m-2 rounded-full" alt="Profile" />
                    <h2 className="ml-4 -mb-1">John Doe</h2>
                    <img src={Enter} className="h-6 ml-2" alt="Logout" />
                </div>
            </button>
        </div>
    );
}
