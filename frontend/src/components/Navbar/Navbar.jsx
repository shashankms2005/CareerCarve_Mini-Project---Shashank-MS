import React from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'

const navbar = () => {
  const Navigate=useNavigate();
  return (
    <div className='navbar'>
        <img src="/logo_welcome.png" onClick={()=>Navigate("/")}/>
        <div className='nav-conttainer'>
        <p onClick={()=>Navigate("/total-students")}>Total Students</p>
        <p onClick={()=>Navigate("/total-mentors")}> Total Mentors</p>
        <p onClick={()=>Navigate("/my-orders")}> Order history</p>
        <p onClick={()=>Navigate("/register")}> Register</p>
        </div>
        
    </div>
  )
}

export default navbar