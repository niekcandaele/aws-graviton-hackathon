import os
from pymongo import MongoClient

from dotenv import load_dotenv

def get_database():
  load_dotenv()
  client = MongoClient(os.getenv('MONGO_URI'))
  return client[os.getenv('MONGO_DB')]

def get_collections():
  return {
    'matches': get_database()['matches'],
    'players': get_database()['players'],
    'teams': get_database()['teams'],
    'bombstatuschanges': get_database()['bombstatuschanges'],
    'playerinfos': get_database()['playerinfos'],
    'playerkills': get_database()['playerkills'],
    'rounds': get_database()['rounds'],
  }