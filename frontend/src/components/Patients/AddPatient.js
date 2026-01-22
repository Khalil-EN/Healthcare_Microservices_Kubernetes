import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../../services/patientService';
import './AddPatient.css'; // optional: for styling

function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodType: '',
    contact: '',
    email: '',
    address: '',
    emergencyContact: '',
    lastVisit: '',
    phase: 'consulting'
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createPatient(form);
      navigate('/patients');
    } catch (err) {
      console.error('Error creating patient:', err);
    }
  };

  return (
    <div className="add-patient-container">
      <h2>Add New Patient</h2>
      <form className="add-patient-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />

        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="bloodType" placeholder="Blood Type" value={form.bloodType} onChange={handleChange} required />
        <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="emergencyContact" placeholder="Emergency Contact" value={form.emergencyContact} onChange={handleChange} required />
        <input name="lastVisit" type="date" value={form.lastVisit} onChange={handleChange} required />

        <select name="phase" value={form.phase} onChange={handleChange} required>
          <option value="consulting">Consulting</option>
          <option value="treatment">Treatment</option>
          <option value="diagnosis">Diagnosis</option>
          <option value="follow-up">Follow-up</option>
        </select>

        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default AddPatient;
