import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedStudentId,
  setSelectedArea,
  setTimeDuration,
  setMentor,
  setLoading,
  addPremiumCharge,
  setStartTiming,
} from "../../features/bookingSlice";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import './Book.css';

const BookingForm = () => {
  const navigate = useNavigate();
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

  const dispatch = useDispatch();
  const {
    selectedStudentId,
    selectedArea,
    timeDuration,
    price,
    mentor,
    loading,
    startTiming,
  } = useSelector((state) => state.booking);

  const [students, setStudents] = useState([]);
  const url = "http://localhost:4000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(`${url}/api/all-students`);
        setStudents(studentResponse.data);
      } catch (error) {
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleDurationChange = (e) => {
    const duration = e.target.value;
    dispatch(setTimeDuration(duration));
    // Update price based on duration if needed
    const newPrice = calculatePrice(duration);
    dispatch(setPrice(newPrice)); // You need to create setPrice action
  };

  const handleContinue = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(`${url}/api/find-mentor`, {
        params: {
          area_of_interest: selectedArea,
        },
      });
      dispatch(setMentor(response.data.mentor));
    } catch (error) {
      toast.error("Error finding mentor");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCustomMentor = () => {
    dispatch(addPremiumCharge());
    navigate("/custom-mentor");
  };

  const finalizeBooking = async () => {
    if (!mentor) {
      toast.error("Please select a mentor");
      return;
    }

    const bookingDetails = {
      studentId: selectedStudentId,
      mentorId: mentor.id,
      duration: timeDuration,
      price: price,
      areaOfInterest: selectedArea,
      startTiming: startTiming,
    };

    try {
      const response = await axios.post(
        `${url}/api/mentorship/finish`,
        bookingDetails
      );
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.error("Error processing payment");
      }
    } catch (error) {
      console.error("Error finalizing booking:", error);
      toast.error("Error finalizing booking");
    }
  };


  return (
    <div className="booking-form-container">
      <h2>Book a Session</h2>
      <ToastContainer />
      <form>
        <label htmlFor="student">Select Student</label>
        <select
          id="student"
          value={selectedStudentId}
          onChange={(e) => dispatch(setSelectedStudentId(e.target.value))}
        >
          <option value="">Select Student ID</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.id}
            </option>
          ))}
        </select>

        <label htmlFor="area">Area of Interest</label>
        <select
          id="area"
          value={selectedArea}
          onChange={(e) => dispatch(setSelectedArea(e.target.value))}
        >
          <option value="">Select Area of Interest</option>
          {areasOfInterest.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        <label htmlFor="duration">Time Duration</label>
        <select
          id="duration"
          value={timeDuration}
          onChange={handleDurationChange}
        >
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
        </select>

      
        <p>Price: ₹{price}</p>

        <button type="button" onClick={handleContinue}>
          Continue
        </button>
      </form>

      {loading && <p>Loading...</p>}

      {mentor && (
        <div className="mentor-details">
          <h3>Mentor Details</h3>
          <p>Name: {mentor.name}</p>
          <p>Expertise Area: {mentor.expertise_area}</p>
          <button onClick={handleCustomMentor}>Change Mentor</button>
          <button onClick={finalizeBooking}>Finish Order</button>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
