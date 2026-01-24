console.log("Loading tracing...");
require('./tracing/tracing'); 
console.log("Tracing loaded successfully");

const express = require('express');
const axios = require('axios');
const Consul = require('consul');
const cors = require('cors');


const app = express();
const PORT = 5000;
const DOCTOR_SERVICE = 'doctorService';
const PATIENT_SERVICE = 'patientService';
const APPOINTMENT_SERVICE = 'appointmentService';
const CONSUL_HOST = process.env.CONSUL_HOST || 'consul';


const consul = new Consul({host: CONSUL_HOST});

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));

async function getServiceURL(SERVICE_NAME) {
    try {
        const services = await consul.agent.service.list();
        const Service = Object.values(services).find(service => service.Service === SERVICE_NAME);

        if (!Service) {
            throw new Error(`${SERVICE_NAME} not found in Consul`);
        }

        return `http://${Service.Address}:${Service.Port}`;
    } catch (error) {
        console.error(`Failed to retrieve ${SERVICE_NAME} location from Consul:`, error.message);
        throw error;
    }
}

app.get('/appointments', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(APPOINTMENT_SERVICE);
      const response = await axios.get(`${SERVICE_URL}/appointments`, { params: req.query });
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.get('/appointments/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(APPOINTMENT_SERVICE);
      const response = await axios.get(`${SERVICE_URL}/appointments/${req.params.id}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.post('/appointments', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(APPOINTMENT_SERVICE);
      const response = await axios.post(`${SERVICE_URL}/appointments`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.put('/appointments/update/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(APPOINTMENT_SERVICE);
      const response = await axios.put(`${SERVICE_URL}/appointments/update/${req.params.id}`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.delete('/appointments/delete/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(APPOINTMENT_SERVICE);
      const response = await axios.delete(`${SERVICE_URL}/appointments/delete/${req.params.id}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  /** PATIENTS **/
  app.get('/patients', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(PATIENT_SERVICE);
      const response = await axios.get(`${SERVICE_URL}/patients`, { params: req.query });
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.get('/patients/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(PATIENT_SERVICE);
      const response = await axios.get(`${SERVICE_URL}/patients/${req.params.id}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.post('/patients', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(PATIENT_SERVICE);
      const response = await axios.post(`${SERVICE_URL}/patients`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.put('/patients/update/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(PATIENT_SERVICE);
      const response = await axios.put(`${SERVICE_URL}/patients/update/${req.params.id}`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.delete('/patients/delete/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(PATIENT_SERVICE);
      const response = await axios.delete(`${SERVICE_URL}/patients/delete/${req.params.id}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  /** DOCTORS **/
  app.get('/doctors', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(DOCTOR_SERVICE);
      const response = await axios.get(`${SERVICE_URL}/doctors`, { params: req.query });
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.get('/doctors/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(DOCTOR_SERVICE);
      const response = await axios.get(`${SERVICE_URL}/doctors/${req.params.id}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.post('/doctors', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(DOCTOR_SERVICE);
      const response = await axios.post(`${SERVICE_URL}/doctors`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.put('/doctors/update/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(DOCTOR_SERVICE);
      const response = await axios.put(`${SERVICE_URL}/doctors/update/${req.params.id}`, req.body);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.delete('/doctors/delete/:id', async (req, res) => {
    try {
      const SERVICE_URL = await getServiceURL(DOCTOR_SERVICE);
      const response = await axios.delete(`${SERVICE_URL}/doctors/delete/${req.params.id}`);
      res.status(response.status).json(response.data);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  function handleError(res, error) {
    console.error('Error processing request:', error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: 'Error processing request' });
  }

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
