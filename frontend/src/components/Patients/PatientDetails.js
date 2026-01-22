import React, { useEffect, useState } from 'react';
import { getPatient } from '../../services/patientService';
import { useParams } from 'react-router-dom';
import './PatientDetails.css';

function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    getPatient(id)
      .then(res => setPatient(res.data)) 
      .catch(err => console.error("Error fetching patient:", err));
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="patient-detail-container">
      <h2 className="patient-detail-title">Patient Details</h2>
      <div className="patient-detail-info">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Blood Type:</strong> {patient.bloodType}</p>
        <p><strong>Contact:</strong> {patient.contact}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
        <p><strong>Last Visit:</strong> {new Date(patient.lastVisit).toLocaleDateString()}</p>
        <p><strong>Phase:</strong> {patient.phase}</p>
      </div>
    </div>
  );
}

export default PatientDetail;
