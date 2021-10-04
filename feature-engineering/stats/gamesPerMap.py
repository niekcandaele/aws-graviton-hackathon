from feature_engineering.db import get_collections

def gamesPerMap():
  collections = get_collections()
  map_count = dict()
  map_countCursor = collections["matches"].aggregate([
              {"$group": {
                  "_id": "$map",
                  "count": {"$sum": 1}
              }}
          ])
        
  labels = tuple()
  sizes = list()

  for doc in map_countCursor:
    labels += (doc["_id"],)
    sizes += (doc["count"],)
    map_count[doc["_id"]] = dict(count=doc["count"])

  return map_count