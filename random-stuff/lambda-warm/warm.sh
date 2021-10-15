#!/bin/sh

# Keep lambdas warm

# We used this during recording of the video
# Lambdas have cold start times
# By keeping them 'warm', they are much smoother in the video

doRequest() {
  echo "[$(date)] - Sending a request"
  curl -s $1 -H 'Accept: application/json, text/plain, */*'  --compressed -H 'Origin: https://bantr.app' > /dev/null

}


while true
do
  doRequest https://dn656qcaf2.execute-api.eu-west-1.amazonaws.com/prod/matches?page=1&limit=1
  doRequest https://dn656qcaf2.execute-api.eu-west-1.amazonaws.com/prod/matches/61672bae9fc37168216c0a57
  doRequest https://dn656qcaf2.execute-api.eu-west-1.amazonaws.com/prod/matches/61672bae9fc37168216c0a57/scoreboard
  doRequest https://dn656qcaf2.execute-api.eu-west-1.amazonaws.com/prod/rounds/61672bb39fc37168216c0a58
  doRequest https://dn656qcaf2.execute-api.eu-west-1.amazonaws.com/prod/stats
  sleep 60
done




