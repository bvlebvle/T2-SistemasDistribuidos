const { stringify } = require("querystring");
const { parentPort } = require("worker_threads");

const timestamp = Date.now();

function crear_data() {
	const caractares = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = Math.floor(Math.random() * 50);
	let text = "";
	for (let i = 0; i < length; i++) {
		text += caractares.charAt(Math.floor(Math.random() * caractares.length));
	}
	return text;
}
const data = crear_data();

const log = parentPort.on("message", (msg) => {
	console.log("Device " + msg + " Tiempo de envio " + timestamp + " sending: " + data);
	const json = {
		Device: msg,
		Timestamp: timestamp,
		Data: data
	};
	console.log(JSON.stringify(json));
});
