import axios from 'axios';

const API_URL = '/api/patients';

export const getPatients = () => axios.get(API_URL);
export const getPatient = id => axios.get(`${API_URL}/${id}`);
export const createPatient = data => axios.post(API_URL, data);
export const updatePatient = (id, data) => axios.put(`${API_URL}/update/${id}`, data);
export const deletePatient = id => axios.delete(`${API_URL}/delete/${id}`);