import { useState } from 'react'
import './App.css'
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import AllStudents from './components/total/AllStudents.jsx';
import AllMentors from './components/total/AllMentors.jsx';
import RegisterMentor from './components/Register/RegisterMentor.jsx';
import RegisterStudent from './components/Register/RegisterStudent.jsx';
import Book from './components/Book/Book.jsx';
import CustomMentor from './components/CustomMentor/CustomMentor.jsx';
import Mentorship from './components/Mentorship/Mentorship.jsx';
import MyOrders from './components/MyOrders/MyOrders.jsx';
import Success from './components/Success/Success.jsx'

function App() {

  return (
   <>
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/total-students" element={<AllStudents />} />
          <Route path="/total-mentors" element={<AllMentors />} />
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-mentor" element={<RegisterMentor />} />
          <Route path="/Book" element={<Book />} />
          <Route path="/custom-mentor" element={<CustomMentor />} />
          <Route path="/mentorship/confirm" element={<Mentorship />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/success" element={<Success />} />
          
        </Routes>
        </>
  )
}

export default App
