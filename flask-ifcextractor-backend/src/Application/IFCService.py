from ports.StoragePort import StoragePort


class IFCService:

    def __init__(self, storage_port: StoragePort):
        self.storage = storage_port

    def upload_ifc(self, guid, file_obj):
        file_name = f"{guid}.ifc"
        return self.storage.upload(file_name, file_obj)
    def download_ifc(self, guid):
        file_name = f"{guid}"
        return self.storage.download(file_name)
    def delete_ifc(self, guid):
        file_name = f"{guid}"
        return self.storage.delete(file_name)