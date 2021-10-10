# Faceit scraper

Connects to the Faceit API, fetches a list of matches and their demofiles. The files get stored in S3 which in turn sends a message to SQS. 

This module is deployed to ECS as a scheduled Fargate task.