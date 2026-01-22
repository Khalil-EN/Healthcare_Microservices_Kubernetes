import React, { useEffect, useState } from 'react';
import { getAppointmentById } from '../../services/appointmentService';
import { useParams } from 'react-router-dom';
import './AppointmentDetails.css';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    getAppointmentById(id).then(res => setAppointment(res.data));
  }, [id]);

  if (!appointment) return <p className="loading-text">Loading...</p>;

  return (
    <div className="appointment-details-card">
      <h2>Appointment Details</h2>
      <div className="detail-row"><strong>Date:</strong> {appointment.date}</div>
      <div className="detail-row"><strong>Time:</strong> {appointment.time}</div>
      <div className="detail-row"><strong>Status:</strong> {appointment.status}</div>
      <div className="detail-row"><strong>Reason:</strong> {appointment.reason || 'N/A'}</div>
      <div className="detail-row"><strong>Doctor ID:</strong> {appointment.doctorId}</div>
      <div className="detail-row"><strong>Patient ID:</strong> {appointment.patientId}</div>
    </div>
  );
};

export default AppointmentDetails;
