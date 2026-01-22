import React, { useEffect, useState } from 'react';
import { getAppointmentById, updateAppointment } from '../../services/appointmentService';
import { useParams, useNavigate } from 'react-router-dom';
import './EditAppointment.css';

const EditAppointment = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getAppointmentById(id).then(res => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAppointment(id, form);
    alert('Appointment updated!');
    navigate('/appointments');
  };

  return (
    <div className="edit-appointment-container">
      <h2>Edit Appointment</h2>
      <form className="edit-appointment-form" onSubmit={handleSubmit}>
        <label>Date & Time</label>
        <input
          name="date"
          type="datetime-local"
          value={form.date || ''}
          onChange={handleChange}
          required
        />

        <label>Reason</label>
        <input
          name="reason"
          value={form.reason || ''}
          onChange={handleChange}
          placeholder="Reason for appointment"
          required
        />

        <button type="submit" className="update-btn">Update Appointment</button>
      </form>
    </div>
  );
};

export default EditAppointment;
