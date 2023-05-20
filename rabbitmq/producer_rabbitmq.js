const { stringify } = require("querystring");
const { parentPort, workerData } = require("worker_threads");
const amp = require("amqplib");
const { json } = require("express");

// funcion para crear la data aleatoria
function crear_data() {
	const caractares = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = Math.floor(Math.random() * 50);
	let text = "";
	for (let i = 0; i < length; i++) {
		text += caractares.charAt(Math.floor(Math.random() * caractares.length));
	}
	return text;
}

// funcion para enviar la data al servidor
function crear_json() {
	const data = crear_data();
	const timestamp = Date.now();
	const json = {
		Timestamp: timestamp,
		Data: data
	};

	return json;
}

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
		setInterval(() => {
			const msg = crear_json();
			channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
			console.log("Enviando mensaje, Device ID: " + workerData.id);
			console.log(JSON.stringify(msg));
		}, 500);
	} catch (err) {
		console.log("Error al conectar " + err);
	}
}
