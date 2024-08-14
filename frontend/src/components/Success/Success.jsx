import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../Navbar/Navbar'


const PaymentConfirmation = () => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const sessionID = query.get("sessionID");

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/mentorship/session-details`, {
          params: { sessionID }
        });
        setSessionDetails(response.data);
      } catch (error) {
        console.error("Error fetching session details:", error);
        setError("Failed to fetch session details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionID) {
      fetchSessionDetails();
    } else {
      setError("Session ID is missing.");
      setLoading(false);
    }
  }, [sessionID]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <><Navbar />
    <div className="payment-confirmation">
      <h1>Payment Confirmation</h1>
      {sessionDetails ? (
        <div className="session-details">
          <p><strong>Session ID:</strong> {sessionDetails.session_id}</p>
          <p><strong>Area of Interest:</strong> {sessionDetails.area_of_interest}</p>
          <p><strong>Duration:</strong> {sessionDetails.duration} minutes</p>
          <p><strong>Price:</strong> ₹{sessionDetails.price}</p>
          <p><strong>Start Time:</strong> {sessionDetails.start_time}</p>
          <p><strong>Status:</strong> {sessionDetails.status}</p>
        </div>
      ) : (
        <p>No session details available.</p>
      )}
    </div>
    </>
  );
};

export default PaymentConfirmation;
