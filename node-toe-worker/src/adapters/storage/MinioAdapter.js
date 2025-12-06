const Minio = require("minio");
const fs = require("fs");
const StoragePort = require("../../ports/StoragePort");

class MinioAdapter extends StoragePort {
    constructor() {
        super();
        this.client = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: parseInt(process.env.MINIO_PORT),
            useSSL: false,
            accessKey: process.env.MINIO_ACCESS,
            secretKey: process.env.MINIO_SECRET
        });
    }

    async download(bucket, filePath, dest) {
        return new Promise((resolve, reject) => {
            this.client.fGetObject(bucket, filePath, dest, (err) => {
                if (err) return reject(err);
                resolve(dest);
            });
        });
    }

    async upload(bucket, destPath, filePath) {
        return this.client.fPutObject(bucket, destPath, filePath);
    }
}

module.exports = MinioAdapter;
