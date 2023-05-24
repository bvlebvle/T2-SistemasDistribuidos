const { Worker } = require("worker_threads");

for (let i = 0; i < 1; i++) {
	const id = i + 1;
	const worker_consumer = new Worker("./consumer_rabbitmq.js", { workerData: { id: id } });
}
