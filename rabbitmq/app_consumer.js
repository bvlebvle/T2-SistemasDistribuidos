const express = require("express");
const morgan = require("morgan");
const { Worker } = require("worker_threads");
const app = express();

for (let i = 0; i < 5; i++) {
	const id = i + 1;
	const worker_consumer = new Worker("./consumer_rabbitmq.js", { workerData: { id: id } });
}

app.listen(3000);
console.log("Server is running on port 3000");
