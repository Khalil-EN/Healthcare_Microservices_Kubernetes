const { consumer, producer } = require('./kafkaClient');
const Doctor = require('../Model/Doctor');

const startConsumer = async () => {
  try {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic: 'validate-doctor', fromBeginning: false });

    console.log("[DoctorService] Consumer connected and subscribed to validate-doctor");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { doctorId, requestId } = JSON.parse(message.value.toString());
        console.log(`[DoctorService] Received validation request for: ${doctorId}`);

        let valid = false;
        try {
          const doctor = await Doctor.findById(doctorId);
          valid = !!doctor;
        } catch (error) {
          console.error('Validation error:', error.message);
        }

        await producer.send({
          topic: 'validate-doctor-response',
          messages: [
            {
              key: requestId,
              value: JSON.stringify({ requestId, valid }),
            },
          ],
        });

        console.log(`[DoctorService] Replied with valid=${valid} for ${doctorId}`);
      },
    });
  } catch (error) {
    console.error("Error in doctor service consumer:", error);
  }
};

module.exports = startConsumer;
