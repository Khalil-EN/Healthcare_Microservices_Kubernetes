console.log("Loading tracing...");
require('./tracing/tracing');
console.log("Tracing loaded successfully");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('mongoose');
const Consul = require('consul');

const { getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment } = require('./Controllers/appointmentController');
const { startPatientConsumer } = require('./kafka/validators');
const { startDoctorConsumer } = require('./kafka/validators');

const CONSUL_HOST = process.env.CONSUL_HOST || 'consul';
const CONSUL_PORT = process.env.CONSUL_PORT || 8500;

const MONGO_HOST = process.env.MONGO_HOST || 'mongo';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWD = process.env.MONGO_PASSWD;

const app = express();
const client = require('prom-client');
const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });

const PORT = 4001;
const DB_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWD}@${MONGO_HOST}:${MONGO_PORT}/appointmentDB?authSource=admin`;
const APPOINTMENT_SERVICE = 'appointmentService';

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

startPatientConsumer();
startDoctorConsumer();
client.collectDefaultMetrics();

consul.agent.service.register(
  {
    name: APPOINTMENT_SERVICE,
    address: 'appointmentservice', 
    port: PORT,
    check: {
      http: `http://appointmentservice:${PORT}/health`, 
      interval: '10s',
    },
  },
  (err) => {
    if (err) {
      console.error('Consul registration failed:', err);
    } else {
      console.log('Appointment service registered with Consul');
    }
  }
);

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/appointments', getAppointments);
app.get('/appointments/:id', getAppointment);
app.post('/appointments', createAppointment);
app.put('/appointments/update/:id', updateAppointment);
app.delete('/appointments/delete/:id', deleteAppointment);


db.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connected successfully`);
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });
