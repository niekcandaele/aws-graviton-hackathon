from ..database.connection import get_collections
from .parser import Round, preprocessing
import pickle
import pandas as pd

import os


def predict():

    try:
        collections = get_collections()
        print(os.getcwd())
        file = open("./dp/model/model.sav", 'rb')
        model = pickle.load(file)

        round_dataclass = Round.dataclass()
        rounds = list(collections["rounds"].find({"has_predictions": {"$exists": False}}))

        for index, round in enumerate(rounds):
            print(f"{index}/{len(rounds)} rounds")

            # The teamids are saved in the match, we need this tho :(
            match = list(collections["matches"].find({"rounds": {"$elemMatch": {"$eq": round["_id"]}}}))[0]

            # Get ticks from all kills
            kills = list(collections["playerkills"].find({"_id": {"$in": round["kills"]}}, {"_id": 1, "tick": 1}))

            for kill in kills:
                parsed_round = Round(round["_id"], match["teams"][0], kill["tick"])

                (kills, deaths) = parsed_round.kills_and_deaths()
                data = pd.DataFrame([round_dataclass(
                    kills=kills,
                    deaths=deaths,
                    first_blood=parsed_round.is_first_blood(),
                    round_winstreak=0,
                    bomb_planted=parsed_round.is_bomb_planted(),
                    is_terrorist=parsed_round.is_terrorist(),
                )
                ])

                data = preprocessing(data)
                predicted_winner = match["teams"][0] if model.predict(data) else match["teams"][1]

              # TODO: calculate the certainty
                collections["playerkills"].update_one({"_id": kill["_id"]}, {"$set": {"prediction.team_id": predicted_winner, "prediction.certainty": .8}})

    except pickle.PickleError:
        print("Could not load model")
