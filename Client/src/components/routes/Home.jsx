import React from 'react'
import { BackgroundGradientAnimation } from '../Gradient'
import NavBar from '../NavBar'
import TopBar from '../TopBar'


export default function Home() {
    return (
        <div >       
            <BackgroundGradientAnimation >
                <NavBar/>
                <TopBar/>
            </BackgroundGradientAnimation>
               
        </div>
    )
}