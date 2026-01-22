import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoctorById, updateDoctor } from '../../services/doctorService';
import './EditDoctor.css'; 

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    phoneNumber: '',
    specialization: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await getDoctorById(id);
        const doctor = res.data;
        // Pre-fill only the fields we allow to edit
        setForm({
          email: doctor.email || '',
          contact: doctor.phoneNumber || '',
          specialization: doctor.specialization || ''
        });
      } catch (err) {
        console.error('Failed to load doctor:', err);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await updateDoctor(id, form); // Only send updated fields
      navigate('/doctors');
    } catch (err) {
      console.error('Failed to update doctor:', err);
    }
  };

  return (
    <div className="edit-doctor-container">
      <form onSubmit={handleSubmit} className="edit-doctor-form">
        <h2>Edit Doctor</h2>

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label>Phonenumber:</label>
        <input
          name="phonenumber"
          type="text"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label>Specialization:</label>
        <input
          name="specialization"
          type="text"
          value={form.specialization}
          onChange={handleChange}
          required
          className="input-field"
        />

        <button type="submit" className="submit-btn">Update</button>
      </form>
    </div>
  );
};

export default EditDoctor;
