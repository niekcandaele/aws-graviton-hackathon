import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { getMongoose } from '../models';


const handler: Handler = async function getKill(event: APIGatewayEvent, context: Context) {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ error: 'id is required' }),
      isBase64Encoded: false
    }
  }

  const id = event.pathParameters.id

  const { PlayerKill } = await getMongoose();
  const kill = await PlayerKill.findById(id)
    .populate('attacker')
    .populate('victim')
    .populate('assister')
    .lean()

  const body = { kill };

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
    isBase64Encoded: false
  }

}

module.exports.handler = handler;