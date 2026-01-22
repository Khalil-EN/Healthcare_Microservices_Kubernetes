const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'appointment-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'], 
});

const producer = kafka.producer();
const doctorConsumer = kafka.consumer({ groupId: 'appointment-validator' });
const patientConsumer = kafka.consumer({ groupId: 'appointment-validator2' });

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Kafka producer connection failed:', error.message);
  }
};

connectProducer();

module.exports = { kafka, producer, doctorConsumer, patientConsumer };
