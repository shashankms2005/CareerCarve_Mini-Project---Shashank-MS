import React from 'react';
import './Hero.css';
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="home-hero" id="menu">
      <div className="header-content">
        <h2>CareerCarve Mini Project for Technology Intern</h2>
        <p>
          CareerCarve provides placement training to MBA students, including 1x1 Mock Interviews where students are interviewed by mentors for a set duration. 
          This platform allows students to schedule these interviews based on their availability and area of interest, while prioritizing the mentor's schedule. 
          Students can book sessions with mentors who specialize in specific MBA roles, and have the option to select a preferred mentor for an additional fee.
        </p>
        <button className="hero-btn" onClick={() => navigate('/Book')}>Book here</button>
      </div>
    </div>
  )
}

export default Hero;
