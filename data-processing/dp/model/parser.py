from abc import abstractclassmethod

from numpy import nan
from dp.database.connection import get_collections
from dp.stats.dynamo
from bson.objectid import ObjectId
from pymongo import ASCENDING
from dataclasses import make_dataclass
import pandas as pd

"""
pi = player info
"""

collections = get_collections()


def get_map_win_rate():
    return 0


def preprocessing(data):
    # One hot encoding (first blood)
    return data.join(pd.get_dummies(data.first_blood, prefix="first_blood_", dummy_na=True)).drop("first_blood", axis=1)


class Team:

    def __init__(self, team_id):
        self.id = team_id
        team = collections["teams"].find_one({"_id": ObjectId(team_id)}, {"players": 1, "_id": 0, "startingSide": 1})
        self.player_ids = team["players"]
        self.starting_side = team["startingSide"]


class Round:
    def __init__(self, round_id, team_id, max_tick, round_number):
        self.round_id = round_id
        self.team = Team(team_id)

        # Parse all data that is less than this tick.
        self.max_tick = max_tick
        self.round_number = round_number

    @abstractclassmethod
    def dataclass(self):
        return make_dataclass("Round", [
            ("kills", int),
            ("deaths", int),
            ("first_blood", int),
            ("round_winstreak", int),
            ("bomb_planted", int),
            ("is_terrorist", int),
            ("defuse_kits", int),
        ])

    def is_bomb_planted(self):
        bomb_event_ids = collections["rounds"].find({"_id": ObjectId(self.round_id)}, {"bombStatusChanges": 1})["bombStatusChanges"]
        if len(bomb_event_ids) == 0:
            return False

        bomb_planted_event = list(collections["bombstatusevents"].find({"_id": {"$in": bomb_event_ids}}, {"status": 1}))
        return 1 if len(bomb_planted_event) else 0

    def is_terrorist(self):
        if self.team.starting_side == "TERRORIST":
            return 1 if self.round_number < 16 else 0
        else:
            return 0 if self.round_number < 16 else 1

    def kills_and_deaths(self):
        death_count = kill_count = 0

        round_details = collections["rounds"].find_one({"_id": ObjectId(self.round_id)}, {"kills": 1})
        if "kills" not in round_details:
            return (0, 0)

        for kill_id in list(round_details["kills"]):

            kill = collections["playerkills"].find_one({"_id": kill_id, "tick": {"$lte": self.max_tick}}, {"victim": 1})
            if kill is None or "victim" not in kill:
                continue

            # Sometimes a playerInfo does not contain a player field. We just ignore that case.
            victim_pi = collections["playerinfos"].find_one({"_id": kill["victim"]}, {"player": 1})
            if "player" not in victim_pi:
                continue

            if victim_pi["player"] in self.team.player_ids:
                death_count += 1
            else:
                kill_count += 1

        return (kill_count, death_count)

    def is_first_blood(self):
        kill_ids = collections["rounds"].find_one({"_id": ObjectId(self.round_id)}, {"kills": 1})["kills"]

        # Get the player info from the first kill based on lowest tick.
        victim_pi_id = list(collections["playerkills"]
                            .find({"_id": {"$in": kill_ids}, "tick": {"$lte": self.max_tick}}, {"victim": 1, "tick": 1})  # get kills
                            .sort([("tick", ASCENDING)])                                                                  # order from low to high
                            .limit(1))

        if len(victim_pi_id) == 0:
            return nan

        victim_pi = collections["playerinfos"].find_one({"_id": ObjectId(victim_pi_id[0]["victim"])}, {"player": 1})

        # We just ignore this case
        if "player" not in victim_pi:
            return 0

        # If the playerId from the victim is part of team_1 we did NOT make the first blood.
        return 0 if victim_pi["player"] in self.team.player_ids else 1

    def is_win(self):
        return 0 if collections["rounds"].find_one({"_id": self.round_id}, {"winningTeam": 1})["winningTeam"] == self.team.id else 1

    def equipment_value_ratio():
        # TODO:
        return True

    def defuse_kit_count():
        # TODO:
        return 5

    def alive_ratio_on_bomb_plant():
        # TODO:
        return 0
