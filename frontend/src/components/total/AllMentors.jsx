import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './all.css';

const AllMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/all-mentors');
        setMentors(response.data); 
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchMentors();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>All Mentors</h1>
      <div className='all-grid'>
        {mentors.length > 0 ? (
          mentors.map((mentor) => (
            <div className='grid-items' key={mentor.id}>
              <h2>{mentor.name}</h2>
              <p><strong>Id:</strong> {mentor.id}</p>
              <p><strong>Email:</strong> {mentor.email}</p>
              <p><strong>Phone Number:</strong> {mentor.phone_number}</p>
              <p><strong>Company Name:</strong> {mentor.company_name}</p>
              <p><strong>Expertise Area:</strong> {mentor.expertise_area}</p>
            </div>
          ))
        ) : (
          <p>No mentors found.</p>
        )}
      </div>
    </>
  );
};

export default AllMentors;
