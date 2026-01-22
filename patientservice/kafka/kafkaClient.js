const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'patient-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();
const connectProducer = async () => {
    try {
      await producer.connect();
      console.log("[PatientService] Producer connected.");
    } catch (error) {
      console.error("[PatientService] Error connecting producer:", error);
    }
  };
  
  connectProducer();
  
const consumer = kafka.consumer({ groupId: 'patient-service-validator' });

module.exports = { kafka, producer, consumer };
