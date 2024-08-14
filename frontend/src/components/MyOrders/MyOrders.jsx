import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./MyOrders.css"; 
import Navbar from '../Navbar/Navbar';

const StudentSessionHistory = () => {
  const [studentId, setStudentId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = "http://localhost:4000";

  const handleFetchSessions = async () => {
    if (!studentId) {
      toast.error("Please enter a student ID");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.get(`${url}/api/mentorship/sessions/${studentId}`);
      if (result.data.length === 0) {
        toast.info("No sessions found for this student ID.");
      }
      setSessions(result.data);
    } catch (error) {
      console.error("Error fetching mentorship sessions:", error);
      toast.error("Error fetching sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <ToastContainer />
        <h2 className="heading">Enter Student ID to View Mentorship History</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="input"
          />
          <button onClick={handleFetchSessions} className="button">
            Get History
          </button>
        </div>
        {loading && <div className="spinner">Loading...</div>}
        {sessions.length > 0 ? (
          <ul>
            {sessions.map((session) => (
              <li key={session.session_id} className="session-item">
                <p>Session ID: {session.session_id}</p>
                <p>Mentor: {session.mentor_name}</p>
                <p>Duration: {session.duration} mins</p>
                <p>Price: ₹{session.price}</p>
                <p>Area of Interest: {session.area_of_interest}</p>
                <p>Status: {session.status}</p>
                <p>Date: {new Date(session.date).toLocaleString()}</p>
                <p>Payment: {session.payment ? "Completed" : "Pending"}</p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No sessions found for this student ID.</p>
        )}
      </div>
    </>
  );
};

export default StudentSessionHistory;
