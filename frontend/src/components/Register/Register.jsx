import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 
const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <h2>Register As</h2>
      <div className="register-buttons">
        <button 
          className="register-btn student-btn" 
          onClick={() => navigate('/register-student')}
        >
          Student
        </button>
        <button 
          className="register-btn mentor-btn" 
          onClick={() => navigate('/register-mentor')}
        >
          Mentor
        </button>
      </div>
    </div>
  );
}

export default Register;
