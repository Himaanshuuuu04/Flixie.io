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
        <div className='bg-gradient-to-r from-pink-950 text-rose-950 w-3/6 m-auto mt-10 bg-black flex flex-col gap-8 rounded-2xl'>
                <img src={movie.image} alt="" className='w-full h-3/4 rounded-t-2xl object-cover' />
                <div className='flex flex-col items-start p-8 gap-4'>
                    <h1 className='text-4xl font-bold text-white'>{movie.title}</h1>
                    <div className='flex items-center justify-center'>
                        <p className='text-white text-xl'>{movie.description}</p>
                    </div>
                    <p className='text-white text-xl'>Watch in Hindi,English,Tamil,Telugu</p>
                    <div className='flex items-center gap-1'>
                        <p className='text-white font-thin text-xl'>Cast:</p>
                        <p className='text-white'>Himanshu Singh,Vansh Arora,Shaurya Rahlon,Ayushman Khurana</p>
                    </div>
                </div>
        </div>    
    </BackgroundGradientAnimation>
  )
}

export default Moviedetails