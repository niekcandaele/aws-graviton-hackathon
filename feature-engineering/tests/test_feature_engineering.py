from feature_engineering import __version__
from stats.gamesPerMap import gamesPerMap


def test_version():
    assert __version__ == '0.1.0'

def test_mapBreakdown():
    result = gamesPerMap()
    assert "de_dust2" in result
