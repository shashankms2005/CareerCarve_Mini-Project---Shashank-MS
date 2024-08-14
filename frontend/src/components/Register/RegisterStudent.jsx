import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";

const areasOfInterest = [
  "FMCG Sales",
  "Equity Research",
  "Digital Marketing",
  "Financial Analysis",
  "Consulting",
  "Human Resources",
  "Operations Management",
  "Entrepreneurship",
  "Business Development",
  "Supply Chain Management",
  "Project Management",
  "Product Management",
  "Market Research",
  "Strategic Planning",
  "Sales Management",
];

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    collegeName: "",
    areaOfInterest: "",
  });

  const url = "http://localhost:4000"; // Replace with your backend URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phoneNumber, collegeName, areaOfInterest } = formData;

    // Validation
    if (name.trim() === "") {
      toast.error("Name cannot be empty.");
      return;
    }
    if (email.trim() === "") {
      toast.error("Email cannot be empty.");
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Phone number should be a 10-digit number.");
      return;
    }
    if (collegeName.trim() === "") {
      toast.error("College name cannot be empty.");
      return;
    }
    if (areaOfInterest.trim() === "") {
      toast.error("Area of interest cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/students-register`, {
        name,
        email,
        phone_number: phoneNumber,
        college_name: collegeName,
        area_of_interest: areaOfInterest,
      });

      const newStudentId = response.data.Student_ID;
      console.log("Student ID:", newStudentId);

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        collegeName: "",
        areaOfInterest: "",
      });

      toast.success(
        `Registration successful! Your Student ID is ${newStudentId}`
      );
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      toast.error("Failed to register student. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Register as Student</h2>
        <ToastContainer />
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="college">College Name</label>
            <input
              type="text"
              id="college"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="Enter your college name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="interest">Area of Interest</label>
            <select
              id="interest"
              name="areaOfInterest"
              value={formData.areaOfInterest}
              onChange={handleChange}
              required
            >
              <option value="">Select an area of interest</option>
              {areasOfInterest.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterStudent;
