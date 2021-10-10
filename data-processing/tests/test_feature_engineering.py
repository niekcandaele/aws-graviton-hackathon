from dp import __version__
from dp.stats.gamesPerMap import gamesPerMap
from dp.stats.totals import totals
from dp.stats.winratePerMap import winratePerMap, WinratePerMap

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
    assert 15 == result


def test_winrate():
    cls = WinratePerMap()
    result = cls.exec()
    print(result)
    assert 15 == result
