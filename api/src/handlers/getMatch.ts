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

  return apiResponse(body);

}

module.exports.handler = handler;