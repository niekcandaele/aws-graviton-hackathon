from .dynamo import create_table, scan
from .gamesPerMap import GamesPerMap


if __name__ == "__main__":
  #create_table()
  GamesPerMap().exec()
  print(scan())