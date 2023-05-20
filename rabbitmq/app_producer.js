const express = require("express");
const morgan = require("morgan");
const { Worker } = require("worker_threads");
const app = express();

for (let i = 0; i < 2000; i++) {
	const id = i + 1;
	const worker_producer = new Worker("./producer_rabbitmq.js", { workerData: { id: id } });
}

app.listen(4000);
console.log("Server is running on port 4000");
