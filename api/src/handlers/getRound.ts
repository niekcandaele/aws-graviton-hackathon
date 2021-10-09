import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { apiResponse } from '../lib/apiResponse';
import { getMongoose } from '../models';


const handler: Handler = async function getRound(event: APIGatewayEvent, context: Context) {
  if (!event.pathParameters || !event.pathParameters.id) {
    return apiResponse({ error: 'id is required' }, 400)
  }

  const id = event.pathParameters.id

  const { Round } = await getMongoose();
  const round = await Round.findById(id)
    // @ts-expect-error cba fixing this types thing, the plugin gets loaded but the types don't match
    .deepPopulate(
      [
        'kills.attacker',
        'kills.attacker.player',
        'kills.victim',
        'kills.victim.player',
        'bombStatusChanges.player',
        'bombStatusChanges.player.player',
        'chickenDeaths.attacker',
        'chickenDeaths.attacker.player',
        'grenades.attacker',
        'grenades.attacker.player',
        'playerBlinds.attacker',
        'playerBlinds.attacker.player',
        'playerBlinds.victim',
        'playerBlinds.victim.player'
]
    );

  const body = { round };

  return apiResponse(body);

}

module.exports.handler = handler;