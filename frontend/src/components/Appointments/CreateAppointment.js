import React, { useState } from 'react';
import { createAppointment } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import './CreateAppointment.css'; 

const AddAppointment = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    patientName: '',
    doctorName: '',
    specialization: '',
    date: '',
    time: '',
    status: 'Scheduled',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAppointment(form);
    navigate('/appointments');
  };

  return (
    <div className="add-appointment-container">
      <h2>Add Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          placeholder="Patient Id"
          required
        />
        <input
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          placeholder="Doctor Id"
          required
        />
        <input
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          required
        />
        <input
          name="doctorName"
          value={form.doctorName}
          onChange={handleChange}
          placeholder="Doctor Name"
          required
        />
        <input
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit">Add Appointment</button>
      </form>
    </div>
  );
};

export default AddAppointment;
