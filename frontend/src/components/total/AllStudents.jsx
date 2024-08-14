import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './all.css';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/all-students');
        setStudents(response.data); 
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>All Students</h1>
      <div className='all-grid'>
        {students.length > 0 ? (
          students.map((student) => (
            <div className='grid-items' key={student.id}>
              <h2>{student.name}</h2>
              <p><strong>Id:</strong> {student.id}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone Number:</strong> {student.phone_number}</p>
              <p><strong>College Name:</strong> {student.college_name}</p>
              <p><strong>Area of Interest:</strong> {student.area_of_interest}</p>
            </div>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>
    </>
  );
};

export default AllStudents;
