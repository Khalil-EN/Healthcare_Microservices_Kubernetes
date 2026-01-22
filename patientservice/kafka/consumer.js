const { consumer, producer } = require('./kafkaClient');
const Patient = require('../Models/Patient');

const startConsumer = async () => {
  try {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic: 'validate-patient', fromBeginning: false });

    console.log("[PatientService] Consumer connected and subscribed to validate-patient");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { patientId, requestId } = JSON.parse(message.value.toString());
        console.log(`[PatientService] Received validation request for: ${patientId}`);

        let valid = false;
        try {
          const patient = await Patient.findById(patientId);
          valid = !!patient;
        } catch (error) {
          console.error('Validation error:', error.message);
        }

        await producer.send({
          topic: 'validate-patient-response',
          messages: [
            {
              key: requestId,
              value: JSON.stringify({ requestId, valid }),
            },
          ],
        });

        console.log(`[PatientService] Replied with valid=${valid} for ${patientId}`);
      },
    });
  } catch (error) {
    console.error("Error in doctor service consumer:", error);
  }
};

module.exports = startConsumer;
