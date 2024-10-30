import React from 'react'
import { BackgroundGradientAnimation } from '../Gradient'
import NavBar from '../NavBar'
import TopBar from '../TopBar'
import Carousel from '../Carousel'
import Card from '../Card'

export default function Home() {
    return (
        <div >       
            <BackgroundGradientAnimation>
                <NavBar/>
                <TopBar/>
                <div className='  ml-[21rem] mt-10 mr-10 mb-10  z-50 '>
                    <Carousel/>
                    <h2 className='text-white mt-10 -mb-8 text-2xl z-40'>You might like...</h2>
                    <Card/>
                </div>
                
            </BackgroundGradientAnimation>
               
        </div>
    )
}