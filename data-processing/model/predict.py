from ..database.connection import get_collections
from .parser import Round, preprocessing
import pickle
import pandas as pd


def predict():

    try:
        collections = get_collections()
        model = pickle.load("../model/model.sav", "rb")

        round_dataclass = Round.get_dataclass()
        rounds = list(collections["rounds"].find({"has_predictions": {"$exists": False}}))

        for round in rounds:

            # The teamids are saved in the match, we need this tho :(
            match = list(collections["match"].find({"rounds": {"$elemMatch": {"$eq": round["_id"]}}}))

            # Get ticks from all kills
            kill_ticks = collections["kills"].find({"_id": round["kills"]}, {"_id": 1, "tick": 1})

            for tick in list(kill_ticks["tick"]):
                round = Round(round["_id"], match["teams"][0], tick)
                data = pd.DataFrame([round_dataclass()])
                predicted_winner = match["teams"][0] if model.predict(preprocessing(data)) else match["teams"][1]

              # TODO: calculate the certainty
                collections["kills"].update_one({"_id": kill_ticks["_id"]}, {"prediction.team_id": predicted_winner, "prediction.certainty": .8})

    except pickle.PickleError:
        print("Could not load model")
