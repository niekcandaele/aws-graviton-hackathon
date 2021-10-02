import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { getMongoose } from '../models';


const handler: Handler = async function getMatches(event: APIGatewayEvent, context: Context) {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify({ error: 'id is required' }),
      isBase64Encoded: false
    }
  }

  const id = event.pathParameters.id

  const { Match } = await getMongoose();
  const match = await Match.findById(id)
    .populate('rounds')
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
        path: 'winningTeam',
        model: 'Team'
      }]
    })
    .lean()

  const body = { match };

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
    isBase64Encoded: false
  }

}

module.exports.handler = handler;