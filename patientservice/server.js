console.log("Loading tracing...");
require('./tracing/tracing');
console.log("Tracing loaded successfully");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('mongoose');
const Consul = require('consul');


const {getPatients, getPatient, createPatient, updatePatient, deletePatient} = require('./Controllers/patientController');
const startConsumer = require('./kafka/consumer');
const client = require('prom-client');

startConsumer();
client.collectDefaultMetrics();

const CONSUL_HOST = process.env.CONSUL_HOST || 'consul';
const CONSUL_PORT = process.env.CONSUL_PORT || 8500;

const MONGO_HOST = process.env.MONGO_HOST || 'mongo';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWD = process.env.MONGO_PASSWD;

const app = express();
const consul = new Consul({ host: CONSUL_HOST, port: CONSUL_PORT });


const PORT = 4002;
const DB_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWD}@${MONGO_HOST}:${MONGO_PORT}/appointmentDB?authSource=admin`;
const PATIENT_SERVICE = 'patientService';



app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,PATCH,DELETE",
      credentials: true, 
    })
  );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 



consul.agent.service.register(
    {
        name: PATIENT_SERVICE,
        address: 'patientservice',
        port: PORT,
        check: {
            http: `http://patientservice:${PORT}/health`,
            interval: '10s',
        },
    },
    (err) => {
        if (err) console.error('Consul registration failed:', err);
        else console.log('Patient service registered with Consul');
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
app.get('/patients', getPatients);    
app.get('/patients/:id', getPatient);
app.post('/patients', createPatient);
app.put('/patients/update/:id', updatePatient);
app.delete('/patients/delete/:id', deletePatient);




db.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(PORT, () => {
        console.log(`Database connected successfully`);
        console.log(`Server is running on port ${PORT}`);
      });
}).catch((err) => 
    console.log(err)
);
