import React, { useEffect, useState } from 'react';
import { getAppointments, deleteAppointment } from '../../services/appointmentService';
import { Link } from 'react-router-dom';
import './AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getAppointments().then((data) => setAppointments(data.data));
  }, []);

  const handleDelete = (id) => {
    deleteAppointment(id).then(() => {
      setAppointments(appointments.filter((appointment) => appointment._id !== id));
    });
  };

  return (
    <div className="appointment-list">
      <div className="appointment-header">
        <h2>Appointments</h2>
        <Link to="/appointments/add" className="add-btn">
          + Add Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
                <td>
                  <div className="action-btns">
                    <Link
                      to={`/appointments/${appointment._id}`}
                      className="view-btn"
                    >
                      View
                    </Link>
                    <Link
                      to={`/appointments/${appointment._id}/edit`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(appointment._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;
