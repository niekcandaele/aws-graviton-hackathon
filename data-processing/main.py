from dp.stats.main import calculate_stats
from dp.model.predict import predict

# This runs periodically to:
# - Renew the global statistics (since more games are processed)
# - Predict winner at certain events in newly processed rounds.

if __name__ == "__main__":
    predict()
    calculate_stats()
