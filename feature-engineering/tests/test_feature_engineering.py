from feature_engineering import __version__
from feature_engineering.features import map_breakdown


def test_version():
    assert __version__ == '0.1.0'

def test_mapBreakdown():
    assert map_breakdown.Map_Breakdown().run() == 5
