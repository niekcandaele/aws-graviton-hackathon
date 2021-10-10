from dp.stats.totals import Totals
from dp.stats.gamesPerMap import GamesPerMap
from dp.stats.dynamo import scan


def calculate_stats():
    # create_table()
    GamesPerMap().exec()
    Totals().exec()
    print(scan())
