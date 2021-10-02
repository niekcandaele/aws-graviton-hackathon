import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { apiResponse } from '../lib/apiResponse';
import { getMongoose } from '../models';


const handler: Handler = async function getKill(event: APIGatewayEvent, context: Context) {
  if (!event.pathParameters || !event.pathParameters.id) {
    return apiResponse({ error: 'id is required' }, 400)
  }

  const id = event.pathParameters.id

  const { PlayerKill } = await getMongoose();
  const kill = await PlayerKill.findById(id)
    .populate('attacker')
    .populate('victim')
    .populate('assister')
    .lean()

  const body = { kill };

  return apiResponse(body)

}

module.exports.handler = handler;