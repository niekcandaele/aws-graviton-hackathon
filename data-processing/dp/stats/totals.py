from dp.database.mongo import get_collections
from dp.stats.base import Stat
from dp.database.dynamo import putItem


def totals():
    collections = get_collections()
    chickenDeaths = collections["chickendeaths"].count_documents({})
    matches = collections["matches"].count_documents({})
    players = collections["players"].count_documents({})
    rounds = collections["rounds"].count_documents({})
    grenades = collections["grenades"].count_documents({})
    playerblinds = collections["playerblinds"].count_documents({})

    return {
        "chickenDeaths": chickenDeaths,
        "matches": matches,
        "players": players,
        "rounds": rounds,
        "grenades": grenades,
        "playerblinds": playerblinds
    }


class Totals(Stat):
    def __init__(self):
        super().__init__("totals")

    def _calculate(self):
        return totals()

    def _save(self):
        for key in self.value:
            putItem(f"{key}_total", self.value[key])
