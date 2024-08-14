import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RegisterMentor.css";
import Navbar from "../Navbar/Navbar";

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

const RegisterMentor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    expertiseArea: "",
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

    const { name, email, phoneNumber, companyName, expertiseArea } = formData;

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
    if (expertiseArea.trim() === "") {
      toast.error("Expertise area cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/mentors-register`, {
        name,
        email,
        phone_number: phoneNumber,
        company_name: companyName,
        expertise_area: expertiseArea,
      });

      const newMentorId = response.data.Mentor_ID;
      console.log("Mentor ID:", newMentorId);

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        expertiseArea: "",
      });

      toast.success(
        `Registration successful! Your Mentor ID is ${newMentorId}`
      );
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      toast.error("Failed to register mentor. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Register as Mentor</h2>
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
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="expertise">Expertise Area</label>
            <select
              id="expertise"
              name="expertiseArea"
              value={formData.expertiseArea}
              onChange={handleChange}
              required
            >
              <option value="">Select an area of expertise</option>
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

export default RegisterMentor;
