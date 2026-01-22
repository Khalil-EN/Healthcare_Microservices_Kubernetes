import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDoctorById, getDoctors, deleteDoctor } from '../../services/doctorService';
import './DoctorList.css';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    getDoctors()
      .then((data) => {
        console.log("Doctors fetched:", data);
        setDoctors(data.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  const handleDelete = (id) => {
    deleteDoctor(id)
      .then(() => {
        setDoctors(doctors.filter(d => d._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting doctor:", error);
      });
  };

  const handleDetails = (id) => {
    
    navigate(`/doctors/${id}`);
  };

  const handleUpdate = (id) => {
   
    navigate(`/doctors/${id}/edit`);
  };

  return (
    <div className="doctor-list-container">
      <div className="doctor-header">
        <h2>Doctors</h2>
        <Link to="/doctors/add" className="add-btn">
          + Add Doctor
        </Link>
      </div>
      <ul className="doctor-list">
        {doctors.length > 0 ? (
          doctors.map(doc => (
            <li key={doc._id} className="doctor-item">
              <div className="doctor-info">
                <h3>{doc.fullName}</h3>
                <p><strong>ID:</strong> {doc._id}</p>
                <p><strong>Specialization:</strong> {doc.specialization}</p>
              </div>
              <div className="doctor-actions">
                <button className="btn btn-primary" onClick={() => handleDetails(doc._id)}>View Details</button>
                <button className="btn btn-warning" onClick={() => handleUpdate(doc._id)}>Update</button>
                <button className="btn btn-danger" onClick={() => handleDelete(doc._id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No doctors available</p>
        )}
      </ul>
    </div>
  );
}

export default DoctorList;
