const { Kafka } = require("kafkajs");

const kafka = new Kafka({
	clientId: "my-kafka-consumer",
	brokers: ["localhost:9092"]
});

// Create a consumer
const consumer = kafka.consumer({ groupId: "my-consumer-group-2" });

// Function to initialize the consumer
const initializeConsumer = async () => {
	await consumer.connect();
	await consumer.subscribe({ topic: "test", fromBeginning: true });
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log(`Received message from topic "${topic}", partition ${partition}: ${message.value}`);
		}
	});
	console.log("Consumer initialized and listening for messages");
};

// Initialize the consumer
const main = async () => {
	initializeConsumer().catch(console.error);
};

main();
