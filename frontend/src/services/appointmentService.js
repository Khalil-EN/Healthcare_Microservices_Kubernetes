import axios from 'axios';

const API_URL = '/api/appointments';

export const getAppointments = () => axios.get(API_URL);
export const getAppointmentById = id => axios.get(`${API_URL}/${id}`);
export const createAppointment = data => axios.post(API_URL, data);
export const updateAppointment = (id, data) => axios.put(`${API_URL}/update/${id}`, data);
export const deleteAppointment = id => axios.delete(`${API_URL}/delete/${id}`);
