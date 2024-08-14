import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import './Mentorship.css'

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const sessionID = searchParams.get("sessionID");
  const url = "http://localhost:4000";
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/mentorship/confirm`, {
        success,
        sessionID,
      });
      if (response.data.success) {
        navigate(`/success?sessionID=${sessionID}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      navigate("/");
    }
  };
  

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
