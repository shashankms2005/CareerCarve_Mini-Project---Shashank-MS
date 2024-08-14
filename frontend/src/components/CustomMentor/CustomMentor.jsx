import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { setMentor } from "../../features/bookingSlice";
import Navbar from "../Navbar/Navbar";

const CustomMentor = () => {
  const url = "http://localhost:4000";
  const [customMentors, setCustomMentors] = useState([]);
  const { selectedArea, mentor, selectedStudentId, timeDuration, price } =
    useSelector((state) => state.booking);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      toast("Additional charge of ₹650 is applied!");
      try {
        const result = await axios.get(`${url}/api/custom-mentors`, {
          params: { area_of_interest: selectedArea },
        });
        setCustomMentors(result.data.mentor);
      } catch (error) {
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, [selectedArea]);

  const handleSelectMentor = (e) => {
    const selectedMentor = customMentors.find(
      (mentor) => mentor.id === parseInt(e.target.value)
    );
    dispatch(setMentor(selectedMentor));
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
    <>
      <Navbar />
      <div style={styles.container}>
        <ToastContainer />
        <h2 style={styles.heading}>
          List of mentors with expertise in {selectedArea} are listed
        </h2>
        {customMentors.length > 0 ? (
          <>
            {customMentors.map((mentor) => (
              <p key={mentor.id} style={styles.mentorDetails}>
                {mentor.name} - {mentor.company_name}
              </p>
            ))}
            <p style={styles.selectLabel}>Select a Mentor</p>
            <div>
              <select onChange={handleSelectMentor} style={styles.select}>
                <option value="">Select a Mentor</option>
                {customMentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name} - {mentor.expertise_area}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <p style={styles.noMentors}>
            No mentors available for this area of interest.
          </p>
        )}

        <button onClick={finalizeBooking} style={styles.button}>
          Finalize Booking
        </button>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "20px",
    marginBottom: "20px",
    textAlign: "center",
  },
  mentorDetails: {
    textAlign: "center",
    fontSize: "16px",
    marginBottom: "10px",
  },
  selectLabel: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontSize: "16px",
  },
  noMentors: {
    fontSize: "16px",
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
};

export default CustomMentor;
