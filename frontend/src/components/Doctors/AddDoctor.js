import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoctor } from '../../services/doctorService';
import './AddDoctor.css'; // Make sure to import the CSS file

const AddDoctor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '', gender: '',
    specialization: '', yearsOfExperience: '', availability: '', address: '', status: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await addDoctor(form);
    navigate('/doctors');
  };

  return (
    <div className="add-doctor-container">
      <form onSubmit={handleSubmit} className="add-doctor-form">
        <h2>Add Doctor</h2>

        {Object.keys(form).map(key => (
          <div key={key} className="form-group">
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              required
              className="input-field"
            />
          </div>
        ))}

        <button type="submit" className="submit-btn">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
