class ProcessIFCUseCase {
    constructor(storage, engine, kafka) {
        this.storage = storage;
        this.engine = engine;
        this.kafka = kafka;
    }

    async execute(ifcFile) {
        const localIfc = `/tmp/${ifcFile.guid}.ifc`;

        // 1. Download from MinIO
        await this.storage.download(ifcFile.bucket, ifcFile.filePath, localIfc);

        const outDir = `/tmp/${ifcFile.guid}`;
        const result = await this.engine.generateFragments(localIfc, outDir);

        // 2. Upload fragments back to MinIO
        await this.storage.upload(ifcFile.bucket, `${ifcFile.guid}/model.frag`, result.frag);
        await this.storage.upload(ifcFile.bucket, `${ifcFile.guid}/model.geom`, result.geom);
        await this.storage.upload(ifcFile.bucket, `${ifcFile.guid}/model.ids`, result.ids);
        await this.storage.upload(ifcFile.bucket, `${ifcFile.guid}/meta.json`, result.meta);

        // 3. Notify via Kafka
        // await this.kafka.publish("ifc_process_done", {
        //     guid: ifcFile.guid,
        //     status: "completed",
        //     files: {
        //         frag: `${ifcFile.guid}/model.frag`,
        //         geom: `${ifcFile.guid}/model.geom`,
        //         ids: `${ifcFile.guid}/model.ids`,
        //         meta: `${ifcFile.guid}/meta.json`
        //     }
        // });
        
        //3. Notify via Redis
        
    }
}

module.exports = ProcessIFCUseCase;
