from dp.database.mongo import get_collections
from dp.database.dynamo import putItem
from dp.stats.base import Stat


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


class GamesPerMap(Stat):
    def __init__(self):
        super().__init__("gamesPerMap")

    def _calculate(self):
        return gamesPerMap()

    def _save(self):
        for key in self.value:
            putItem(f"mapcount_{key}", self.value[key])
