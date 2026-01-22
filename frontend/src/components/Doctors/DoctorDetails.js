import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoctorById } from '../../services/doctorService';
import './DoctorDetails.css';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      const data = await getDoctorById(id);
      console.log(data.data);
      setDoctor(data.data);
    };
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className='doctor-details-container'>
      <h2>Doctor Details</h2>
      <p><strong>Name:</strong> {doctor.fullName}</p>
      <p><strong>Gender:</strong> {doctor.gender}</p>
      <p><strong>Email:</strong> {doctor.email}</p>
      <p><strong>Phonenumber:</strong> {doctor.phoneNumber}</p>
      <p><strong>Specialization:</strong> {doctor.specialization}</p>
      <p><strong>Years of experience:</strong> {doctor.yearsOfExperience}</p>
      <p><strong>Availability:</strong> {doctor.availability}</p>
      <p><strong>Address:</strong> {doctor.address}</p>
    </div>
  );
};

export default DoctorDetails;
