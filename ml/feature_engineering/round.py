from re import S
from feature_engineering.db import get_collections


class Team:
    def __init__(self, team_id, collections):
        self.id = team_id
        self.player_ids = set(
            get_collections()["teams"].find_one(f"_id={team_id}"))


class Round:
    def __init__(self, round_id, team_1_id):
        self.collections = get_collections()
        self.round_id = round_id
        self.team_1 = Team(team_1_id)

    def kills_and_deaths(self):
        death_count = 0
        kill_count = 0
        for kill_id in round["kills"]:
            victim_pi_id = self.collections["playerkills"].find_one(
                f"_id={kill_id}").victim
            if self.collections["playerinfos"].find_one(f"_id={victim_pi_id}").player in self.players:
                death_count += 1
            else:
                kill_count += 1
        return (kill_count, death_count)

    def first_blood(self):
        first_kill = self.collections["rounds"].find_one(
            f"_id=self.round_id").sort({tick: +1}).limit(1)
        victim_pi = self.collections["playerinfos"].find_one(
            f"_id={first_kill.victim}")
        return True if victim_pi.player in self.team_1.player_ids else False

    def is_win(self):
        return True if self.collections["rounds"].find_one(self.round_id).winningTeam == self.team_1.id else False

    def equipment_value_ratio():
        # TODO:
        return True

    def defuse_kit_count():
        # TODO:
        return 5

    def alive_ratio_on_bomb_plant():
        # TODO:
        return 0
