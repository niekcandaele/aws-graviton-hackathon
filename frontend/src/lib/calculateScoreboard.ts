import { Match, Player, Team } from 'types/match';

export interface IPlayerOnScoreboard {
  kills: number
  deaths: number
  id: string
  team: string
}

export function calculateScoreboard(match: Match) {
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
  return players;
}


function getScores(match: Match, scoreboard: Record<string, IPlayerOnScoreboard>) {
  for (const round of match.rounds) {
    if (round.type === 'KNIFE') {
      continue;
    }
    for (const kill of round.kills) {
      scoreboard[kill.attacker.player].kills++;
      scoreboard[kill.victim.player].deaths++;
    }
  }

}