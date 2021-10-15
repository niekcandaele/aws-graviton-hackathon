from abc import abstractclassmethod

from numpy import nan
from dp.database.mongo import get_collections
from dp.database.dynamo import getItem
from bson.objectid import ObjectId
from pymongo import ASCENDING
from dataclasses import make_dataclass
import pandas as pd

"""
pi = player info
"""

collections = get_collections()


def get_bomb_plant_event(round_id):
    round_details = collections["rounds"].find_one({"_id": round_id})
    if "bombStatusChanges" not in round_details:
        return None

    bomb_event_ids = round_details["bombStatusChanges"]
    if len(bomb_event_ids) == 0:
        return None

    bomb_planted_event = collections["bombstatuschanges"].find_one(
        {"_id": {"$in": bomb_event_ids}, "status": "PLANTED"}
    )
    return bomb_planted_event


def preprocessing(data):
    # One hot encoding (first blood)
    data = data.join(
        pd.get_dummies(data.first_blood, prefix="first_blood_", dummy_na=True)
    )
    data = data.drop("first_blood", axis=1)
    return data


class Team:
    def __init__(self, team_id):
        self.id = team_id
        team = collections["teams"].find_one(
            {"_id": ObjectId(team_id)}, {"players": 1, "_id": 0, "startingSide": 1}
        )
        self.player_ids = team["players"]
        self.starting_side = team["startingSide"]


class Round:
    def __init__(self, round_id, team_id, max_tick, round_number, map):
        self.round_id = round_id
        self.team = Team(team_id)
        self.map = map

        # Parse all data that is less than this tick.
        self.max_tick = max_tick
        self.round_number = round_number

        # Get basic round information here. Instead of getting the round information over and over again.
        round_details = collections["rounds"].find_one({"_id": round_id})
        self.player_hurt_ids = round_details["playerHurts"]
        self.bomb_plant_tick = None

    @abstractclassmethod
    def dataclass(self):
        return make_dataclass(
            "Round",
            [
                ("kills", int),
                ("deaths", int),
                ("round_winstreak", int),
                ("bomb_planted", int),
                ("is_terrorist", int),
                ("counter_terrorist_map_winrate", float),
                ("terrorist_map_winrate", float),
                ("damage_given", int),
                ("damage_taken", int),
                ("team_alive_on_plant", int),
                ("enemy_alive_on_plant", int),
            ],
        )

    def map_winrate(self):
        winrate_details = getItem(f"mapwinrate_{self.map}")["data"]
        ct_wins = winrate_details["COUNTER_TERRORIST"]
        t_wins = winrate_details["TERRORIST"]
        total = ct_wins + t_wins

        ct_winrate = ct_wins / total
        t_winrate = t_wins / total
        return (ct_winrate, t_winrate)

    def damage(self):
        player_hurts = list(
            collections["playerhurts"].find({"_id": self.player_hurt_ids})
        )
        damage_taken = 0
        damage_given = 0

        for player_hurt in player_hurts:
            victim_pi = collections["victim"].find_one({"_id": player_hurt["victim"]})
            if "player" in victim_pi and victim_pi["player"] in self.team.player_ids:
                damage_taken += player_hurt["healthDmg"]
            elif "player" in victim_pi:
                damage_given += player_hurt["healthDmg"]
        return (damage_given, damage_taken)

    def is_bomb_planted(self):
        round_details = collections["rounds"].find_one({"_id": self.round_id})
        if "bombStatusChanges" not in round_details:
            return 0
        bomb_event_ids = round_details["bombStatusChanges"]
        if len(bomb_event_ids) == 0:
            return 0

        bomb_planted_event = collections["bombstatuschanges"].find_one(
            {"_id": {"$in": bomb_event_ids}, "status": "PLANTED"}, {"tick": 1}
        )

        if bomb_planted_event is not None:
            self.bomb_plant_tick = bomb_planted_event["tick"]
            return 1
        else:
            return 0

    def is_terrorist(self):
        if self.team.starting_side == "TERRORIST":
            return 1 if self.round_number < 16 else 0
        else:
            return 0 if self.round_number < 16 else 1

    def kills_and_deaths(self, tick=None):

        if tick is None:
            tick = self.max_tick

        death_count = kill_count = 0

        round_details = collections["rounds"].find_one(
            {"_id": ObjectId(self.round_id)}, {"kills": 1}
        )
        if "kills" not in round_details:
            return (0, 0)

        for kill_id in list(round_details["kills"]):

            kill = collections["playerkills"].find_one(
                {"_id": kill_id, "tick": {"$lte": tick}}, {"victim": 1}
            )
            if kill is None or "victim" not in kill:
                continue

            # Sometimes a playerInfo does not contain a player field. We just ignore that case.
            victim_pi = collections["playerinfos"].find_one(
                {"_id": kill["victim"]}, {"player": 1}
            )
            if "player" not in victim_pi:
                continue

            if victim_pi["player"] in self.team.player_ids:
                death_count += 1
            else:
                kill_count += 1

        return (kill_count, death_count)

    def is_first_blood(self):
        kill_ids = collections["rounds"].find_one(
            {"_id": ObjectId(self.round_id)}, {"kills": 1}
        )["kills"]

        # Get the player info from the first kill based on lowest tick.
        victim_pi_id = list(
            collections["playerkills"]
            .find(
                {"_id": {"$in": kill_ids}, "tick": {"$lte": self.max_tick}},
                {"victim": 1, "tick": 1},
            )  # get kills
            .sort([("tick", ASCENDING)])  # order from low to high
            .limit(1)
        )

        if len(victim_pi_id) == 0:
            return nan

        victim_pi = collections["playerinfos"].find_one(
            {"_id": ObjectId(victim_pi_id[0]["victim"])}, {"player": 1}
        )

        # We just ignore this case
        if "player" not in victim_pi:
            return 0

        # If the playerId from the victim is part of team_1 we did NOT make the first blood.
        return 0 if victim_pi["player"] in self.team.player_ids else 1

    def is_win(self):
        return (
            0
            if collections["rounds"].find_one(
                {"_id": self.round_id}, {"winningTeam": 1}
            )["winningTeam"]
            == self.team.id
            else 1
        )

    def equipment_value_ratio():
        # TODO:
        return True

    def players_alive_on_plant(self):
        MAX_PLAYERS = 5
        if self.bomb_plant_tick is None:
            return (0, 0)
        (kills, deaths) = self.kills_and_deaths(self.bomb_plant_tick)
        return (MAX_PLAYERS - deaths, MAX_PLAYERS - kills)
