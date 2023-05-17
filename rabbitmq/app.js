const express = require("express");
const morgan = require("morgan");
const { Worker } = require("worker_threads");
const app = express();

for (let i = 0; i < 1; i++) {
	const worker = new Worker("./producer_rabbitmq.js", { workerData: { id: i } });
	worker.postMessage(i);
}
app.listen(4000);
console.log("Server is running on port 4000");
