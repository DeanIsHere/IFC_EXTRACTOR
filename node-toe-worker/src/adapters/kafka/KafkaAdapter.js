const { Kafka } = require("kafkajs");
const KafkaPort = require("../../ports/MessageQueuePort");

class KafkaAdapter extends KafkaPort {
    constructor(broker) {
        super();
        this.kafka = new Kafka({
            brokers: [broker],
        });
    }

    async subscribe(topic, handler) {
        const consumer = this.kafka.consumer({ groupId: "worker-group" });
        await consumer.connect();
        await consumer.subscribe({ topic });

        await consumer.run({
            eachMessage: async ({ message }) => {
                const data = JSON.parse(message.value.toString());
                await handler(data);
            }
        });
    }

    async publish(topic, message) {
        const producer = this.kafka.producer();
        await producer.connect();
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }]
        });
        await producer.disconnect();
    }
}

module.exports = KafkaAdapter;
