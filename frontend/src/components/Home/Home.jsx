import React from 'react'
import Navbar from '../Navbar/Navbar'
import Hero from '../Hero/Hero'
import './Home.css'

const Home = () => {
  return (
   <>
   <Navbar />
   <Hero />
   <div className='footer'>
      <p>&copy;2024 Created by Shashank MS</p>
    </div>
   </>
  )
}

export default Home