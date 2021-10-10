# Demo parser

Reads demo files from S3 and parses them. It detects several events that happen in the game (think playerKill, grenadeThrown, playerHit, ...) and writes them to a database.

This is deployed to ECS as a Fargate task. It is load balanced by CPU usage and amount of messages available in the queue. Eg, when the scraper is outputting many demo files and this module cannot keep up, ECS will spin up another instance to help processing the items in queue.