import axios from 'axios';

const API_URL = '/api/doctors';

export const getDoctors = () => axios.get(API_URL);
export const getDoctorById = id => axios.get(`${API_URL}/${id}`);
export const addDoctor = data => axios.post(API_URL, data);
export const updateDoctor = (id, data) => axios.put(`${API_URL}/update/${id}`, data);
export const deleteDoctor = id => axios.delete(`${API_URL}/delete/${id}`);