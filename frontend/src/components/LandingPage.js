import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-page">
      <h1>Welcome to the Health Management System</h1>
      <div className="buttons-container">
        <button onClick={() => handleNavigate('/doctors')} className="button">
          View Doctors
        </button>
        <button onClick={() => handleNavigate('/patients')} className="button">
          View Patients
        </button>
        <button onClick={() => handleNavigate('/appointments')} className="button">
          View Appointments
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
