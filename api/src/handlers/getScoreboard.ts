import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { apiResponse } from '../lib/apiResponse';
import { getMongoose } from '../models';
import { IMatch } from '../models/Match';

interface IPlayerOnScoreboard {
  kills: number
  deaths: number
  id: string
  team: string
}

const handler: Handler = async function getScoreboard(event: APIGatewayEvent, context: Context) {
  if (!event.pathParameters || !event.pathParameters.id) {
    return apiResponse({ error: 'id is required' }, 400)
  }

  const id = event.pathParameters.id

  const { Match } = await getMongoose();
  const match = await Match.findById(id)
    // @ts-expect-error cba fixing this types thing, the plugin gets loaded but the types don't match
    .deepPopulate(
      [
        'teams.players',
        'rounds.kills.attacker',
        'rounds.kills.victim',
      ]
    );

  const players: Record<string, IPlayerOnScoreboard> = {}

  match.teams.map(t => t.players.map(p => {
    players[p._id] = {
      kills: 0,
      deaths: 0,
      id: p._id,
      team: t._id
    };
  }));


  getScores(match, players)
  return apiResponse({scoreboard: players});

}

module.exports.handler = handler;


function getScores(match: IMatch, scoreboard: Record<string, IPlayerOnScoreboard>) {
  for (const round of match.rounds) {
    if (round.type === 'KNIFE') {
      continue;
    }
    for (const kill of round.kills) {
      scoreboard[kill.attacker.player as unknown as string].kills++;
      scoreboard[kill.victim.player as unknown as string].deaths++;
    }
  }

}