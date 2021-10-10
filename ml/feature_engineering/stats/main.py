from .totals import Totals
from .gamesPerMap import GamesPerMap
from .dynamo import create_table, scan


if __name__ == "__main__":
  #create_table()
  GamesPerMap().exec()
  Totals().exec()
  print(scan())