from feature_engineering.db import get_collections
from bson.objectid import ObjectId
from pymongo import ASCENDING

"""
pi = player info
"""

collections = get_collections()


class Team:
    def __init__(self, team_id):
        self.id = team_id
        self.player_ids = collections["teams"].find_one(
            {"_id": ObjectId(team_id)}, {"players": 1, "_id": 0})["players"]


class Round:
    def __init__(self, round_id, team1_id, max_tick):
        self.round_id = round_id
        self.team1 = Team(team1_id)

        # Parse all data that is less than this tick.
        self.max_tick = max_tick

    def kills_and_deaths(self):
        death_count, kill_count = 0
        kill_ids = collections["rounds"].find_one({"_id": ObjectId(self.round_id)}, {"kills": 1})["kills"]

        for kill_id in list(kill_ids):
            victim_pi_id = collections["playerkills"].find_one({"_id": kill_id, "tick": {"$lte": self.max_tick}}, {"victim": 1})["victim"]
            victim_pi = collections["playerinfos"].find_one({"_id": victim_pi_id}, {"player": 1})

            # Sometimes a playerInfo does not contain a player field. We just ignore that case.
            if "player" not in victim_pi:
                continue

            if victim_pi["player"] in self.team1.player_ids:
                death_count += 1
            else:
                kill_count += 1

        return kill_count, death_count

    def is_first_blood(self):
        kill_ids = collections["rounds"].find_one({"_id": ObjectId(self.round_id)}, {"kills": 1})["kills"]

        # Get the player info from the first kill based on lowest tick.
        victim_pi_id = list(collections["playerkills"]
                            .find({"_id": {"$in": kill_ids, "tick": {"$lte": self.max_tick}}}, {"victim": 1, "tick": 1})  # get kills
                            .sort([("tick", ASCENDING)])                                 # order from low to high
                            .limit(1))[0]["victim"]                                      # get the top row

        victim_pi = collections["playerinfos"].find_one({"_id": ObjectId(victim_pi_id)}, {"player": 1})

        # We just ignore this case
        # TODO: We could check the next kill instead.
        if "player" not in victim_pi:
            return 0

        # If the playerId from the victim is part of team_1 we did NOT make the first blood.
        return 0 if victim_pi["player"] in self.team1.player_ids else 1

    def is_win(self):
        return 0 if collections["rounds"].find_one({"_id": self.round_id}, {"winningTeam": 1})["winningTeam"] == self.team1.id else 1

    def equipment_value_ratio():
        # TODO:
        return True

    def defuse_kit_count():
        # TODO:
        return 5

    def alive_ratio_on_bomb_plant():
        # TODO:
        return 0
