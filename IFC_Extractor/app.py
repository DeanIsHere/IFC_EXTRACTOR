from flask import Flask
from minio import Minio
from sqlalchemy import create_engine

from handlers.MinioHandler import MinioStorageAdapter
from service.IFCService import IFCService
from adapters.IFCHandler import create_ifc_blueprint

from config import config

def create_app():
    app = Flask(__name__)

    # MinIO client
    minio_client = Minio(
        "localhost:9000",
        access_key=config.MINIO_ACCESS_KEY,
        secret_key=config.MINIO_SECRET_KEY,
        secure=False
    )

    # Postgres
    db_engine = create_engine(config.POSTGRES_URI)

    # Storage Adapter
    storage = MinioStorageAdapter(minio_client, "ifc-bucket")

    # Service
    ifc_service = IFCService(storage)

    # Blueprint
    ifc_bp = create_ifc_blueprint(ifc_service)
    app.register_blueprint(ifc_bp)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)