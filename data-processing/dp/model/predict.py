from dp.database.mongo import get_collections
from dp.model.parser import Round, preprocessing, get_bomb_plant_event
import pickle
import pandas as pd


def predict():

    try:
        collections = get_collections()
        file = open("./dp/model/model.sav", "rb")
        model = pickle.load(file)

        round_dataclass = Round.dataclass()
        rounds = list(
            collections["rounds"].find({"has_predictions": {"$exists": False}})
        )

        for index, round in enumerate(rounds):
            round_id = round["_id"]
            print(f"{index}/{len(rounds)} rounds")

            # The teamids are saved in the match, we need this though :)
            match = list(
                collections["matches"].find(
                    {"rounds": {"$elemMatch": {"$eq": round_id}}}
                )
            )[0]

            # this is a list of all the events we create a prediction for
            predict_events = []

            # Get ticks from all kills
            kills = list(
                collections["playerkills"].find(
                    {"_id": {"$in": round["kills"]}}, {"_id": 1, "tick": 1}
                )
            )

            # All kill events
            for kill in kills:
                predict_event.append(
                    {
                        "id": kill["_id"],
                        "collection": "playerkills",
                        "tick": kill["tick"],
                    }
                )

            if "bombStatusChanges" in round:
                bomb_events = list(
                    collections["bombstatuschanges"].find(
                        {"_id": {"$in": round["bombStatusChanges"]}},
                        {"_id": 1, "tick": 1},
                    )
                )
                for bomb_event in bomb_events:
                    predict_events.append(
                        {
                            "id": bomb_event["_id"],
                            "collection": "bombstatuschanges",
                            "tick": bomb_event["tick"],
                        }
                    )

            for predict_event in predict_events:
                parsed_round = Round(
                    round["_id"], match["teams"][0], predict_event["tick"]
                )
                (kills, deaths) = parsed_round.kills_and_deaths()
                (ct_winrate, t_winrate) = parsed_round.map_winrate()
                (damage_given, damage_taken) = round.damage()
                # is_bomb_planted() needs to be handles before
                # players_alive_on_plant(), it depends on property set in is_bomb_planted()
                is_bomb_planted = round.is_bomb_planted()
                (
                    team_alive_on_plant,
                    enemy_alive_on_plant,
                ) = round.players_alive_on_plant()

                data = pd.DataFrame(
                    [
                        round_dataclass(
                            kills=kills,
                            deaths=deaths,
                            first_blood=parsed_round.is_first_blood(),
                            round_winstreak=0,
                            bomb_planted=is_bomb_planted,
                            is_terrorist=parsed_round.is_terrorist(),
                            counter_terrorist_map_winrate=ct_winrate,
                            terrorist_map_winrate=t_winrate,
                            damage_given=damage_given,
                            damage_taken=damage_taken,
                            team_alive_on_plant=team_alive_on_plant,
                            enemy_alive_on_plant=enemy_alive_on_plant,
                        )
                    ]
                )

                data = preprocessing(data)
                predicted_winner = (
                    match["teams"][0] if model.predict(data) else match["teams"][1]
                )

                # TODO: calculate the certainty
                collections[predict_event["collection"]].update_one(
                    {"_id": predict_event["id"]},
                    {
                        "$set": {
                            "prediction.team_id": predicted_winner,
                            "prediction.certainty": 0.8,
                        }
                    },
                )

    except pickle.PickleError:
        print("Could not load model")
