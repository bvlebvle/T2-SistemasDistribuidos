const { stringify } = require("querystring");
const { parentPort, workerData } = require("worker_threads");
const amp = require("amqplib");
const { json } = require("express");

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
	const local = "ServirEnLocal";

	const delivery_local = "DeliveryPorLocal";
	const delivery_app1 = "DeliveryPorPedidosYa";
	const delivery_app2 = "DeliveryPorUbertEats";
	const delivery_app3 = "DeliveryPorRappi";

	try {
		const conn = await amp.connect(rabbitSettings);
		console.log("Conectado al servidor RabbitMQ");

		const channel = await conn.createChannel();
		console.log("Canal creado");

		const res = await channel.assertQueue(queue);
		console.log("Cola creada");

		// setInterval(() => {
		// 	const msg = crear_json();
		// 	channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
		// 	console.log("Enviando mensaje, Device ID: " + workerData.id);
		// 	console.log(JSON.stringify(msg));
		// }, 1000);

		//crear colas
		const cola1 = await channel.assertQueue(local);
		const cola2 = await channel.assertQueue(delivery_local);
		const cola3 = await channel.assertQueue(delivery_app1);
		const cola4 = await channel.assertQueue(delivery_app2);
		const cola5 = await channel.assertQueue(delivery_app3);

		//crear key para el exchange
		const key_local = "local";
		const key_delivery_local = "delivery_local";
		const key_delivery_app1 = "delivery_pedidosya";
		const key_delivery_app2 = "delivery_ubereats";
		const key_delivery_app3 = "delivery_rappi";

		const exchange = "Restaurante";
		const exchange_tipe = "direct";

		//crear exchange
		const creacion_exchange = await channel.assertExchange(exchange, exchange_tipe);

		//bind de las colas con el exchange
		const bind1 = await channel.bindQueue(local, exchange, key_local);
		const bind2 = await channel.bindQueue(delivery_local, exchange, key_delivery_local);
		const bind3 = await channel.bindQueue(delivery_app1, exchange, key_delivery_app1);
		const bind4 = await channel.bindQueue(delivery_app2, exchange, key_delivery_app2);
		const bind5 = await channel.bindQueue(delivery_app3, exchange, key_delivery_app3);

		msg = crear_json();

		setInterval(() => {
			if (workerData.id % 5 == 0) {
				console.log("A cola local");
				channel.publish(exchange, key_local, Buffer.from(JSON.stringify(msg)));
			} else if (workerData.id % 5 == 1) {
				console.log("A cola delivery local");
				channel.publish(exchange, key_delivery_local, Buffer.from(JSON.stringify(msg)));
			} else if (workerData.id % 5 == 2) {
				console.log("A cola delivery app1");
				channel.publish(exchange, key_delivery_app1, Buffer.from(JSON.stringify(msg)));
			} else if (workerData.id % 5 == 3) {
				console.log("A cola delivery app2");
				channel.publish(exchange, key_delivery_app2, Buffer.from(JSON.stringify(msg)));
			} else if (workerData.id % 5 == 4) {
				console.log("A cola delivery app3");
				channel.publish(exchange, key_delivery_app3, Buffer.from(JSON.stringify(msg)));
			}
		}, 1000);
	} catch (err) {
		console.log("Error al conectar " + err);
	}
}
