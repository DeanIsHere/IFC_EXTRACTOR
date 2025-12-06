from abc import ABC, abstractmethod

class StoragePort(ABC):

    @abstractmethod
    def upload(self, file_name: str, file_obj):
        pass

    @abstractmethod
    def download(self, file_name: str):
        pass

    @abstractmethod
    def delete(self, file_name: str):
        pass