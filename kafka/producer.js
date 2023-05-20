console.log('producer...');
import Kafka from "node-rdkafka";
import crear_json from "./event.js";

const stream = Kafka.Producer.createWriteStream({
    "metadata.broker.list": "localhost:9092"}, {}, 
    {topic: "test"});


function queueMesaage() {
    const isFull = stream.write(Buffer.from(JSON.stringify(crear_json())));
    if (isFull) {
        console.log('Message queued');
    }
    else {
        console.log('Message not queued');
    }
}


setInterval(() => {
    queueMesaage();
} , 3000);