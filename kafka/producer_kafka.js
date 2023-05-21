const { Kafka } = require("kafkajs");
const { send } = require("process");
const { workerData } = require("worker_threads");

function crear_data() {
	const caractares = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = Math.floor(Math.random() * 50);
	let text = "";
	for (let i = 0; i < length; i++) {
		text += caractares.charAt(Math.floor(Math.random() * caractares.length));
	}
	return text;
}
function crear_json() {
	const data = crear_data();
	const timestamp = Date.now();
	const json = {
		Timestamp: timestamp,
		Data: data
	};

	return json;
}

const kafka = new Kafka({
	clientId: "my-kafka-producer",
	brokers: ["localhost:9092"]
});

const producer = kafka.producer();

const initializeProducer = async () => {
	await producer.connect();
	console.log("Producer connected to Kafka");
};

const sendMessage = async (topic, message) => {
	try {
		await producer.send({
			topic: topic,
			messages: [{ value: message }]
		});
		console.log("Device: " + workerData.id + " " + message);
	} catch (error) {
		console.error("Error sending message:", error);
	}
};

const main = async () => {
	await initializeProducer().catch(console.error);

	const topic = "test";
	const message = JSON.stringify(crear_json());

	sendMessage(topic, message).catch(console.error);
};

setInterval(() => {
	const topic = "test";
	const message = JSON.stringify(crear_json());
	sendMessage(topic, message).catch(console.error);
}, 500);

main();
