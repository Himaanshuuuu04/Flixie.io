//Page for displaying the details of a movie
import React from 'react'
import Movies from '../Movies'
import { useParams } from 'react-router-dom'
import { BackgroundGradientAnimation } from '../Gradient'
const Moviedetails = () => {
    const params=useParams();
    const movie=Movies.find((movie)=>movie.id===parseInt(params.id));
  return (
    <BackgroundGradientAnimation>
        {/* more data will be added using API */}
        {/* instead of image trailer should be added instead of image */}
        <div className='bg-gradient-to-r from-pink-950 text-rose-950 md:w-3/5 w-5/6 h-4/5 m-auto mt-10 bg-black flex flex-col md:gap-4 rounded-2xl relative'>
                <img src={movie.image} alt="" className='w-full md:h-3/4 h-full rounded-t-2xl object-cover' />
                <div className='flex flex-col items-start p-8 gap-4'>
                    <h1 className='md:text-4xl text-3xl font-bold text-white'>{movie.title}</h1>
                    <div className='flex items-center justify-center'>
                        <p className='text-white text-xl'>{movie.description}</p>
                    </div>
                    <p className='text-white md:text-xl text-lg'>Watch in Hindi,English,Tamil,Telugu</p>
                    <div className='flex justify-items-start align-center gap-1'>
                        <p className='text-white font-thin text-xl'>Cast:</p>
                        <p className='text-white mt-[3px]'>Himanshu Singh,Vansh Arora,Shaurya Rahlon,Ayushman Khurana</p>
                    </div>
                </div>
                <svg
                    className="bg-black md:w-10 md:h-10 w-8 h-8 absolute top-3 right-3 cursor-pointer rounded-full p-2"
                    onClick={() => window.history.back()}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    aria-hidden="true">
                    <path
                        className='fill-white'
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z">
                    </path>
                </svg>
        </div>    
    </BackgroundGradientAnimation>
  )
}

export default Moviedetails