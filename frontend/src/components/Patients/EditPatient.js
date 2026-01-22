import React, { useEffect, useState } from 'react';
import { getPatient, updatePatient } from '../../services/patientService';
import { useParams, useNavigate } from 'react-router-dom';
import "./EditPatient.css";

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    bloodType: '',
    contact: '',
    email: '',
    address: '',
    emergencyContact: '',
    lastVisit: '',
    phase: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatient(id);
        const patient = response.data;
        patient.lastVisit = new Date(patient.lastVisit).toISOString().split('T')[0];
        setForm(patient);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch patient data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updatePatient(id, form);
      navigate('/patients');
    } catch (err) {
      console.error(err);
      setError('Failed to update patient.');
    }
  };

  if (loading) return <p className="loading">Loading patient data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="edit-patient-container">
      <div className="card">
        <h2>Edit Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Blood Type</label>
            <select name="bloodType" value={form.bloodType} onChange={handleChange} required>
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
          </div>

          <div className="form-group">
            <label>Emergency Contact</label>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" required />
          </div>

          <div className="form-group">
            <label>Last Visit</label>
            <input name="lastVisit" type="date" value={form.lastVisit} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phase</label>
            <select name="phase" value={form.phase} onChange={handleChange} required>
              <option value="">Select Phase</option>
              <option value="consulting">Consulting</option>
              <option value="treatment">Treatment</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>

          <button type="submit">Update Patient</button>
        </form>
      </div>
    </div>
  );
}

export default EditPatient;
