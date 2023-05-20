console.log('consumer...');
import Kafka from "node-rdkafka";

const consumer= Kafka.KafkaConsumer({
    "metadata.broker.list": "localhost:9092",
    "group.id": "kafka",
}, {});

consumer.connect();

consumer.on('ready', () => {
    console.log('ready');
    consumer.subscribe(['test']);
    consumer.consume();
}).on('data', (data) => {
    console.log(data.value.toString());
});
