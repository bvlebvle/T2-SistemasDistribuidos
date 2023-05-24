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

		console.log("Esperando mensajes...");

		channel.consume(queue, (msg) => {
			let mensaje_consumido = JSON.parse(msg.content.toString());
			const id_consumer = workerData.id;

			console.log("---------------------------------------");
			console.log("ID de consumidor: " + id_consumer);
			console.log(mensaje_consumido);
			console.log("");
			//para eliminar el mensaje
			channel.ack(msg);
		});

		const res1 = await channel.assertQueue(local);
		const res2 = await channel.assertQueue(delivery_local);
		const res3 = await channel.assertQueue(delivery_app1);
		const res4 = await channel.assertQueue(delivery_app2);
		const res5 = await channel.assertQueue(delivery_app3);

		//crear key para el exchange
		const key_local = "local";
		const key_delivery_local = "delivery_local";
		const key_delivery_app1 = "delivery_pedidosya";
		const key_delivery_app2 = "delivery_ubereats";
		const key_delivery_app3 = "delivery_rappi";

		const exchange = "Restaurante";
		const exchange_tipe = "direct";

		channel.consume(local, (message) => {
			const content = message.content.toString();
			console.log("Mensaje recibido:", local);
			channel.ack(message); // Confirmar que se ha procesado correctamente el mensaje
		});
		channel.consume(delivery_local, (message) => {
			const content = message.content.toString();
			console.log("Mensaje recibido:", delivery_local);
			channel.ack(message); // Confirmar que se ha procesado correctamente el mensaje
		});
		channel.consume(delivery_app1, (message) => {
			const content = message.content.toString();
			console.log("Mensaje recibido:", delivery_app1);
			channel.ack(message); // Confirmar que se ha procesado correctamente el mensaje
		});
		channel.consume(delivery_app2, (message) => {
			const content = message.content.toString();
			console.log("Mensaje recibido:", delivery_app2);
			channel.ack(message); // Confirmar que se ha procesado correctamente el mensaje
		});
		channel.consume(delivery_app3, (message) => {
			const content = message.content.toString();
			console.log("Mensaje recibido:", delivery_app3);
			channel.ack(message); // Confirmar que se ha procesado correctamente el mensaje
		});
	} catch (err) {
		console.log("Error al conectar " + err);
	}
}
