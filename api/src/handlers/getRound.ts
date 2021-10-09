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
        'kills.victim',
        'bombStatusChanges.player',
        'chickenDeaths.attacker',
        'grenades.attacker',
        'playerBlinds.attacker',
        'playerBlinds.victim'
]
    );

  const body = { round };

  return apiResponse(body);

}

module.exports.handler = handler;