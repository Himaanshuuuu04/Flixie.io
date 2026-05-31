import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Switch from "./Hamberger"; // Switch component acting as hamburger icon
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./Redux/Slice/authSlice";
import { setSearchActive } from "./Redux/Slice/searchSlice";
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const logged = useSelector((state) => state.auth.logged);
  const pathname = usePathname();
  const router = useRouter();
  const logoSrc = "/assets/logo.png";
  const homeSrc = "/assets/Home.png";
  const settingsSrc = "/assets/Settings.png";
  const arrowSrc = "/assets/Arrow.png";
  const businessmanSrc = "/assets/Businessman.png";
  const heartSrc = "/assets/Heart.png";
  const timeMachineSrc = "/assets/TimeMachine.png";
  const groupSrc = "/assets/Group.png";
  const enterSrc = "/assets/Enter.png";
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const linkClass = (href) => {
    const isActive =
      pathname === href || (href !== "/" && pathname?.startsWith(href));
    return `flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 ${
      isActive ? "text-blue-400 font-bold" : "hover:text-blue-300"
    } hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  };
  return (
    <>
      {/* Blur Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-filter  transition-opacity duration-300 z-30"
          onClick={toggleMenu} // Close menu when clicking outside
        ></div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white/5 flex-col items-center md:w-64 w-40 h-[calc(100vh-5rem)] border p-8 rounded-3xl border-white/20 backdrop-blur-3xl shadow-xl text-white float-left sticky ml-10 mt-10 mr-5  md:z-40 z-50 overflow-auto">
        {/* Logo Section */}
        <div
          className="flex flex-col items-center space-y-2 mt-4 hover:scale-105 transition-all duration-300"
          onClick={() => dispatch(setSearchActive(false))}
        >
          <Link href="/" className="flex items-center -space-x-1">
            <Image src={logoSrc} alt="logo" width={48} height={48} className="-ml-2" />
            <h2 className="text-4xl font-semibold mt-2 hover:text-blue-300 transition-all durattion-300">
              Flixie
            </h2>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links flex flex-col mt-10 items-start w-full space-y-8">
          <ul className="space-y-6 font-light">
            {/* Link items */}
            <li className="text-lg">
              <Link
                href="/"
                className={linkClass("/")}
                onClick={() => dispatch(setSearchActive(false))}
              >
                <Image src={homeSrc} alt="home" width={24} height={24} className="-mt-1" />
                <span>Home</span>
              </Link>
            </li>
            {/* Add other NavLinks similarly */}
            <li className="text-lg">
              <Link href="/TopRated" className={linkClass("/TopRated")}>
                <Image src={arrowSrc} alt="top grossing" width={24} height={24} className="-mt-1" />
                <span>Top Rated</span>
              </Link>
            </li>
            <li className="text-lg">
              <Link href="/Favourite" className={linkClass("/Favourite")}>
                <Image src={heartSrc} alt="favourite" width={24} height={24} className="-mt-1" />
                <span>Favourite</span>
              </Link>
            </li>
            <li className="text-lg">
              <Link href="/WatchHistory" className={linkClass("/WatchHistory")}>
                <Image
                  src={timeMachineSrc}
                  alt="Watch History"
                  width={24}
                  height={24}
                  className="-mt-1"
                />
                <span>Watch History</span>
              </Link>
            </li>
            <li className="text-lg">
              <Link href="/Friends" className={linkClass("/Friends")}>
                <Image src={groupSrc} alt="Friends" width={24} height={24} className="-mt-1" />
                <span>Friends</span>
              </Link>
            </li>
          </ul>

          <hr className="border-white/30 h-1 w-full" />

          <ul className="space-y-6 font-light">
            {/* <li className="text-lg">
              {logged ? (
                < div
                  className="flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 text-gray-500 cursor-not-allowed"
                  title="You are already logged in. Profile cannot be accessed!"
                >
                  <img src={Businessman} alt="profile" className="h-6" />
                  <span>Profile</span>
                </div>
              ) : (
                <Link href="/ProfileComplete" className={linkClass("/ProfileComplete")}>
                  <img src={Businessman} alt="profile" className="h-6" />
                  <span>Profile</span>
                </Link>
              )}
            </li> */}
            <li className="text-lg">
              <Link
                href="/ProfileComplete"
                className={linkClass("/ProfileComplete")}
              >
                <Image src={settingsSrc} alt="settings" width={24} height={24} className="-mt-1" />
                <span>Settings</span>
              </Link>
            </li>
            <li className="text-lg">
              <Link
                href="/Login"
                className={linkClass("/Login")}
                onClick={() => {
                  dispatch(logoutUser());
                  router.push("/Login");
                }}
              >
                <Image src={enterSrc} alt="logout" width={24} height={24} className="-mt-1" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex flex-col">
        {/* Hamburger Icon */}
        <div className="z-50 mr-5">
          <Switch isOpen={isOpen} toggleMenu={toggleMenu} />
        </div>

        {/* Mobile Menu */}
        <ul
          className={`fixed inset-0 bg-black/50 backdrop-filter backdrop-blur-2xl text-white text-2xl space-y-6 items-center justify-center h-screen w-screen text-center flex flex-col transition-all duration-500 ease-in-out z-40 ${
            isOpen ? "-translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="nav-links flex flex-col mt-10 items-start space-y-8 h-fit w-[80%] border rounded-3xl  border-white/20 p-10 bg-white/10">
            <ul className="space-y-6 font-light">
              {/* Link items */}
              <li className="text-lg">
                <Link
                  href="/"
                  className={linkClass("/")}
                  onClick={() => dispatch(setSearchActive(false))}
                >
                  <img src={homeSrc} alt="home" className="h-6 -mt-1" />
                  <span>Home</span>
                </Link>
              </li>
              {/* Add other NavLinks similarly */}
              <li className="text-lg">
                <Link href="/TopRated" className={linkClass("/TopRated")}>
                  <img
                    src={arrowSrc}
                    alt="top grossing"
                    className="h-6 -mt-1"
                  />
                  <span>Top Grossing</span>
                </Link>
              </li>
              <li className="text-lg">
                <Link href="/Favourite" className={linkClass("/Favourite")}>
                  <img src={heartSrc} alt="favourite" className="h-6 -mt-1" />
                  <span>Favourite</span>
                </Link>
              </li>
              <li className="text-lg">
                <Link
                  href="/WatchHistory"
                  className={linkClass("/WatchHistory")}
                >
                  <img
                    src={timeMachineSrc}
                    alt="Watch History"
                    className="h-6 -mt-1"
                  />
                  <span>Watch History</span>
                </Link>
              </li>
              <li className="text-lg">
                <Link href="/Friends" className={linkClass("/Friends")}>
                  <img src={groupSrc} alt="friends" className="h-6 -mt-1" />
                  <span>Friends</span>
                </Link>
              </li>
            </ul>

            <hr className="border-white/20 h-1 w-full" />

            <ul className="space-y-6 font-light">
              <li className="text-lg">
                {logged ? (
                  <div
                    className="flex items-center space-x-3 px-2 py-1 rounded-lg transition-all duration-300 text-gray-500 cursor-not-allowed"
                    title="You are already logged in. Profile cannot be accessed!"
                  >
                    <Image src={businessmanSrc} alt="profile" width={24} height={24} />
                    <span>Profile</span>
                  </div>
                ) : (
                  <Link
                    href="/ProfileComplete"
                    className={linkClass("/ProfileComplete")}
                  >
                    <Image src={businessmanSrc} alt="profile" width={24} height={24} />
                    <span>Profile</span>
                  </Link>
                )}
              </li>

              <li className="text-lg">
                <Link
                  href="/ProfileComplete"
                  className={linkClass("/ProfileComplete")}
                >
                  <Image src={settingsSrc} alt="settings" width={24} height={24} className="-mt-1" />
                  <span>Settings</span>
                </Link>
              </li>
              <li className="text-lg">
                <Link
                  href="/Login"
                  className={linkClass("/Login")}
                  onClick={() => {
                    dispatch(logoutUser());
                    router.push("/Login");
                  }}
                >
                  <Image src={enterSrc} alt="Logout" width={24} height={24} className="-mt-1" />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </ul>
      </div>
    </>
  );
}
