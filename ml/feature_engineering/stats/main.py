from .gamesPerMap import GamesPerMap
from .chickensKilled import ChickensKilled
from .dynamo import create_table, scan


if __name__ == "__main__":
  #create_table()
  GamesPerMap().exec()
  ChickensKilled().exec()
  print(scan())