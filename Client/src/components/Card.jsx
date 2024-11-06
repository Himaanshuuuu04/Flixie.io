import { Link } from "react-router-dom"

export default function Card({img,title,link}) {
    return (
        <Link to={link}>
        <div className='flex flex-col items-center w-48  border border-slate-700 rounded-2xl backdrop-filter backdrop-blur-3xl shadow-xl text-white cursor-pointer hover:bg-blue-400 transition-all duration-300 z-50 m-10 ml-0'>
            <img src={img} alt="logo" className="h-60 w-48 rounded-2xl" />
            <h2 className="ml-2 -mb-1">{title}</h2>
        </div>
        </Link>
    )
}