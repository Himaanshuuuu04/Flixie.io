import Link from "next/link";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { setSearchActive } from "./Redux/Slice/searchSlice";

export default function Logo() {
  const dispatch = useDispatch();
  const logoSrc = logo?.src || logo;
  return (
    <Link href="/" className="min-w-12 h-12 cursor-pointer ml-5">
      <div
        className="w-full h-full rounded-full border-2 border-white/20 flex justify-center items-center backdrop-filter backdrop-blur-3xl hover:bg-blue-300 transition-transform duration-300 hover:scale-105"
        onClick={() => dispatch(setSearchActive(false))}
      >
        <img src={logoSrc} alt="logo" className="h-10 w-10" />
      </div>
    </Link>
  );
}
