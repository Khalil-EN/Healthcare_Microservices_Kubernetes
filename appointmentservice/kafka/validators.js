const { producer, doctorConsumer, patientConsumer } = require('./kafkaClient');
const { v4: uuidv4 } = require('uuid');

const pendingDoctorRequests = new Map(); 


const startDoctorConsumer = async () => {
  await doctorConsumer.connect();
  await doctorConsumer.subscribe({ topic: 'validate-doctor-response', fromBeginning: false });

  await doctorConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { requestId, valid } = JSON.parse(message.value.toString());
      console.log(`[AppointmentService] Received validation response for ${requestId}: ${valid}`);
      
      const resolver = pendingDoctorRequests.get(requestId);
      if (resolver) {
        resolver(valid);
        pendingDoctorRequests.delete(requestId);
      }
    }
  });
};

const validateDoctor = async (doctorId) => {
  const requestId = uuidv4();

  await producer.send({
    topic: 'validate-doctor',
    messages: [
      {
        key: requestId,
        value: JSON.stringify({ doctorId, requestId }),
      },
    ],
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingDoctorRequests.delete(requestId);
      reject(new Error("Timeout waiting for doctor validation"));
    }, 5000);

    pendingDoctorRequests.set(requestId, (valid) => {
      clearTimeout(timeout);
      resolve(valid);
    });
  });
};

const pendingPatientRequests = new Map(); 

let isPatientConsumerStarted = false;

const startPatientConsumer = async () => {
  if (isPatientConsumerStarted) return;

  await patientConsumer.connect();
  await patientConsumer.subscribe({ topic: 'validate-patient-response', fromBeginning: false });

  await patientConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { requestId, valid } = JSON.parse(message.value.toString());
      console.log(`[AppointmentService] Received validation response for ${requestId}: ${valid}`);

      const resolver = pendingPatientRequests.get(requestId);
      if (resolver) {
        resolver(valid);
        pendingPatientRequests.delete(requestId);
      }
    }
  });

  isPatientConsumerStarted = true;
};

const validatePatient = async (patientId) => {
  const requestId = uuidv4();

  await producer.send({
    topic: 'validate-patient',
    messages: [
      {
        key: requestId,
        value: JSON.stringify({ patientId, requestId }),
      },
    ],
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingPatientRequests.delete(requestId);
      reject(new Error("Timeout waiting for patient validation"));
    }, 5000); 

    pendingPatientRequests.set(requestId, (valid) => {
      clearTimeout(timeout);
      resolve(valid);
    });
  });
};



module.exports = { validateDoctor, validatePatient, startDoctorConsumer,startPatientConsumer};