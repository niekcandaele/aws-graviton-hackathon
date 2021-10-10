from ..db import get_collections
from ..stats.base import Stat
from ..stats.dynamo import putItem

def chickensKilled():
  collections = get_collections()
  chickenDeaths = collections["chickendeaths"].count()
        
  return chickenDeaths

class ChickensKilled(Stat):
  def __init__(self):
    super().__init__("chickensKilled")

  def _calculate(self):
    return chickensKilled()

  def _save(self):
    for key in self.value:
      putItem(f"chickendeaths_total", self.value[key])