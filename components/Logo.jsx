import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setSearchActive } from "./Redux/Slice/searchSlice";

export default function Logo() {
  const dispatch = useDispatch();
  return (
    <Link href="/" className="min-w-12 h-12 cursor-pointer ml-5">
      <div
        className="w-full h-full rounded-full border-2 border-white/20 flex justify-center items-center backdrop-filter backdrop-blur-3xl hover:bg-blue-300 transition-transform duration-300 hover:scale-105"
        onClick={() => dispatch(setSearchActive(false))}
      >
        <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
      </div>
    </Link>
  );
}
