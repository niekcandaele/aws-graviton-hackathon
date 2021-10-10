from ..db import get_collections
from ..stats.base import Stat
from ..stats.dynamo import putItem

def winratePerMap():
  collections = get_collections()
  map_count = dict()
  map_countCursor = collections["matches"].find()
        
  labels = tuple()
  sizes = list()

  for doc in map_countCursor:
    if map_count.get(doc["map"]) is None:
      map_count[doc["map"]] = {"COUNTER_TERRORIST": 0, "TERRORIST": 0}

    rounds = collections["rounds"].find( { "_id" : { "$in" : doc["rounds"] } } )
    for round in list(rounds):
      if round.get("winningSide") is not None:
        map_count[doc["map"]][round["winningSide"]] += 1

  return map_count

class WinratePerMap(Stat):
  def __init__(self):
    super().__init__("winratePerMap")

  def _calculate(self):
    return winratePerMap()

  def _save(self):
    for key in self.value:
      print(f"Storing key 'mapwinrate_{key}' with value '{self.value[key]}'")
      putItem(f"mapwinrate_{key}", self.value[key])