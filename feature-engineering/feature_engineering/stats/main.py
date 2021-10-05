from feature_engineering.stats.dynamo import create_table, scan
from feature_engineering.stats.gamesPerMap import GamesPerMap


if __name__ == "__main__":
  #create_table()
  GamesPerMap().exec()
  print(scan())