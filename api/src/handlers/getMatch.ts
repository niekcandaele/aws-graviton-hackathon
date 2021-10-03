import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { apiResponse } from '../lib/apiResponse';
import { getMongoose } from '../models';


const handler: Handler = async function getMatches(event: APIGatewayEvent, context: Context) {
  if (!event.pathParameters || !event.pathParameters.id) {
    return apiResponse({ error: 'id is required' }, 400)
  }

  const id = event.pathParameters.id

  const { Match } = await getMongoose();
  const match = await Match.findById(id)
    /*     .populate('rounds')
        .populate('teams')
        .populate({
          path: 'rounds',
          populate: [{
            path: 'kills',
            model: 'PlayerKill'
          },
          {
            path: 'bombStatusChanges',
            model: 'BombStatusChange'
          },
          {
            path: 'chickenDeaths',
            model: 'ChickenDeath'
          },
          {
            path: 'grenades',
            model: 'Grenade'
          },
          {
            path: 'playerHurts',
            model: 'PlayerHurt'
          },
          {
            path: 'playerBlinds',
            model: 'PlayerBlind'
          },
          {
            path: 'winningTeam',
            model: 'Team'
          }]
        }); */

    // @ts-expect-error cba fixing this types thing, the plugin gets loaded but the types don't match
    .deepPopulate(
      [
        'teams.players',
        'rounds.kills.attacker',
        'rounds.kills.victim',
        'rounds.bombStatusChanges.player',
        'rounds.chickenDeaths.attacker',
        'rounds.grenades.attacker',
//        'rounds.playerHurts.attacker',
//        'rounds.playerHurts.victim',
        'rounds.playerBlinds.attacker',
        'rounds.playerBlinds.victim'
]
    );

  const body = { match };

  return apiResponse(body);

}

module.exports.handler = handler;