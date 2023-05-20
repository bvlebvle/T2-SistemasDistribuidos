const amp = require("amqplib");
const { workerData } = require("worker_threads");
const { json } = require("express");

const rabbitSettings = {
	protocol: "amqp",
	hostname: "localhost",
	port: 5672,
	username: "vale_diaz",
	password: "vale_diaz",
	vhost: "/",
	authMechanism: ["PLAIN", "AMQPLAIN", "EXTERNAL"]
};

connect();

async function connect() {
	const queue = "data";

	try {
		const conn = await amp.connect(rabbitSettings);
		console.log("Conectado al servidor RabbitMQ");

		const channel = await conn.createChannel();
		console.log("Canal creado");

		const res = await channel.assertQueue(queue);
		console.log("Cola creada");

		console.log("Esperando mensajes...");

		channel.consume(queue, (msg) => {
			let mensaje_consumido = JSON.parse(msg.content.toString());
			const id_consumer = workerData.id;

			console.log("---------------------------------------");
			console.log("ID de consumidor: " + id_consumer);
			console.log(mensaje_consumido);
			console.log("");
			//para elidir el mensaje
			channel.ack(msg);
		});
	} catch (err) {
		console.log("Error al conectar " + err);
	}
}
