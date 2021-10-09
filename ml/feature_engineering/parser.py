from feature_engineering.db import get_collections
from bson.objectid import ObjectId
from pymongo import ASCENDING

"""
pi = playerInfo
"""


class Team:
    def __init__(self, team_id):
        self.id = team_id
        self.player_ids = get_collections()["teams"].find_one(
            {"_id": ObjectId(team_id)}, {"players": 1, "_id": 0})["players"]


class Round:
    def __init__(self, round_id, team_1_id):
        self.collections = get_collections()
        self.round_id = round_id
        self.team_1 = Team(team_1_id)

    def kills_and_deaths(self):

        death_count = 0
        kill_count = 0
        kill_ids = self.collections["rounds"].find_one({"_id": ObjectId(self.round_id)}, {"kills": 1})["kills"]

        for kill_id in list(kill_ids):
            victim_pi_id = self.collections["playerkills"].find_one({"_id": kill_id}, {"victim": 1})["victim"]
            if self.collections["playerinfos"].find_one({"_id": victim_pi_id}, {"player": 1})["player"] in self.team_1.player_ids:
                death_count += 1
            else:
                kill_count += 1

        return kill_count, death_count

    def is_first_blood(self):
        kill_ids = self.collections["rounds"].find_one({"_id": ObjectId(self.round_id)}, {"kills": 1})["kills"]
        # Get the player info from the first kill based on lowest tick.
        victim_pi_id = list(self.collections["playerkills"].find({"_id": {"$in": kill_ids}}, {"victim": 1, "tick": 1}).sort([("tick", ASCENDING)]).limit(1))[0]["victim"]
        player_id = self.collections["playerinfos"].find_one({"_id": ObjectId(victim_pi_id)}, {"player": 1})["player"]
        return 0 if player_id in self.team_1.player_ids else 1

    def is_win(self):
        return 0 if self.collections["rounds"].find_one({"_id": self.round_id}, {"winningTeam": 1})["winningTeam"] == self.team_1.id else 1

    def equipment_value_ratio():
        # TODO:
        return True

    def defuse_kit_count():
        # TODO:
        return 5

    def alive_ratio_on_bomb_plant():
        # TODO:
        return 0
