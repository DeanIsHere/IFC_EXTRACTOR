import io
from minio import Minio

from ports.StoragePort import StoragePort


class MinioStorageAdapter(StoragePort):
    def __init__(self, client: Minio, bucket: str):
        self.client = client
        self.bucket = bucket

        # Pastikan bucket ada, kalau belum buat
        if not self.client.bucket_exists(bucket):
            self.client.make_bucket(bucket)

    def upload(self, name: str, file_storage) -> str:
        data = file_storage.read()
        file_storage.seek(0)
        
        self.client.put_object(
            bucket_name=self.bucket,
            object_name=name,
            data=io.BytesIO(data),
            length=len(data)
        )
        return name

    def download(self, name: str) -> bytes:
        response = self.client.get_object(self.bucket, name)
        data = response.read()  # baca semua konten
        response.close()
        response.release_conn()  # pastikan koneksi dilepas
        return data

    def delete(self, name: str) -> None:
        self.client.remove_object(self.bucket, name)
        return name