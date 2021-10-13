from dp.stats.totals import Totals
from dp.stats.gamesPerMap import GamesPerMap
from dp.database.dynamo import scan, create_table
from dp.stats.winratePerMap import WinratePerMap


def calculate_stats():
    # create_table()
    GamesPerMap().exec()
    Totals().exec()
    WinratePerMap().exec()
    print(scan())
