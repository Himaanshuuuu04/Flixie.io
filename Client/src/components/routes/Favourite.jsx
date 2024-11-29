import React from 'react'
import FavouriteLayout from '../FavouriteLayout.jsx'
import { BackgroundGradientAnimation } from '../Gradient.jsx'

const Favourite = () => {
  let a=localStorage.getItem("likedMovies");
  console.log(a);
  return (
    <BackgroundGradientAnimation> 
    <FavouriteLayout />
    </BackgroundGradientAnimation>

  )
}

export default Favourite