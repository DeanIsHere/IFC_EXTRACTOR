require("dotenv").config();

const KafkaAdapter = require("./src/adapters/kafka/KafkaAdapter");
const MinioAdapter = require("./src/adapters/storage/MinioAdapter");
const TOEAdapter = require("./src/adapters/engine/TOEAdapter");

const ProcessIFCUseCase = require("./src/application/ProcessIFCUseCase");
const IFCFile = require("./src/domain/IFCFile");

(async () => {
    const kafka = new KafkaAdapter(process.env.KAFKA_BROKER);
    const storage = new MinioAdapter();
    const engine = new TOEAdapter();

    const useCase = new ProcessIFCUseCase(storage, engine, kafka);

    console.log("Worker listening Kafka...");

    await kafka.subscribe("ifc_process_request", async (msg) => {
        const file = new IFCFile(msg);
        await useCase.execute(file);
    });
})();
