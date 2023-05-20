import { stringify } from "querystring";

function crear_data() {
	const caractares = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const length = Math.floor(Math.random() * 50);
	let text = "";
	for (let i = 0; i < length; i++) {
		text += caractares.charAt(Math.floor(Math.random() * caractares.length));
	}
	return text;
}

export default function crear_json() {
    const timestamp = Date.now();
    const data = crear_data();
    const json = {
        Device: 1,
		Timestamp: timestamp,
		Data: data
    }
    return JSON.stringify(json);
}

