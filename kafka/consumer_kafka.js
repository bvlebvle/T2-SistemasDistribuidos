const { Kafka } = require("kafkajs");

const kafka = new Kafka({
	clientId: "my-kafka-consumer",
	brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "my-consumer-group-1" });

const initializeConsumer = async () => {
	await consumer.connect();
	await consumer.subscribe({ topic: "test", fromBeginning: true });
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log(`Mensaje revicido de topico "${topic}", partition ${partition}: ${message.value}`);
		}
	});
	console.log("Consumidor listo!");
};

const main = async () => {
	initializeConsumer().catch(console.error);
};

main();
