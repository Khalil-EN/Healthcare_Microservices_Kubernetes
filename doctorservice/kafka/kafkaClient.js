const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'doctor-service',
  brokers:  [process.env.KAFKA_BROKER || 'kafka:9092'],  
});

const producer = kafka.producer();
const connectProducer = async () => {
    try {
      await producer.connect();
      console.log("[DoctorService] Producer connected.");
    } catch (error) {
      console.error("[DoctorService] Error connecting producer:", error);
    }
  };
  
  connectProducer();
  
const consumer = kafka.consumer({ groupId: 'doctor-service-validator' });

module.exports = { kafka, producer, consumer };
