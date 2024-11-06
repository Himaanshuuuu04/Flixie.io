import React from 'react'
import { BackgroundGradientAnimation } from '../Gradient'
import NavBar from '../NavBar'
import TopBar from '../TopBar'
import Carousel from '../Carousel'
import Card from '../Card'
import MainLayout from '../MainLayout'

export default function Home() {
    return (
        <div className='h-screen w-screen overflow-x-hidden' >       
            <BackgroundGradientAnimation>
                <MainLayout/>
            </BackgroundGradientAnimation>
               
        </div>
    )
}