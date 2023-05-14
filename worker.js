const { stringify } = require("querystring");
const { parentPort } = require("worker_threads");

function crear_data() {
	const caractares = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = Math.floor(Math.random() * 50);
	let text = "";
	for (let i = 0; i < length; i++) {
		text += caractares.charAt(Math.floor(Math.random() * caractares.length));
	}
	return text;
}
function enviar_data() {
	for (let i = 0; i < 2; i++) {
		const data = crear_data();
		const timestamp = Date.now();

		const log = parentPort.on("message", (msg) => {
			console.log("Enviando datos al servidor...");
			const json = {
				Device: msg,
				Timestamp: timestamp,
				Data: data
			};
			console.log(JSON.stringify(json));
		});
	}
}
setInterval(enviar_data, 5000);
