from .totals import Totals
from .gamesPerMap import GamesPerMap
from .dynamo import scan


def calculate_stats():
    # create_table()
    GamesPerMap().exec()
    Totals().exec()
    print(scan())
