from feature_engineering import __version__
from feature_engineering.stats.gamesPerMap import gamesPerMap
from feature_engineering.stats.totals import totals

# These tests dont assert the correct things
# We'd need to set exact database seeds if we want to do that
# Instead, this is just an easy way to run the different metrics :)

def test_version():
    assert __version__ == '0.1.0'

def test_mapBreakdown():
    result = gamesPerMap()
    assert "de_dust2" in result

def test_totals():
    result = totals()
    print(result)
    assert 15 == result    