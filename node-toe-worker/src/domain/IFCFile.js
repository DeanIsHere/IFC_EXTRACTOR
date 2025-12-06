class IFCFile {
    constructor({ guid, filePath, bucket }) {
        this.guid = guid;
        this.filePath = filePath;
        this.bucket = bucket;
    }
}

module.exports = IFCFile;
