# API

Lambda functions. Written in Typescript


## Routes

- `/matches`: Returns a paginated list of all matches in the database
- `/matches/{id}`: Returns details of a single match
- `/matches/{id}/scoreboard`: Calculates the scoreboard for a given match
- `/rounds/{id}`: Get details about a round (list of events that happened)
- `/stats`: Returns global stats.

## Deployment

Run `npm run pkg` before running the CDK deployment. This script will compile TypeScript and create a zip file, ready to upload to Lambda.