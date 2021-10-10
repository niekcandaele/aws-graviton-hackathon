from .dynamo import getItem, putItem
from abc import ABC, abstractmethod


class Stat(ABC):
    def __init__(self, name):
        self.name = name

    def exec(self):
        self.value = self._calculate()
        self._save()
        return self.value

    @abstractmethod
    def _calculate(self):
        pass

    @abstractmethod
    def _save(self):
        pass
