from dp.database.mongo import get_collections
from dp.model.parser import Round, preprocessing, get_bomb_plant_event
import pickle
import pandas as pd
import random


def predict():

    try:
        random.seed(1)
        collections = get_collections()
        file = open("./dp/model/model.sav", "rb")
        model = pickle.load(file)

        round_dataclass = Round.dataclass()
        rounds = list(
            collections["rounds"].find({"has_predictions": {"$exists": False}})
        )

        for round_idx, round_value in enumerate(rounds):
            round_id = round_value["_id"]

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
                    {"_id": {"$in": round_value["kills"]}}, {"_id": 1, "tick": 1}
                )
            )

            # All kill events
            for kill in kills:
                predict_events.append(
                    {
                        "id": kill["_id"],
                        "collection": "playerkills",
                        "tick": kill["tick"],
                    }
                )

            if "bombStatusChanges" in round_value:
                bomb_events = list(
                    collections["bombstatuschanges"].find(
                        {"_id": {"$in": round_value["bombStatusChanges"]}},
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
                    round_value["_id"],
                    match["teams"][0],
                    predict_event["tick"],
                    round_idx,
                    match["map"],
                )
                (kills, deaths) = parsed_round.kills_and_deaths()
                (ct_winrate, t_winrate) = parsed_round.map_winrate()
                (damage_given, damage_taken) = parsed_round.damage()
                # is_bomb_planted() needs to be handles before players_alive_on_plant(), it depends on property set in is_bomb_planted()
                is_bomb_planted = parsed_round.is_bomb_planted()
                (
                    team_alive_on_plant,
                    enemy_alive_on_plant,
                ) = parsed_round.players_alive_on_plant()

                data = pd.DataFrame(
                    [
                        round_dataclass(
                            kills=kills,
                            deaths=deaths,
                            round_winstreak=0,  # TODO: This is still an issue. Since we only parse predictions of rounds, we cannot see rounds in the same game.
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
                predicted_winner = (
                    match["teams"][0] if model.predict(data) else match["teams"][1]
                )

                # SVM SVC classification models do not directly provide probability estimates.
                # They are calculate using expensive 5-fold cross validation. It currently uses platt scaling.

                # Platt's method is known to have theoretical issues. We can write a custom decision_function to fix this
                # But in this hackathon we had no time to fully implement this.
                # This is why the prediction certainty is currently a randomly generated number, so atleast the frontend and our
                # intentions can be shown.
                collections[predict_event["collection"]].update_one(
                    {"_id": predict_event["id"]},
                    {
                        "$set": {
                            "prediction.team_id": predicted_winner,
                            "prediction.certainty": round(random.uniform(0.5, 1.0), 2),
                        }
                    },
                )

    except pickle.PickleError:
        print("Could not load model")
