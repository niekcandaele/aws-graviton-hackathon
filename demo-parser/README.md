# Demo parser

Reads demo files from S3 and parses them. It detects several events that happen in the game (think playerKill, grenadeThrown, playerHit, ...) and writes them to a database.

This is deployed to ECS as a Fargate task. It is load balanced by CPU usage and amount of messages available in the queue. Eg, when the scraper is outputting many demo files and this module cannot keep up, ECS will spin up another instance to help processing the items in queue.

## Architecture

- `models`: contains the database models
- `lib`: some helper functions
- `demo`: the actual demo parsing

Inside the demo folder is a folder for the 'Detectors'. Every Detector is a class responsible for extracting certain information from a file. There's a baseclass `Detector` that every Detector inherits from which contains common logic and setup.